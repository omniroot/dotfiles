import os
import subprocess

REPOS = ["diogen", "kaizen", "oku", "oku_old"]
BASE_DIR = os.path.expanduser("~/personal/github/")


def clone_repo(repo_name):
    subprocess.run(
        ["gh", "repo", "clone", repo_name, os.path.join(BASE_DIR, repo_name)]
    )


def main():
    for repo in REPOS:
        repo_path = os.path.join(BASE_DIR, repo)
        if not os.path.exists(repo_path):
            print(f"Клонирование репозитория: {repo}")
            clone_repo(repo)
        else:
            print(f"Репозиторий {repo} уже существует.")
