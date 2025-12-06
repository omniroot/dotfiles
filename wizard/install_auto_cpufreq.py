import subprocess


def main():
    subprocess.run(["sudo", "systemctl", "enable", "--now", "auto-cpufreq"])
    subprocess.run(["sudo", "auto-cpufreq", "--install"])
