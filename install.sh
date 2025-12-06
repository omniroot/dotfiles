
install_packages() {
    echo "Установка пакетов: $*"
    yay -S --noconfirm --needed "$@"
}

initial_packages=(
	micro
	git
	github-cli
	stow
	zsh
)

hyprland_packages=(
	hyprland
	hyprpicker
	hyprlock
	hyprshot
	waypaper
	sddm
	waybar
	swww
	pavucontrol
	dunst
	rofi-wayland
	thunar
	thunar-volman
	thunar-archive-plugin
	tumbler
	gvfs
	matugen-bin
	qt5ct
	qt6ct
	kvantum
	nwg-look
	lxappearance
	wlogout-git
	blueman
	bluez
	kdeconnect
	gnome-disk-utility
	file-roller
)

user_packages=(
	visual-studio-code-bin
	zen-browser-bin
	qbittorrent
	timeshift
	obsidian
	mpv
	vlc
	figma-linux-bin
	telegram-desktop
	throne-bin
	github-desktop-bin
	
)

terminal_packages=(
	opendoas
	zsh
	eza
	zoxide
	fzf
	7zip
	btop
	jq
	downgrade
	android-tools
)

development_packages=(
	bun-bin
	npm
)

font_packages=(
	ttf-firacode-nerd
	ttf-ibmplex-mono-nerd
	ttf-jetbrains-mono-nerd
	otf-font-awesome
)

global_packages=(
    "${hyprland_packages[@]}"
    "${user_packages[@]}"
    "${terminal_packages[@]}"
    "${development_packages[@]}"
    "${font_packages[@]}"
)

## Initial packages
sudo pacman -S --noconfirm --needed "${initial_packages[@]}"

if [[ "$SHELL" == *"/bash" ]]; then
	clear
	echo "Смена шелла на zsh..."
    chsh -s "$(which zsh)"
    echo "Шелл успешно изменен на zsh. Пожалуйста, перелогинься"
else
   	echo "zsh уже установлен и текущий шелл: $SHELL"
fi

## Install yay
if pacman -Qq | grep -qw yay-bin > /dev/null; then
	echo "Yay is already installed!"
else
	cd /tmp
	git clone https://aur.archlinux.org/yay-bin
	cd yay-bin
	makepkg -sric --noconfirm --needed

	cd ~/dev/
fi

install_packages "${global_packages[@]}"


