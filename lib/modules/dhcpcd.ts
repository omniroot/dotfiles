import { l } from "../l";
import { corelib } from "../utils";
import type { Module, ModuleConfig } from "./module";

export interface DHCPCDConfig extends ModuleConfig {
}

export class DHCPCDModule implements Module {
    config: DHCPCDConfig | undefined;

    constructor(config: DHCPCDConfig | undefined) {
        this.config = config
    }

    enable() {
        corelib.exec(["systemctl enable --now dhcpcd"])
        l("success", `DHCPCD Service enabled`)
    }

    disable() {
        corelib.exec(["systemctl disable dhcpcd"])
        l("success", `DHCPCD Service disabled`)
    }

    apply() {
        if (!this.config) {
            l("error", `DHCPCD config not found. Disable DHCPCD`)
            l("success", `DHCPCD Service disabled`)
            return
        }
        l("info", "Configure DHCPCD");

        if (this.config.enabled) {
            this.enable()
        } else {
            this.disable()
        }

    }
}
