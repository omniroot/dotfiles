export interface PartitionsConfig {
	[key: string]: {};
}

export interface InstallSystemConfig {
	hostname: string;
	formatDisk: boolean;
	language?: string;
	/**
	 * - Find your timezone in /etc/locale.gen (with UTF-8)
	 * - Put in this format:
	 * @example
	 * locales: ["en_US.UTF-8 UTF-8", "ru_RU.UTF-8 UTF-8"]
	 */
	locales: string[];
	/**
	 * - Find your timezone in /usr/share/zoneinfo/
	 * - Put in this format:
	 * @example
	 * timezone: "Europe/Moscow"
	 * timezone: "Brazil"
	 * timezone: "US/Michigan"
	 */
	timezone: string;
	users: {};
	packages: string[];
	bootloader: {};
	partitions: PartitionsConfig;
}

export type SystemInitialization = "systemd" | "openrc";

export interface PacmanPackage {
	dependencies: string[];
	config?: {
		source: string;
		target: string;
	};
	services?: Record<SystemInitialization, string[]>;
	pre_install?: string[];
	post_install?: string[];
}

interface Dots {
	source: string;
	target: string;
}

export interface SetupSystemConfig {
	packages: Record<string, PacmanPackage>;
	symlinks: Record<string, Dots>;
}

export interface Config {
	name: string;
	//: InstallSystemConfig;
	setupSystem: SetupSystemConfig;
}
