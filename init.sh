

git config --global user.name "omniroot"
git config --global user.email "omnirootofc@gmail.com"
echo "Before execute this script, you need authorizate with gh auth login"
gh auth setup-git

read -p "Хотите ли создать папку github? (y/n): " answer
if [ "$answer" = "y" ] || [ "$answer" = "Y" ]; then
  if [ ! -d "github" ]; then
	mkdir github
    echo "Папка github успешно создана"
  else
    echo "Папка github уже существует"
  fi
else
  echo "Создание папки github пропущено"
fi

read -p "Хотите клонировать репозиторий obsidian-dev? (y/n): " answer
if [ "$answer" = "y" ] || [ "$answer" = "Y" ]; then
  if [ ! -d "obsidian-dev" ]; then
    git clone https://github.com/omniroot/obsidian-dev obsidian-dev
    echo "Репозиторий obsidian-dev успешно клонирован"
  else
    echo "Папка obsidian-dev уже существует, пропускаем клонирование"
  fi
else
  echo "Клонирование omniroot-dev пропущено."
fi


read -p "Хотите клонировать репозиторий dots? (y/n): " answer
if [ "$answer" = "y" ] || [ "$answer" = "Y" ]; then
  if [ ! -d "dots" ]; then
    git clone https://github.com/omniroot/dots dots
    echo "Репозиторий dots успешно клонирован"
  else
    echo "Папка dots уже существует, пропускаем клонирование"
  fi
else
  echo "Клонирование dots пропущено."
fi
