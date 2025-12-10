import os
import tarfile
import datetime
import subprocess

BACKUP_DIR = os.path.expanduser("~/dev/tmp")


def create_backup_dir():
    """Создает директорию для бэкапов, если она не существует."""
    os.makedirs(BACKUP_DIR, exist_ok=True)


def expand_path(path):
    """Расширяет путь, заменяя переменные окружения."""
    return os.path.expandvars(path)


def backup(source_dir):
    """Создает бэкап указанной директории."""
    create_backup_dir()
    source_dir = expand_path(source_dir)
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_file = os.path.join(
        BACKUP_DIR, f"backup_{os.path.basename(source_dir)}_{timestamp}.tar.gz"
    )

    with tarfile.open(backup_file, "w:gz") as tar:
        tar.add(source_dir, arcname=os.path.basename(source_dir))

    print(f"Бэкап завершен: {backup_file}")


def restore_last(source_dir):
    """Восстанавливает последнюю резервную копию указанной директории."""
    source_dir = expand_path(source_dir)
    backups = sorted(
        [
            f
            for f in os.listdir(BACKUP_DIR)
            if f.startswith(f"backup_{os.path.basename(source_dir)}_")
        ],
        reverse=True,
    )

    if backups:
        last_backup = os.path.join(BACKUP_DIR, backups[0])
        with tarfile.open(last_backup, "r:gz") as tar:
            tar.extractall(path=os.path.dirname(source_dir))

        print(f"Восстановление завершено из: {last_backup}")
    else:
        print("Нет доступных архивов для восстановления.")


if __name__ == "__main__":
    # Пример использования
    directories_to_backup = [
        "$HOME/.zen",
        "$HOME/.vscode",
        "$HOME/.config/Code",
    ]

    for directory in directories_to_backup:
        backup(directory)

    # Для восстановления последнего бэкапа
    # restore_last("$HOME/.vscode")
