import path from "node:path";
import { packages } from "./packages.ts";
import {
	exec,
	installNextdns,
	installPackages,
	installYay,
	listDir,
	stow,
} from "./utils.ts";

// =============
const configDirs = listDir(path.resolve("dots", "config"));
const homeDirs = listDir(path.resolve("dots", "home"));
const etcDirs = listDir(path.resolve("dots", "etc"));
const desktopDirs = listDir(path.resolve("dots", "desktop"));
const binDirs = listDir(path.resolve("dots", "bin"));
const configTarget = "~/.config/";
const homeTarget = "~/";
const etcTarget = "/etc/";
const desktopTarget = "~/.local/share/applications/";
const binTarget = "~/.local/bin/";
// =============

console.log({ configDirs, homeDirs });

// ==== INSTALL PACKAGES ==== //
console.log(" ==== LINK DOTS ====");
configDirs.forEach((configDir) => {
	stow({ source: configDir, target: configTarget });
});

homeDirs.forEach((homeDir) => {
	stow({ source: homeDir, target: homeTarget });
});

etcDirs.forEach((etcDir) => {
	stow({ source: etcDir, target: etcTarget });
});

desktopDirs.forEach((desktopDir) => {
	stow({ source: desktopDir, target: desktopTarget });
});

binDirs.forEach((binDir) => {
	stow({ source: binDir, target: binTarget });
});

console.log(" ==== UPDATE DESKTOP FILES ====");
exec(`update-desktop-database ${desktopTarget}`);

// ==== INSTALL YAY ==== //
console.log(" ==== INSTALL YAY ====");
installYay();
console.log(" ==== INSTALL NEXTDNS ====");

installNextdns();

// дописать установку
// dhcpcd ( линукануть /etc/dhcpcd.conf )
// nextdns
// расширить скрипт что бы он сам устанавливал пакеты и умел настраивать systemd сервисы

// ==== INSTALL PACKAGES ==== //
console.log(" ==== INSTALL PACKAGES ====");
const output = installPackages(packages);
console.log(output);
