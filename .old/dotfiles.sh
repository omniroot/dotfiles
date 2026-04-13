mkdir -p ~/.local/bin
mkdir -p ~/.local/state

for file in dotfiles/bin/*; do
    [ -f "$file" ] && ln -s "$(pwd)/$file" ~/.local/bin/
    chmod +x ~/.local/bin/$(basename "$file")
done

ln -s "$(pwd)/dotfiles/home/.zshrc" ~/
sudo ln -s "$(pwd)/dotfiles/services/ryzen-tune.service" /etc/systemd/system/
systemctl enable --now syncthing --user
