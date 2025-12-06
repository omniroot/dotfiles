import subprocess
import sys
import os
from wizard.tools import menu, clear

from wizard.install_auto_cpufreq import main as install_auto_cpufreq


initial_packages = ["micro", "git", "github-cli", "stow", "zsh", "reflector"]

hyprland_packages = [
    "hyprland",
    "hyprpicker-git",
    "hyprlock",
    "hyprshot",
    "hyprsunset",
    "waypaper",
    "sddm",
    "waybar",
    "swww",
    "pavucontrol",
    "dunst",
    "rofi-wayland",
    "thunar",
    "thunar-volman",
    "thunar-archive-plugin",
    "tumbler",
    "gvfs",
    "matugen-bin",
    "qt5ct",
    "qt6ct",
    "kvantum",
    "nwg-look",
    "lxappearance",
    "wlogout-git",
    "blueman",
    "bluez",
    "kdeconnect",
    "gnome-disk-utility",
    "file-roller",
    "polkit-gnome",
    "hyprpolkitagent",
    "gtk-engine-murrine",
    "gnome-themes-extra",
    "sassc",
    "auto-cpufreq",
    "brightnessctl",
    "hyprwayland-scanner-git",
    "python-pywalfox",
    "numix-circle-icon-theme-git",
    "bibata-cursor-theme",
]

user_packages = [
    "visual-studio-code-bin",
    "zen-browser-bin",
    "qbittorrent",
    "timeshift",
    "obsidian",
    "mpv",
    "vlc",
    "figma-linux-bin",
    "telegram-desktop",
    "throne-bin",
    "github-desktop-bin",
]

terminal_packages = [
    "opendoas",
    "zsh",
    "eza",
    "zoxide",
    "fzf",
    "7zip",
    "btop",
    "jq",
    "downgrade",
    "android-tools",
    "ncdu",
    "oh-my-posh-bin",
]

development_packages = ["bun-bin", "npm", "python-pipenv"]

font_packages = [
    "ttf-firacode-nerd",
    "ttf-ibmplex-mono-nerd",
    "ttf-jetbrains-mono-nerd",
    "otf-font-awesome",
    "otf-monaspace-nerd",
    "nerd-fonts-sf-mono",
]

drivers_packages = [
    "libva-mesa-driver",
    "mesa",
    "vulkan-radeon",
    "xf86-video-amdgpu",
    "xf86-video-ati",
]

global_packages = (
    hyprland_packages
    + user_packages
    + terminal_packages
    + development_packages
    + font_packages
    + drivers_packages
)


def install_packages(packages):
    print(f"Установка пакетов: {', '.join(packages)}")
    try:
        result = subprocess.run(
            [
                "yay",
                "-S",
                "--noconfirm",
                "--needed",
                *packages,
            ],
            check=True,
        )
        print(result)
    except subprocess.CalledProcessError as e:
        print(f"Ошибка при установке пакетов: {e}", file=sys.stderr)


def is_yay_installed():
    try:
        result = subprocess.run(["pacman", "-Qq"], stdout=subprocess.PIPE, text=True)
        if "yay-bin" in result.stdout.splitlines():
            print("Yay is already installed!")
            return True
        else:
            print("Installing yay...")
            return False
    except Exception as e:
        print(f"Error checking yay installation: {e}")
        return False


def install_yay():
    if not is_yay_installed():
        try:
            os.chdir("/tmp")
            subprocess.run(
                ["git", "clone", "https://aur.archlinux.org/yay-bin"], check=True
            )
            os.chdir("yay-bin")
            subprocess.run(["makepkg", "-sric", "--noconfirm", "--needed"], check=True)
            print("Yay has been installed successfully!")
        except Exception as e:
            print(f"Error during installation: {e}")


def install_font_packages():
    install_packages(font_packages)
    subprocess.run(["fc-cache", "-fv"])


def update_mirrorlist():
    subprocess.run(
        [
            "sudo",
            "reflector",
            "--sort",
            "rate",
            "--save",
            "/etc/pacman.d/mirrorlist",
            "-c",
            "Russia",
            "-p",
            "https",
            "-l",
            "5",
            "--verbose",
        ]
    )


def print_all_packages():
    print("Packages: ", *global_packages)


def main():
    subprocess.run(
        [
            "sudo",
            "pacman",
            "-S",
            "--needed",
            "--noconfirm",
            "--overwrite *",
            *initial_packages,
        ]
    )
    install_yay()
    install_auto_cpufreq()
    menu(
        [
            {
                "name": "1. Install all packages",
                "exec": lambda: install_packages(global_packages),
            },
            {
                "name": "2. Install hyprland packages",
                "exec": lambda: install_packages(hyprland_packages),
            },
            {
                "name": "3. Install user packages",
                "exec": lambda: install_packages(user_packages),
            },
            {
                "name": "4. Install terminal packages",
                "exec": lambda: install_packages(terminal_packages),
            },
            {
                "name": "5. Install development packages",
                "exec": lambda: install_packages(development_packages),
            },
            {
                "name": "6. Install font packages",
                "exec": install_font_packages,
            },
            {
                "name": "7. Install drivers packages",
                "exec": lambda: install_packages(drivers_packages),
            },
            {"name": "8. Update mirrorlist", "exec": update_mirrorlist},
            {"name": "9. Print all packages", "exec": print_all_packages},
        ],
        hint="Select functions",
        multi=True,
    )


# if __name__ == "__main__":
#     main()
