import { type ChildProcess, spawn } from "node:child_process";

class SudoSession {
  private p: ChildProcess | null = null;
  async start() {
    // один раз спросит пароль
    await new Promise((res, rej) => {
      const p = spawn("sudo", ["-v"], { stdio: "inherit" });
      // @ts-expect-error sudo bullshit
      p.on("exit", (c) => (c === 0 ? res() : rej()));
      p.on("error", rej);
    });

    // keep-alive
    this.p = spawn(
      "sh",
      ["-c", "while true; do sudo -n true; sleep 60; done"],
      { stdio: "ignore" },
    );

    this.p.unref();
  }

  stop() {
    this.p?.kill();
  }
}

export const sudoSession = new SudoSession();
