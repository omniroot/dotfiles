import type { Config } from "./aria.types.ts";
import { aria } from "./utils.ts";

console.log("ARIA ");
console.log("Actually Readable Installation Approach");

const testConfig: Config = {
	name: "Arch + Hyprland config",
	setupSystem: {
		sddm: {
			enable: true,
			wayland: true,
			themesPath: "./config/sddm/themes/",
			theme: "omniroot",
		},
		packages: {
			DesktopEnviroment: {
				dependencies: ["hyprland"],
				pre_install: [`echo "before hyprland"`],
				post_install: [`echo "after hyprland"`],
			},
		},
		symlinks: {
			config: {
				source: "./config",
				target: "~/.config",
			},
			home: {
				source: "./home",
				target: "~/",
			},
			desktop: {
				source: "./desktop",
				target: "~/.local/share/applications/",
			},
			bin: {
				source: "./bin",
				target: "~/.local/bin/",
			},
			etc: {
				source: "./etc",
				target: "/etc/",
			},
		},
	},
};

aria(testConfig);
