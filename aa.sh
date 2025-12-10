#!/usr/bin/env bash
set -euo pipefail

# Пакеты для проверки
pkgs=(
"hyprland" "hyprpicker-git" "hyprlock" "hyprshot" "hyprsunset" "waypaper" "sddm" "waybar" "swww"
"pavucontrol" "dunst" "rofi-wayland" "tumbler" "gvfs" "matugen-bin" "qt5ct" "qt6ct" "kvantum"
"nwg-look" "lxappearance" "blueman" "bluez" "kdeconnect" "gnome-disk-utility" "file-roller"
"polkit-gnome" "hyprpolkitagent" "gtk-engine-murrine" "gnome-themes-extra" "sassc"
"auto-cpufreq" "brightnessctl" "python-pywalfox" "numix-circle-icon-theme-git" "bibata-cursor-theme"
)

# требуемое имя зависимости
target="gtk2"

# Проверка наличия необходимых инструментов
for cmd in yay pactree awk jq; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "Требуется установить: $cmd" >&2
    exit 1
  fi
done

tmpdir=$(mktemp -d)
trap 'rm -rf "$tmpdir"' EXIT

# Функция: получить дерево зависимостей для пакета
get_tree() {
  local pkg="$1"
  # если пакет установлен — используем pacman/pactree
  if pacman -Qi "$pkg" &>/dev/null; then
    pactree -u "$pkg" || true
    return
  fi

  # попытка получить информацию из репо/AUR через yay
  # yay -Si даст Depends/MakeDepends для репозитория, AUR => -Si не даст, тогда -Si из AUR через --aur
  yay -Si "$pkg" &>/dev/null && {
    yay -Si "$pkg" | awk '/Depends On/{p=1;next} /^$/{p=0} p{print}' | sed 's/^ *//'
    return
  }

  # Для AUR-пакетов попробуем получить PKGBUILD и распарсить зависимости
  # скачиваем PKGBUILD в tmp и парсим depends/makedepends
  pushd "$tmpdir" >/dev/null
  if yay -G --noconfirm "$pkg" &>/dev/null; then
    dir="$pkg"
    if [ -d "$dir" ]; then
      awk '/^depends=/,/^\)/{print}' "$dir/PKGBUILD" 2>/dev/null || true
      awk '/^makedepends=/,/^\)/{print}' "$dir/PKGBUILD" 2>/dev/null || true
      rm -rf "$dir"
    fi
  fi
  popd >/dev/null
}

# Основная проверка: ищем target в дереве зависимостей (рекурсивно через pactree, иначе простой grep)
echo "Проверка пакетов на зависимость от '$target'..."
printf "%-30s %s\n" "PACKAGE" "REQUIRES_$target"
for pkg in "${pkgs[@]}"; do
  found="no"

  # если установлен — используем pactree и проверяем наличие target
  if pacman -Qi "$pkg" &>/dev/null; then
    if pactree -u "$pkg" 2>/dev/null | awk '{print $1}' | grep -xq "$target"; then
      found="yes (installed -> pactree)"
    fi
  else
    # попробуем установить временно информацию через yay --devel? лучше: используем yay -Si и рекурсивно проверяем Depends
    # Получаем список прямых Depends и делаем BFS по ним с помощью pacman/pactree если доступно
    deps=$(yay -Si "$pkg" 2>/dev/null | awk -F: '/Depends On/ {getline; while($0!=""){print; getline}}' | sed 's/^ *//;s/,//g' | tr ' ' '\n' | sed '/^$/d' | awk -F'=' '{print $1}' | sort -u 2>/dev/null || true)
    # если нет deps (AUR) — попытаемся скачать PKGBUILD и распарсить
    if [ -z "$deps" ]; then
      pushd "$tmpdir" >/dev/null
      if yay -G --noconfirm "$pkg" &>/dev/null; then
        dir="$pkg"
        if [ -f "$dir/PKGBUILD" ]; then
          deps=$(awk -F'=' '/^depends=/,/\)/{gsub(/["'\''(),]/,""); if($0 ~ /depends=/){sub(/.*=/,"");} print}' "$dir/PKGBUILD" | tr -s ' ' '\n' | sed '/^$/d' | awk -F'=' '{print $1}' | sort -u)
        fi
        rm -rf "$dir"
      fi
      popd >/dev/null
    fi

    # BFS: проверяем каждый зависимый пакет на наличие target через pactree (если доступно) или прямым сравнением
    queue=$(printf "%s\n" $deps)
    visited=""
    while IFS= read -r d; do
      [ -z "$d" ] && continue
      # нормализация: убрать версия/операторы
      depname=$(echo "$d" | sed 's/[<>=].*//')
      # уже проверяли?
      if echo "$visited" | grep -qx "$depname"; then continue; fi
      visited="$visited $depname"
      if [ "$depname" = "$target" ]; then
        found="yes (direct)"
        break
      fi
      # если dep установлен — проверим через pactree
      if pacman -Qi "$depname" &>/dev/null; then
        if pactree -u "$depname" 2>/dev/null | awk '{print $1}' | grep -xq "$target"; then
          found="yes (via $depname -> pactree)"
          break
        fi
      else
        # попробуем получить its Depends via yay -Si and add to queue
        subdeps=$(yay -Si "$depname" 2>/dev/null | awk -F: '/Depends On/ {getline; while($0!=""){print; getline}}' | sed 's/^ *//;s/,//g' | tr ' ' '\n' | sed '/^$/d' | awk -F'=' '{print $1}' | sort -u 2>/dev/null || true)
        if [ -n "$subdeps" ]; then
          queue="$queue
$subdeps"
        fi
      fi
    done <<<"$queue"
  fi

  printf "%-30s %s\n" "$pkg" "$found"
done
