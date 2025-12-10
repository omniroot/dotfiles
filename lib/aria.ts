import type { Config } from "./aria.types.ts";
import { aria } from "./utils.ts";

console.log("ARIA ");
console.log("Actually Readable Installation Approach");

const testConfig: Config = {
	name: "Arch + Hyprland config",
	setupSystem: {
		yay: {
			enabled: true
		},
		internet: {
			iwd: {
				enabled: true
			},
			dhcpcd: { enabled: true },
			dnsmasq: {
				enabled: true
			}
		},
		sddm: {
			enable: true,
			wayland: true,
			// themesPath: "./config/sddm/themes/",
			// theme: "omniroot",
		},
		packages: {
			DesktopEnviroment: {
				dependencies: [
					"hyprland",
					"hyprpicker-git",
					"hyprlock",
					"hyprshot",
					"hyprsunset",
					"waypaper",
					"sddm",
					"waybar",
					"swww",
					"pavucontrol",
					"dunst",
					"rofi-wayland",
					// "thunar",
					// "thunar-volman",
					// "thunar-archive-plugin",
					"tumbler",
					"gvfs",
					"matugen-bin",
					"qt5ct",
					"qt6ct",
					"kvantum",
					"nwg-look",
					"lxappearance",
					// "wlogout",
					"blueman",
					"bluez",
					"kdeconnect",
					"gnome-disk-utility",
					"file-roller",
					"polkit-gnome",
					"hyprpolkitagent",
					"gtk-engine-murrine",
					"gnome-themes-extra",
					"sassc",
					"auto-cpufreq",
					"brightnessctl",
					// "hyprwayland-scanner-git",
					"python-pywalfox",
					"numix-circle-icon-theme-git",
					"bibata-cursor-theme",
				],
			},
			Development: {
				dependencies: ["bun-bin"],
			},
			Terminal: {
				dependencies: ["zsh eza zoxide fzf jq android-tools ncdu oh-my-posh-bin"],
			},
			Drivers: {
				dependencies: ["bun-bin"],
			},
		},
		symlinks: {
			config: {
				source: "./config/",
				target: "~/.config/",
			},
			home: {
				source: "./home",
				target: "~/",
			},
			// desktop: {
			// 	source: "./desktop",
			// 	target: "~/.local/share/applications/",
			// },
			// bin: {
			// 	source: "./bin",
			// 	target: "~/.local/bin/",
			// },
			// etc: {
			// 	source: "./etc",
			// 	target: "/etc/",
			// },
		},
	},
};

aria(testConfig);
