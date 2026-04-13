#!/bin/bash

STATE_FILE="$HOME/.local/state/theme_state.txt"

# Функция, чтобы получить текущую тему
get_theme() {
    if [ -f "$STATE_FILE" ]; then
        cat "$STATE_FILE"
    else
        echo "light"  # Если файл не существует, устанавливаем светлую тему по умолчанию
    fi
}

# Функция, чтобы установить тему
set_theme() {
    echo "$1" > "$STATE_FILE"
    gsettings set org.gnome.desktop.interface color-scheme prefer-$1
    matugen image $(cat ~/.local/state/wallpaper.txt) --mode $1 --source-color-index 0
    
}

# Функция для возврата состояния в формате JSON
output_json() {
    local current_theme
    current_theme=$(get_theme)

    if [[ "$current_theme" == "light" ]]; then
        echo '{"text": " ", "alt": "Светлая тема", "tooltip": "Светлая тема активна", "class": "light", "percentage": 100}'
    else
        echo '{"text": "", "alt": "Темная тема", "tooltip": "Темная тема активна", "class": "dark", "percentage": 100}'
    fi
}

# Проверяем аргументы
case "$1" in
    "--text")
        get_theme
        ;;
    "--waybar")
        output_json
        ;;
    "--toggle")
        current_theme=$(get_theme)
        if [[ "$current_theme" == "light" ]]; then
            set_theme "dark"
        else
            set_theme "light"
        fi
        output_json
        ;;
    "light")
        set_theme "light"
        ;;
    "dark")
        set_theme "dark"
        ;;
    *)
        echo "Usage: $0 --text   # для получения текущей темы"
        echo "       $0 --waybar  # для получения JSON для Waybar"
        echo "       $0 --toggle   # для переключения темы"
        echo "       $0 light    # чтобы установить светлую тему"
        echo "       $0 dark     # чтобы установить темную тему"
        ;;
esac
