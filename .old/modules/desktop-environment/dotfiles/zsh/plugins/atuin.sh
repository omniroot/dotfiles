if [ ! -x "$HOME/.atuin/bin/atuin" ]; then
  echo "atuin не установлен. Установка..."
  curl --proto '=https' --tlsv1.2 -LsSf https://setup.atuin.sh | sh
  atuin login
  atuin import auto
  atuin sync
fi
