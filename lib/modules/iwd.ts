import { l } from "../l";
import { corelib } from "../utils";
import type { Module, ModuleConfig } from "./module";

export interface IWDConfig extends ModuleConfig {
}

export class IWDModule implements Module {
    config: IWDConfig | undefined;

    constructor(config: IWDConfig | undefined) {
        this.config = config
    }

    enable() {
        corelib.exec(["systemctl enable --now iwd"])
        l("success", `IWD Service enabled`)
    }

    disable() {
        corelib.exec(["systemctl disable iwd"])
        l("success", `IWD Service disabled`)
    }

    apply() {
        if (!this.config) {
            l("error", `IWD config not found. Disable IWD`)
            l("success", `IWD Service disabled`)
            return
        }
        l("info", "Configure iwd");

        if (this.config.enabled) {
            this.enable()
        } else {
            this.disable()
        }

    }
}
