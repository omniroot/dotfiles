#!/bin/bash

link="https://api.open-meteo.com/v1/forecast?latitude=54.9766&longitude=39.0444&current=temperature_2m,weather_code&forecast_days=1"

# Функция для проверки подключения к интернету
check_internet() {
    # Отправляем запрос и проверяем код состояния
    response=$(curl -s -o /dev/null -w "%{http_code}" https://www.google.com)
    if [ "$response" -eq 200 ]; then
        return 0  # Успешное подключение
    else
        return 1  # Ошибка подключения
    fi
}

# Проверка подключения к интернету
while ! check_internet; do
    sleep 2
done

# Получение данных
data=$(curl -s $link)
weather_code=$(echo "$data" | jq '.current.weather_code')
weather_temperature=$(echo "$data" | jq ".current.temperature_2m")
output="${weather_temperature}°C"


# echo "$data"

case $weather_code in
    0)
        output="${output}  "
        ;;
    1|2|3)
        output="${output}  "
        ;;
    45|48)
       output="${output} 󰖑 "
        ;;
    51|53|55)
       output="${output}  "
        ;;
    56|57)
       output="${output}  "
        ;;
    61|63|65)
        output="${output}  "
        ;;
    66|67)
       output="${output}  "
        ;;
    71|73|75)
       output="${output}  "
        ;;
    77)
       output="${output}  "
        ;;
    80|81|82)
       output="${output}  "
        ;;
    85|86)
        echo "Погода: Снежные дожди: легкие и сильные"
        ;;
    95)
        output="${output}  "
        ;;
    96|99)
        output="${output}  "
        ;;
    *)
        output="${output}  "
        ;;
esac

echo "$output"