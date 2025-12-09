import { exec as _exec, spawn } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";
import type { Config, PacmanPackage } from "./aria.types.ts";
import { l } from "./l.ts";
import { configureSddm } from "./modules/sddm.ts";
import { listDir, stow } from "./stow.ts";
import { IWDModule } from "./modules/iwd.ts";
import { DHCPCDModule } from "./modules/dhcpcd.ts";
import { DNSMASQModule } from "./modules/dnsmasq.ts";

const exec = promisify(_exec);

export const corelib = {
	exec: async (
		commands: string[],
		opts?: { cwd?: string; mode?: "buffered" | "realtime" | "inherit" },
	): Promise<{
		result: string | null;
		error: string | null;
		exitCode?: number | null;
	}> => {
		const cwd = opts?.cwd;
		const mode = opts?.mode ?? "buffered";
		const command = commands.join("\n");

		if (mode === "buffered") {
			try {
				const { stdout, stderr } = await exec(command, {
					shell: "/bin/bash",
					encoding: "utf8",
					cwd,
				});
				// stderr может содержать предупреждения; считаем ошибкой только если stdout пустой
				if (
					stderr &&
					stderr.trim().length > 0 &&
					(!stdout || stdout.trim().length === 0)
				) {
					return { result: null, error: stderr.trim(), exitCode: 0 };
				}
				return {
					result: stdout ? stdout.trim() : null,
					error: stderr && stderr.trim().length > 0 ? stderr.trim() : null,
					exitCode: 0,
				};
			} catch (e: unknown) {
				if (e && typeof e === "object") {
					const err = e as any;
					const msgParts: string[] = [];
					if (err.stderr) msgParts.push(String(err.stderr).trim());
					if (err.stdout) msgParts.push(`stdout: ${String(err.stdout).trim()}`);
					if (err.message) msgParts.push(String(err.message));
					return {
						result: null,
						error: msgParts.join("\n") || String(err),
						exitCode: err.code ?? null,
					};
				}
				return { result: null, error: String(e), exitCode: null };
			}
		}

		// Для realtime и inherit используем spawn
		return await new Promise((resolve) => {
			// Если нужно интерпретировать конвейеры/перенаправления — запускаем через bash -lc
			const child = spawn("bash", ["-lc", command], {
				cwd,
				shell: false,
				stdio: mode === "inherit" ? "inherit" : ["ignore", "pipe", "pipe"],
			});

			if (mode === "realtime") {
				// стримим в процессный stdout/stderr и накапливаем
				let stdout = "";
				let stderr = "";
				child.stdout!.setEncoding("utf8");
				child.stdout!.on("data", (chunk: string) => {
					stdout += chunk;
					process.stdout.write(chunk);
				});
				child.stderr!.setEncoding("utf8");
				child.stderr!.on("data", (chunk: string) => {
					stderr += chunk;
					process.stderr.write(chunk);
				});

				child.on("error", (err) => {
					resolve({ result: null, error: String(err), exitCode: null });
				});

				child.on("close", (code) => {
					if (code !== 0) {
						const errMsg =
							stderr.trim().length > 0
								? stderr.trim()
								: `Process exited with code ${code}`;
						resolve({ result: null, error: errMsg, exitCode: code });
						return;
					}
					resolve({
						result: stdout ? stdout.trim() : null,
						error: stderr && stderr.trim().length > 0 ? stderr.trim() : null,
						exitCode: code,
					});
				});
			} else {
				// mode === "inherit": child напрямую управляет терминалом, мы не получаем stdout/stderr сюда
				child.on("error", (err) => {
					resolve({ result: null, error: String(err), exitCode: null });
				});
				child.on("close", (code) => {
					if (code !== 0) {
						resolve({
							result: null,
							error: `Process exited with code ${code}`,
							exitCode: code,
						});
						return;
					}
					resolve({ result: null, error: null, exitCode: code });
				});
			}
		});
	},
	createSymlink: ({
		source,
		target,
		dryRun,
	}: {
		source: string;
		target: string;
		dryRun?: boolean;
	}) => {
		// const sourceDirs = listDir(path.resolve("dots", source));
		// sourceDirs.forEach((sourceDir) => {
		stow({ source: source, target: target, dryRun: dryRun });
		// });
	},
};

export const archlib = {
	installPackages: async (packages: string[]) => {
		let _packages = "";
		packages.forEach((p) => {
			_packages += p.concat(" ");
		});

		const { result, error } = await corelib.exec(
			[`yay -S ${_packages} --noconfirm --needed`],
			{ mode: "realtime" },
		);

		if (error) {
			if (error.includes("is up to date -- skipping")) {
				l("warn", `Packages already installed: ${_packages}`);
				return { result, error };
			}
			l("error", `Packages not installed: ${_packages}`);
			l("error", error);
			return { result, error };
		}
		l("success", `Packages installed: ${_packages}`);

		return { result, error };
	},
};

export const arialib = {
	installPackage: async (
		package_name: string,
		pacman_package: PacmanPackage,
	) => {
		const {
			dependencies: install,
			pre_install: pre_hook,
			post_install: post_hook,
		} = pacman_package;
		if (pre_hook) {
			const { result, error } = await corelib.exec(pre_hook);
			if (error) {
				l("error", `Execute pre_hook in ${package_name} failed`);
				l("error", error);
				// return { result, error };
			}
			l("success", `Execute pre_hook in ${package_name} executed`);
			l("success", result);
		}

		await archlib.installPackages(install);

		if (post_hook) {
			const { result, error } = await corelib.exec(post_hook);
			if (error) {
				l("error", `Execute post_hook in ${package_name} failed`);
				l("error", error);
			}
			l("success", `Execute post_hook in ${package_name} executed`);
			l("success", result);
		}
	},
};

export async function installYay() {
	const isAlreadyInstalled = await corelib.exec(["pacman -Qq | grep yay-bin"]);
	if (isAlreadyInstalled.result) {
		console.log("Yay is already installed!");
		return;
	}

	const commands = [
		"rm -rf /tmp/yay-bin",
		"git clone https://aur.archlinux.org/yay-bin /tmp/yay-bin",
		"cd /tmp/yay-bin",
		"makepkg -sric --noconfirm --needed -D /tmp/yay-bin/",
		"rm -rf /tmp/yay-bin",
	];
	commands.forEach((c) => {
		const output = exec(c);
		console.log(output);
	});
}

export async function getDisributiveName() {
	const {result, error} = await corelib.exec([
		`lsb_release -a 2>/dev/null | awk -F':' '/Distributor ID/ {gsub(/^[ \t]+/, "", $2); print $2}'`
	]) 
	console.log({result, error});
	
	return result
}

export async function aria(config: Config) {
	const distributiveName = await getDisributiveName() 
	l("info", `Apply config: ${config.name}`);
	l("info", `You use ${distributiveName} distributive`)

	// if (config.setupSystem.yay) {
	// 	if (config.setupSystem.yay.enabled) {
	// 		installYay()
	// 	}
	// }
	// l("info", "Configure sddm");
	if (config.setupSystem.internet) {
		l("info", "Configure internet");
		const modules = [
			new IWDModule(config.setupSystem.internet.iwd),
			new DHCPCDModule(config.setupSystem.internet.dhcpcd),
			new DNSMASQModule(config.setupSystem.internet.dnsmasq),
		]

		modules.map(module => module.apply())
	}

	// }

	// configureSddm(config.setupSystem.sddm);
	l("info", "Installing packages");
	Object.entries(config.setupSystem.packages).forEach(
		([package_name, pacman_package]) => {
			arialib.installPackage(package_name, pacman_package);
		},
	);
	// l("info", "Linking dots");
	// Object.entries(config.setupSystem.symlinks).forEach(([name, dots]) => {
	// 	corelib.createSymlink({ ...dots });
	// });
}
