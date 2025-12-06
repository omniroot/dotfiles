import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import type { SDDMConfig } from "../aria.types.ts";
import { l } from "../l.ts";
import { listDir } from "../stow.ts";
import { arialib, corelib } from "../utils.ts";

export async function configureSddm({
	enable,
	wayland,
	themesPath,
	theme,
}: SDDMConfig) {
	let str = `[General]`;

	if (enable) {
		const { error } = await corelib.exec(["systemctl enable sddm"]);
		if (error) {
			l("error", `Sddm enable error:`);
			l("error", error);
		}
		l("success", `Sddm enabled`);
	}

	if (wayland) {
		str += `
    DisplayServer = wayland;
    GreeterEnvironment = QT_WAYLAND_SHELL_INTEGRATION = layer - shell[Theme];
    \n
    `;
	}

	if (themesPath) {
		const _path = path.resolve("dots", themesPath);
		// console.log(_path);

		const dirs = listDir(_path);
		dirs.forEach((dir) => {
			// console.log(dir);

			corelib.createSymlink({
				source: dir,
				target: "/usr/share/sddm/themes/",
				dryRun: false,
			});
		});
		// console.log({ _path, dirs });
	}

	if (theme) {
		str += `
    Current = ${theme};
    `;
	}

	try {
		// await fs.writeFile("/etc/sddm.conf", str, {
		// 	encoding: "utf-8",
		// 	flag: "w",
		// 	mode: 1,
		// });
		const { output, stderr, stdout } = spawnSync(
			"sudo",
			["tee", "/etc/sddm.conf"],
			{
				input: Buffer.from(str),
			},
		);
		console.log({ output, stderr, stdout });

		l("success", "Sddm.conf writed");
	} catch (error) {
		console.error("Ошибка записи sddm.conf :", error);
	}
}
