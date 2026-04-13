import z from "zod";
import { createPlugin } from "../aria.ts";

export const dhcpcd = createPlugin({
  name: "dhcpcd",
  packages: ["dhcpcd", "dhcpcd-runit"],
  schema: z.object({
    noHook: z.array(z.enum(["resolv.conf"])).optional(),
  }),
  apply: (ctx, opts) => {
    const content = `
    ${opts.noHook ? `nohook ${opts.noHook}` : ""}
    `;
    ctx.fs.write("/etc/dhcpcd.conf", content);
  },
});
