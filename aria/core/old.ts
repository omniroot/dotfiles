// exec2: (
//       command: string,
//       opts: { interactive?: boolean; timeout?: number } = {},
//     ): Promise<{ code: number; signal?: NodeJS.Signals }> => {
//       const { interactive = false, timeout = 300_000 } = opts;

//       // 1. Безопасный парсинг: используем sh -c или просим массив аргументов
//       //    (для продакшена лучше принимать [cmd, ...args], но для удобства оставим строку)
//       const child = spawn("sh", ["-c", command], {
//         stdio: interactive ? "inherit" : ["pipe", "pipe", "pipe"],
//         env: { ...process.env },
//       });

//       // 2. Форвард сигналов (Ctrl+C → дочерний процесс)
//       const forward = (sig: NodeJS.Signals) => child.kill(sig);
//       process.on("SIGINT", forward);
//       process.on("SIGTERM", forward);

//       return new Promise((resolve, reject) => {
//         // 3. Таймаут на случай зависания (особенно sudo без TTY)
//         const timer = setTimeout(() => {
//           child.kill("SIGKILL");
//           reject(new Error(`Command timed out after ${timeout / 1000}s`));
//         }, timeout);

//         child.on("close", (code, signal) => {
//           clearTimeout(timer);
//           process.off("SIGINT", forward);
//           process.off("SIGTERM", forward);
//           // @ts-expect-error ai bullshit
//           resolve({ code: code ?? 1, signal });
//         });

//         child.on("error", (err) => {
//           clearTimeout(timer);
//           reject(err);
//         });
//       });
//     },
