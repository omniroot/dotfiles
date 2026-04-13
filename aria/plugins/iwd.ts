import z from "zod";
import { createPlugin } from "../aria.ts";
import { paths } from "../../src/main.ts";

export const iwd = createPlugin({
  name: "iwd",
  packages: ["iwd", "iwd-runit", "openresolv"],
  schema: z.object({
    enableNetworkConfiguration: z.boolean().default(true),
    disablePeriodicScan: z.boolean().default(false),
    initialPeriodicScanInterval: z.number().default(10),
    periodicScanInterval: z.number().default(20),
  }),
  apply: (ctx, opts) => {
    const result = `
    [General]
      EnableNetworkConfiguration=${opts.enableNetworkConfiguration}
    [Scan]
      DisablePeriodicScan=${opts.disablePeriodicScan}
      InitialPeriodicScanInterval=${opts.initialPeriodicScanInterval}
      PeriodicScanInterval=${opts.periodicScanInterval}
    `;
    ctx.fs.mkdir("/etc/iwd/");
    return ctx.fs.write("/etc/iwd/main.conf", result);
    // ctx.fs.link(paths.etc.iwd, "/etc/");
  },
});
