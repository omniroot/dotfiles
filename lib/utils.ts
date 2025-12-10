import { exec as _exec,  } from "node:child_process";
import { spawn as _spawn } from "node:child_process";
import path from "node:path";
import fs from "node:fs";
import os from "node:os";
import { promisify } from "node:util";
import type { Config, PacmanPackage } from "./aria.types.ts";
import { l } from "./l.ts";
import { listDir, stow } from "./stow.ts";
import pty from "@lydell/node-pty"
// let pty: typeof import("node-pty") | null = null;
// try {
//   // eslint-disable-next-line @typescript-eslint/no-var-requires
//   pty = require("node-pty");
// } catch {
//   pty = null;
// }

const exec = promisify(_exec);

export type ExecMode = "buffered" | "inherit";
export type ExecResult = { result: string | null; error: string | null; exitCode?: number | null };

const PROMPT_RE = /\b(password|парол|sudo password|enter pass|passphrase|y\/n|yes\/no|confirm)\b/i;
function setRawMode(on: boolean) {
  try { if (process.stdin.isTTY) process.stdin.setRawMode?.(on); } catch {}
}

interface execOpts {
	cwd?: string; mode?: ExecMode; root?: boolean; forcePty?: boolean
}

export const corelib = {
	/**
   * Выполнить команды в bash.
   * commands: строки, объединяются через \n
   * opts:
   *  - cwd?: рабочая директория
   *  - mode?: "buffered" | "inherit"
   *  - root?: запуск через sudo -E
   *  - forcePty?: для mode="inherit" — использовать node-pty (если доступен)
   */
	exec: async (
    commands: string[],
    opts?: { cwd?: string; mode?: ExecMode; root?: boolean; forcePty?: boolean },
  ): Promise<ExecResult> => {
    const cwd = opts?.cwd;
    const mode: ExecMode = opts?.mode ?? "buffered";
    const runAsRoot = Boolean(opts?.root);
    const forcePty = Boolean(opts?.forcePty);
    const rawCommand = commands.join("\n").trim();
    if (!rawCommand) return { result: null, error: null, exitCode: 0 };
    const command = runAsRoot ? `sudo -E bash -lc ${JSON.stringify(rawCommand)}` : rawCommand;

    if (mode === "buffered") {
      try {
        const { stdout, stderr } = await exec(command, { shell: "/bin/bash", encoding: "utf8", cwd });
        const out = stdout?.trim() ?? null;
        const err = stderr?.trim() ?? null;
        if (err && !out) return { result: null, error: err, exitCode: 0 };
        return { result: out, error: err ?? null, exitCode: 0 };
      } catch (e: unknown) {
        const err = e as any;
        const parts: string[] = [];
        if (err.stderr) parts.push(String(err.stderr).trim());
        if (err.stdout) parts.push(`stdout: ${String(err.stdout).trim()}`);
        if (err.message) parts.push(String(err.message));
        return { result: null, error: parts.join("\n") || String(err), exitCode: err.code ?? null };
      }
    }

    // mode === "inherit"
    // Если forcePty не запрошен или node-pty не доступен — простой inherit
    if (!forcePty || !pty) {
      return await new Promise<ExecResult>((resolve) => {
        const child = _spawn("bash", ["-lc", command], { cwd, shell: false, stdio: "inherit" });
        child.on("error", (err) => resolve({ result: null, error: String(err), exitCode: null }));
        child.on("close", (code) => {
          if (code !== 0) resolve({ result: null, error: `Process exited with code ${code}`, exitCode: code });
          else resolve({ result: null, error: null, exitCode: code });
        });
      });
    }

    // forcePty && pty available
    return await new Promise<ExecResult>((resolve) => {
      const shell = os.platform() === "win32" ? "powershell.exe" : "bash";
      const p = pty!.spawn(shell, ["-lc", command], {
        name: "xterm-color",
        cols: process.stdout.columns || 80,
        rows: process.stdout.rows || 24,
        cwd: cwd ?? process.cwd(),
        env: process.env,
      });

      let acc = "";
      let promptSeen = false;
      let promptBuffer = "";

      const MAX_PROMPT_SCAN = 2048;

      // PTY -> stdout (always)
      p.onData((chunk: string) => {
        acc += chunk;
        // maintain promptBuffer
        promptBuffer += chunk;
        if (promptBuffer.length > MAX_PROMPT_SCAN) promptBuffer = promptBuffer.slice(-MAX_PROMPT_SCAN);

        // write output to real stdout immediately
        try { process.stdout.write(chunk); } catch {}

        // detect prompt
        if (!promptSeen && PROMPT_RE.test(promptBuffer)) {
          promptSeen = true;
          // enable raw mode to capture keystrokes individually
          setRawMode(true);
        }
      });

      // stdin -> PTY
      const onStdin = (buf: Buffer) => {
        // forward all keystrokes to PTY
        try { p.write(buf.toString()); } catch {}
        // if prompt was seen and Enter pressed -> exit raw mode
        if (promptSeen && (buf.includes(10) || buf.includes(13))) {
          promptSeen = false;
          setRawMode(false);
        }
      };

      // attach stdin
      try {
        process.stdin.resume();
        setRawMode(false);
        process.stdin.on("data", onStdin);
      } catch (err) {
        process.stdin.off("data", onStdin);
        setRawMode(false);
        resolve({ result: null, error: String(err), exitCode: null });
        return;
      }

      const cleanup = (code: number | null, errMsg: string | null) => {
        try { process.stdin.off("data", onStdin); } catch {}
        setRawMode(false);
        resolve({ result: null, error: errMsg, exitCode: code });
      };

      p.onExit((ev: { exitCode: number; signal?: number }) => {
        const code = ev.exitCode ?? null;
        if (code !== 0) cleanup(code, `Process exited with code ${code}`);
        else cleanup(code, null);
      });

      const onSig = () => {
        try { p.kill(); } catch {}
        cleanup(null, "Interrupted");
      };
      process.once("SIGINT", onSig);
      process.once("SIGTERM", onSig);
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
		const name = path.basename(source)
		const dest = path.join(expandHome(target), name)
		const isExist = fs.existsSync(dest)
		const _source = expandHome(source)
		const _target = expandHome(target)

		function expandHome(p: string) {
			return p.startsWith("~") ? path.join(process.env.HOME || "", p.slice(1)) : p;
		}

		const isDir = fs.lstatSync(source).isDirectory();
		console.log({ source: _source, target: _target, dest, isExist: isExist, isDir: isDir });

		try {
			if (isExist) {
				fs.rmSync(dest, { recursive: true, force: true })
			}
			fs.symlinkSync(_source, dest, isDir ? "dir" : "file")
			l("success", `Symlink done, ${_source}, ${_target}, ${isDir}`)

		} catch (error) {
			l("error", `Error symlink, ${_source}, ${_target}, ${isDir}`)
			l("error", error)
		}
		// const sourceDirs = listDir(path.resolve("dots", source));
		// sourceDirs.forEach((sourceDir) => {
		// stow({ source: source, target: target, dryRun: true });
		// try {
		// 		if (isDir) {
		// 			fs.symlinkSync(
		// 				rel,
		// 				dest,
		// 				
		// 			);
		// 		} else {
		// 			fs.symlinkSync(rel, dest);
		// 		}
		// 	} catch {
		// 		fs.symlinkSync(rel, dest);
		// 	}
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
			[`yay -S ${_packages} --noconfirm --needed`], { mode: "inherit", forcePty: false }
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
	const { result, error } = await corelib.exec([
		`lsb_release -a 2>/dev/null | awk -F':' '/Distributor ID/ {gsub(/^[ \t]+/, "", $2); print $2}'`
	])
	console.log({ result, error });

	return result
}

export async function aria(config: Config) {
	// const distributiveName = await getDisributiveName() 
	// l("info", `Apply config: ${config.name}`);
	// l("info", `You use ${distributiveName} distributive`)

	// if (config.setupSystem.yay) {
	// 	if (config.setupSystem.yay.enabled) {
	// 		installYay()
	// 	}
	// }
	// l("info", "Configure sddm");
	// configureSddm(config.setupSystem.sddm);
	l("info", "Installing packages");
	Object.entries(config.setupSystem.packages).forEach(
		([package_name, pacman_package]) => {
			arialib.installPackage(package_name, pacman_package);
		},
	);
	const dots_path = path.resolve("dots")
	l("info", "Linking dots");
	Object.entries(config.setupSystem.symlinks).forEach(([name, dots]) => {
		const source = path.resolve(dots_path, dots.source)
		const target = dots.target
		// console.log({source, target});
		listDir(source).forEach((configDir) => {
			// console.log({source: configDir, target});
			corelib.createSymlink({ source: configDir, target });


		})
	})

	// });
	// const link = path.resolve("dots", "config", "hypr")
	// console.log(link);

	// corelib.createSymlink({ source: link, target: "~/.config" });
	// const source = "/usr/local/share/dotfiles/dots/config/hypr/"
	// const target = "~/.config/"





	// if (config.setupSystem.internet) {
	// 	l("info", "Configure internet");
	// 	const modules = [
	// 		new IWDModule(config.setupSystem.internet.iwd),
	// 		new DHCPCDModule(config.setupSystem.internet.dhcpcd),
	// 		new DNSMASQModule(config.setupSystem.internet.dnsmasq),
	// 	]

	// 	modules.map(module => module.apply())
	// }





}
