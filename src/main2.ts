// Architector - то к чему обращается пользователь через ctx
// Resolver - решает пробелмы, дублирование, порядок и т.д
// Imperator - Императивные утилиты для работы с системой

type Event =
  | { type: "package"; action: "install" | "remove"; packages: string[] }
  | { type: "service"; action: "enable" | "disable" };

class Context {
  private graph: Event[] = [];

  package = {
    install: (packages: string[]) => {
      this.graph.push({
        type: "package",
        action: "install",
        packages: packages,
      } as Event);
    },
    remove: (packages: string[]) => {
      this.graph.push({
        type: "package",
        action: "remove",
        packages: packages,
      } as Event);
    },
  };

  apply() {
    console.log(this.graph);
    console.log("============================");

    this.graph.forEach((event) => {
      switch (event.type) {
        // === PACKAGE ===
        case "package": {
          switch (event.action) {
            case "install": {
              console.log("Install packages: ", event.packages);
              break;
            }
            case "remove": {
              console.log("Remove packages: ", event.packages);
              break;
            }
          }
          break;
        }
        // === SERVICE ===
        case "service": {
          console.log(123);
          break;
        }
      }
    });
  }
}

const ctx = new Context();

ctx.package.install(["hyprland", "waybar", "dms-shell-bin"]);
ctx.package.remove(["waybar"]);
ctx.apply();
