

export function installNextdns() {
	const which = exec("which nextdns");
	if (!which) {
		exec('sh -c "$(curl -sL https://nextdns.io/install)"');
	}
	console.log("Nextdns already installed");
}
