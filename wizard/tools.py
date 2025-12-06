import subprocess


def clear():
    subprocess.run(["clear"])


def myexit(code=0):
    clear()
    print("You exit from wizard")
    exit(code)


def menu(items, multi=False, hint="Select"):
    clear()
    print(*[f"{item['name']}" for item in items], "q. Exit", "", sep="\n")
    if multi:
        choice = input(hint + " (sep = ,): ")
        choice = choice.split(",")
        if "q" in choice:
            myexit()
        for index in choice:
            print(index)
            items[int(index) - 1]["exec"]()
    else:
        choice = input(hint + ": ")
        if choice == "q":
            myexit()
        items[int(choice) - 1]["exec"]()

    return choice
