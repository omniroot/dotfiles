from wizard.tools import menu, clear
from wizard.install_packages import main as install_packages
from wizard.clone_github_repos import main as clone_github_repos


def setup_linux_dots():
    print("setup linux dots")


def main():
    clear()
    menu(
        [
            {"name": "1. Setup linux packages", "exec": install_packages},
            {"name": "2. Setup dots", "exec": setup_linux_dots},
            {"name": "3. Clone github repos", "exec": clone_github_repos},
        ],
        hint="Select functions",
        multi=True,
    )


if __name__ == "__main__":
    main()
