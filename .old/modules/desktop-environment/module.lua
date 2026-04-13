local packages = {
    "hyprland",
    "noctalia-shell",
    "gvfs",
    "gvfs-mtp",
    "polkit-gnome",
    "file-roller",
    "tumbler",
    "kdeconnect",
    "bibata-cursor-theme-bin",
    "dunst",
    "rofi"
}

return {
    description = "Desktop Environment: Hyprland with Noctalia Shell",
    conflicts = {},
    -- post_install_hook = "scripts/install-hyprland-dotfiles.sh",
    -- hook_behavior = "once",
    dotfiles_sync = true,
    packages = packages,
}
