-- dcli configuration
-- This is a dynamic Lua configuration that adapts to your system
-- See LUA-HOSTS.md for full documentation

local hostname = dcli.system.hostname()
local is_laptop = dcli.hardware.is_laptop()
local memory_mb = dcli.system.memory_total_mb()

dcli.log.info(string.format("Loading config for %s (%d MB RAM)", hostname, memory_mb))

-- ═══════════════════════════════════════════════════════════════════
-- MODULE SELECTION
-- ═══════════════════════════════════════════════════════════════════

local enabled_modules = {
    "base",
    "desktop-environment",
    "apps",
    "services",
    "power-managment",

    -- Add your modules here
}

local services = {
    enabled = {
        "power-profiles-daemon",
        "ryzen-tune"

    },
    disabled = {},
}


return {
    host = hostname,
    description = "Arch",

    enabled_modules = enabled_modules,

    -- Host-specific packages (in addition to modules)
    packages = {},

    -- Packages to exclude from modules
    exclude = {},

    -- Services configuration
    services = services,

    -- Default applications
    default_apps = {
        browser = "zen",
        terminal = "kitty",
        text_editor = "micro",
        file_manager = "org.gnome.Nautilus.desktop",
    },

    -- Settings
    flatpak_scope = "user",
    auto_prune = false,
    module_processing = "parallel",
    aur_helper = "yay",

    -- Backup settings
    -- config_backups = {
    --     enabled = true,
    --     max_backups = 5,
    -- },

    -- system_backups = {
    --     enabled = true,
    --     backup_on_sync = true,
    --     backup_on_update = true,
    --     tool = "timeshift",
    --     snapper_config = "root",
    -- },
}
