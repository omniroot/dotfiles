import z from "zod";
import { createPlugin } from "../aria.ts";



export const hyprland = createPlugin({
   name:"hyprland",
   schema: z.object({
    padding: z.number(), // Обязательное поле
    gaps: z.boolean().default(true), // Дефолтное (необязательное для пользователя)
  }),
  packages: ["hyprland"],
  //  options: 
   apply: (ctx, opts) => {
    if (opts.gaps) {
      // apply gaps to config
    }
   }
})



// hyprland({})