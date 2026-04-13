-- Gaming module example
-- Delete or customize this file

local packages = {
    "steam",
    "lutris",
    "gamemode",
    "lib32-gamemode",
    "mangohud",
    "lib32-mangohud",
}

-- Add Wine for non-native games
table.insert(packages, "wine")
table.insert(packages, "wine-mono")
table.insert(packages, "winetricks")

-- Add Discord via Flatpak
table.insert(packages, "flatpak:com.discordapp.Discord")

return {
    description = "Gaming packages",
    packages = packages,
    conflicts = { "minimal" },

    services = {
        enabled = { "gamemode.service" },
    },
}
