import { exec as _exec, spawn } from "node:child_process";
import { promisify } from "node:util";

const exec = promisify(_exec);

export const imperator = {
  sh: {
    exec: (command: string) => {
      const result = spawn("sh", ["-c", command], {
        stdio: "inherit",
        env: { ...process.env },
      });
      return result;
    },
  },
  package: {
    install: async (packages: string[]) => {
      console.log("Imediatly install packages:", packages);
      const result = await exec(`yay -S ${packages} --noconfirm`);
      console.log(result);
    },
    install2: async (packages: string[]) => {
      console.log("Imediatly install packages (with spawn):", packages);
      imperator.sh.exec(`yay -S ${packages.join(" ")}`);
    },
  },
};

export const i = imperator;
