import { exec } from "node:child_process";
import { mkdir, symlink, writeFile } from "node:fs/promises";
import { homedir, userInfo } from "node:os";
import type { z } from "zod";

type Package =
  | string
  | {
      package: string;
      version?: string;
    };

export const expandPath = (path: string) => {
  const result = path
    .replaceAll("$USER", userInfo().username)
    .replaceAll("~/", `${homedir()}/`);
  return result;
};

class GlobalContext {
  private pendingPackages: string[] = [];

  pkg = {
    install: (pkgs: Package[]) => {
      const names = pkgs.map((p) => (typeof p === "string" ? p : p.package));
      this.pendingPackages.push(...names);
    },
  };

  fs = {
    write(path: string, content: string) {
      return writeFile(path, content);
    },
    mkdir(path: string) {
      return mkdir(path, { recursive: true });
    },
    link(source: string, target: string) {
      const _source = expandPath(source);
      const _target = expandPath(target);
      console.log(`[LINK]: ${_source} -> ${_target}`);
      symlink(_source, _target);
    },
  };

  log = {
    info(...message: string[]) {
      console.log("[info]", ...message);
    },
    error(...message: string[]) {
      console.error("[error]", ...message);
    },
  };

  apply() {
    const packages = this.pendingPackages.join(" ");
    console.log("Packages to install: ", this.pendingPackages);
    exec(`kitty yay -S ${packages} --noconfirm --needed`);
  }
}

type AnyZodSchema = z.ZodType<any, any, any>;

const globalContext = new GlobalContext();

export const createHost = (config: {
  name: string;
  packages?: Package[];
  apply: (ctx: GlobalContext) => void;
}) => {
  globalContext.log.info(`Start host: ${config.name}`);
  globalContext.pkg.install(config.packages ?? []);
  return () => {
    config.apply?.(globalContext);
    globalContext.apply();
  };
};

export const createModule = <
  TSchema extends AnyZodSchema | undefined = undefined,
  TResult = void,
>(config: {
  name: string;
  packages?: Package[];
  schema?: TSchema;
  apply?: (
    ctx: GlobalContext,
    options: TSchema extends AnyZodSchema ? z.infer<TSchema> : void,
  ) => TResult;
}) => {
  return async (
    userOpts?: TSchema extends AnyZodSchema ? z.input<TSchema> : void,
  ) => {
    // 1. Валидируем опции только в момент вызова!
    const parsedOpts = config.schema
      ? config.schema.parse(userOpts ?? {})
      : undefined;

    globalContext.log.info(`Start module: ${config.name}`);

    globalContext.pkg.install(config.packages ?? []);

    // 2. Выполняем логику
    return config.apply?.(globalContext, parsedOpts as any);
  };
};
