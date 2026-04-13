import { createModule } from "../../aria/aria.ts";
import { paths } from "../main.ts";

export const DEModule = createModule({
  name: "DE",
  packages: [
    // "hyprland",
    // "noctalia-shell",
    // "dunst",
    // "file-roller",
    // "tumbler",
    // "nautilus",
    "dms-shell-bin",
    "zen-browser-bin",
  ],
  apply: (ctx) => {
    ctx.fs.link(paths.config.hypr, "~/.config/hypr");
  },
});

const module = createModule({
  name: "module",
  apply: () => {
    return 123;
  },
});

const result = module();
