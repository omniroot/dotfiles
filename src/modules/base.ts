import z from "zod";
import { createModule } from "../../aria/aria.ts";
import { DEModule } from "./de.ts";

export const baseModule = createModule({
  name: "Base",
  packages: [],
  schema: z.object({
    init: z.enum(["systemd", "runit"]).default("runit"),
  }),
  apply: (ctx, opts) => {
    // console.log(123);
    DEModule();

    // switch (opts.init) {
    //   case "systemd":
    //     console.log("systemd");
    //     break;
    //   case "runit":
    //     console.log("runit");
    //     break;
    //   default:
    //     console.log("default");
    //     break;
    // }
  },
});
