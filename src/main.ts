import { i } from "../aria/core/imperator.ts";

const a = await i.sh.exec("sudo ls /root/");
// console.log(a);

// i.package.install2(["btop"]);

// const re = spawn("sudo", ["ls /root/"], { stdio: "inherit" });
// re.on("spawn", (a, b) => {
//   console.log({ a, b });
// });

// import z from "zod";
// import { ariaContext, createHost, createModule } from "../aria/aria.ts";
// import path from "node:path";
// import { baseModule } from "./modules/base.ts";
// import { iwd } from "../aria/plugins/iwd.ts";
// import { networkModule } from "./modules/network.ts";
// import treeify from "treeify/treeify.js";

// export const paths = {
//   files: path.resolve("files"),
//   config: {
//     base: path.resolve("files", "config"),
//     hypr: path.resolve("files", "config", "hypr"),
//   },
//   etc: {
//     base: path.resolve("files", "etc"),
//     iwd: path.resolve("files", "etc", "iwd"),
//   },
// };

// const notebookHost = createHost({
//   name: "Notebook",
//   packages: ["base", "base-devel", "linux", "linux-firmware"],
//   apply: async () => {
//     baseModule();
//     // networkModule();
//   },
// });

// // Обертка для отрисовки дерева
// function drawGraph(label: string, node: any, indent = "", isLast = true) {
//   const marker = isLast ? "└── " : "├── ";

//   // Если корень сам по себе простой тип или массив
//   if (typeof node !== "object" || node === null || Array.isArray(node)) {
//     const displayValue = Array.isArray(node)
//       ? `[${node.join(", ")}]`
//       : String(node);
//     console.log(`${indent}${marker}${label}: ${displayValue}`);
//     return;
//   }

//   // Выводим лейбл текущего узла
//   console.log(`${indent}${marker}${label}`);

//   const newIndent = indent + (isLast ? "    " : "│   ");
//   const keys = Object.keys(node);

//   keys.forEach((key, index) => {
//     const lastChild = index === keys.length - 1;
//     const value = node[key];

//     // Если это вложенный объект (и не массив), идем вглубь
//     if (typeof value === "object" && value !== null && !Array.isArray(value)) {
//       drawGraph(key, value, newIndent, lastChild);
//     } else {
//       // Это примитив или массив — выводим на одной строке вместе с ключом
//       const leafMarker = lastChild ? "└── " : "├── ";
//       const displayValue = Array.isArray(value)
//         ? `[${value.join(", ")}]`
//         : String(value);

//       // Можно добавить цвета для значений, если выводишь в консоль
//       console.log(`${newIndent}${leafMarker}${key}: ${displayValue}`);
//     }
//   });
// }

// const graph = {
//   magicbook: {
//     desktop: true,
//     wifi: true,
//     packages: ["one", 2],
//     test: {
//       one: 1,
//       two: 2,
//     },
//   },
// };

// drawGraph("Aria execution plan:", graph);

// // notebookHost();

// // ariaContext.pkg.install(["hyprland", { package: "waybar", version: "12.0.1" }]);

// // console.log(output);
