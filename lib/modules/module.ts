export interface ModuleConfig {
    enabled: boolean
}

export class Module {
    // public version = 1


    enable() { }
    disable() { }
    // configure() { }
    apply() { }
}

const module = new Module()