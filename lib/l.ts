type Status = "success" | "info" | "warn" | "error" | "debug";

const STATUS_COLOR: Record<string, string> = {
	success: "\u001b[32m", // зеленый
	info: "\u001b[36m", // циан
	warn: "\u001b[33m", // желтый
	error: "\u001b[31m", // красный
	debug: "\u001b[35m", // магента
	default: "\u001b[0m", // сброс
};

function padRight(s: string, len: number) {
	return s.length >= len ? s : s + " ".repeat(len - s.length);
}

/**
 * l(status, message, meta?)
 * - status: string — метка статуса (влияет на цвет)
 * - message: any — основное сообщение (string | object)
 * - meta: optional object — доп. данные, будут JSON.stringify
 */
export function l(status: Status, message: any, meta?: any) {
	const color = STATUS_COLOR[status] ?? STATUS_COLOR["default"];
	const reset = "\u001b[0m";
	// const time = new Date().toISOString();
	// const label = padRight(String(status).toUpperCase(), 4); // фиксированная ширина метки
	const label = String(status).toUpperCase(); // фиксированная ширина метки

	const msg =
		typeof message === "string" ? message : JSON.stringify(message, null, 2);

	const metaStr = meta === undefined ? "" : " " + JSON.stringify(meta, null, 2);

	console.log(`${color}[${label}]${reset} ${msg}${metaStr}`);
}
