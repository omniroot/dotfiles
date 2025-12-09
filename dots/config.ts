const config: Config = {
	installSystem: {
		hostname: "omniinstallpc",
		formatDisk: true,
		locales: ["en_US.UTF-8 UTF-8"],
		timezone: "Europe/Moscow",
		users: {
			root: {
				password: "sd",
			},
			omniroot: {
				password: "sd",
				groups: ["wheel"], // vboxsf
			},
		},
		packages: [
			"base",
			"base-devel",
			"linux",
			"linux-firmware",
			"amd-ucode",
			"btrfs-progs",
			"grub",
			"grub-btrfs",
			"efibootmgr",
			"os-prober",
			"sudo",
			"git",
			"micro",
			"fastfetch", // for test
			"iwd",
			"dhcpcd",
			"dnsmasq",
			// Drivers
			// "mesa",
			// "vulkan-radeon",
			// "libva-mesa-driver",
			// "mesa-vdpau",
		],

		bootloader: {
			mode: "bios",
			/* под BIOS это просто путь к диску, куда ставить GRUB */
			targetDisk: "/dev/sda",
			/* опционально: дополнительные параметры grub-install */
			grubArgs: [],
		},

		partitions: {
			boot: {
				partition: "/dev/sda1",
				fs: "fat32", // или "fat32" / "ext4" / "btrfs"
				format: true,
				mountpoint: "/boot", // в целевой системе -> будет /mnt/boot при установке
				options: [],
			},
			root: {
				partition: "/dev/sda2",
				fs: "btrfs",
				format: true,
				mountpoint: "/", // корень целевой системы
				options: ["compress=zstd", "noatime"],
				subvolumes: [
					{ name: "@", path: "/" }, // @ -> /
					{ name: "@var", path: "/var" }, // @var -> /var
					{ name: "@log", path: "/var/log" }, // @log -> /var/log
				],
			},

			home: {
				partition: "/dev/sda3",
				fs: "btrfs",
				format: true,
				mountpoint: "/home", // будет /mnt/home
				options: ["compress=zstd"],
				subvolumes: [{ name: "@home", path: "/home" }],
			},
		},
	},
};

// ip addr -- enp0s3
// sudo dhcpcd enp0s3 -- поднять сеть вручную

// pipewire: {
// 	install: ["pipeire", "pipewire-audio", "pipewire-pulse", "wireplumber"],
// 	services: {
// 		openrc: ["rc-update add pipewire default", "rc-service pipewire start"],
// 		systemd: ["systemctl enable --now pipewire"],
// 	},
// 	// поле для  post_hook pre_hook: "comand" || ["command1", "command2"]
// },

export default config;
