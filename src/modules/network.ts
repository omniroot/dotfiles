import z from "zod";
import { createModule } from "../../aria/aria.ts";
import { dhcpcd } from "../../aria/plugins/dhcpcd.ts";
import { iwd } from "../../aria/plugins/iwd.ts";

export const networkModule = createModule({
  name: "network",
  schema: z.object({
    dns: z.string().default("192.168.1.1"),
  }),
  apply: async (ctx, opts) => {
    await dhcpcd({});
    await iwd();

    ctx.fs.write(
      "/etc/resolf.conf",
      `
      nameserver ${opts.dns}
      `,
    );
  },
});
