export function installYay() {
	const isAlreadyInstalled = !!exec("pacman -Qq | grep yay-bin");
	if (isAlreadyInstalled) {
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

export function installNextdns() {
	const which = exec("which nextdns");
	if (!which) {
		exec('sh -c "$(curl -sL https://nextdns.io/install)"');
	}
	console.log("Nextdns already installed");
}
