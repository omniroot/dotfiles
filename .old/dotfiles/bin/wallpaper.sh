matugen image $1 --mode $(~/.local/bin/theme.sh --text) --source-color-index 0
cp $1 /usr/share/sddm/themes/japanese/Backgrounds/wallpaper.png
echo $1 > ~/.local/state/wallpaper.txt
