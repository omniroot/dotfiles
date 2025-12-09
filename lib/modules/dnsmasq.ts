import { l } from "../l";
import { corelib } from "../utils";
import type { Module, ModuleConfig } from "./module";

export interface DNSMASQConfig extends ModuleConfig {
}

export class DNSMASQModule implements Module {
    config: DNSMASQConfig | undefined;

    constructor(config: DNSMASQConfig | undefined) {
        this.config = config
    }

    enable() {
        corelib.exec(["systemctl enable --now dnsmasq"])
        l("success", `DNSMASQ Service enabled`)
    }

    disable() {
        corelib.exec(["systemctl disable dnsmasq"])
        l("success", `DNSMASQ Service disabled`)
    }

    apply() {
        if (!this.config) {
            l("error", `DNSMASQ config not found. Disable DNSMASQ`)
            this.disable()
            l("success", `DNSMASQ Service disabled`)
            return
        }
        l("info", "Configure DNSMASQ");

        if (this.config.enabled) {
            this.enable()
        } else {
            this.disable()
        }

    }
}
