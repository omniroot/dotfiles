
function recache() {
	rehash
	compinit -i
}

alias ls="eza"
alias c="clear"
alias cd="z"
alias gg="z"
alias ff="fastfetch"
alias l="eza"
alias ll="eza -al"
alias llt="eza -l -L 2 --tree"

alias ta="tmux attach -t main"
alias td="tmux detach"
alias n="nvim"
alias upa="yay -Syu"
alias up="yay -S --needed"
alias ups="yay --needed"
alias down="yay -Rn"
alias downa="yay -Rsn"
alias clock="tty-clock -c -S"
alias downun="yay -Qdtq | xargs yay -Rns --noconfirm"

function y() {
	local tmp="$(mktemp -t "yazi-cwd.XXXXXX")" cwd
	yazi "$@" --cwd-file="$tmp"
	if cwd="$(command cat -- "$tmp")" && [ -n "$cwd" ] && [ "$cwd" != "$PWD" ]; then
		builtin cd -- "$cwd"
	fi
	rm -f -- "$tmp"
}
alias yy="yazi"




# downun() {
    # sudo pacman -Rns $(pacman -Qdtq)
# }

alias lofi="mpv --no-video \"https://www.youtube.com/watch?v=jfKfPfyJRdk\""
alias lofi_synthwave="mpv --no-video \"https://www.youtube.com/watch?v=4xDzrJKXOOY\""
