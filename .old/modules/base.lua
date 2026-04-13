-- Base system packages
-- These packages are included regardless of host or modules
-- Uses Lua for conditional package selection based on hardware

local packages = {
    -- Essential base system
    "base",
    "base-devel",
    "amd-ucode",
    -- "as",
    "linux", -- Standard kernel
    "linux-firmware",

    "git",
    "nano",
    "micro",
    "htop",
    "blueman",
    "bluez",
    "brightnessctl",
    "yay-bin", -- AUR helper
    "reflector",
    "mesa",
    "vulkan-radeon",
    "xf86-video-amdgpu",
    "xf86-video-ati",
    -- "timeshift",               -- System backup tool
}


return {
    description = "Base system packages",
    packages = packages,
}
