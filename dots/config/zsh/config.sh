PACMAN_LOG="/var/log/pacman.log"
LAST_INSTALL_FILE="$HOME/.last_pacman_install"

# General
DISABLE_AUTO_UPDATE="true"
DISABLE_MAGIC_FUNCTIONS="true"
DISABLE_COMPFIX="true"
ZSH_AUTOSUGGEST_BUFFER_MAX_SIZE="20"
ZSH_AUTOSUGGEST_USE_ASYNC=1

bindkey -e

export TERM=kitty

# XDG
export XDG_CONFIG_HOME="$HOME/.config" 
export XDG_DATA_HOME="$HOME/.local/share"
export XDG_CACHE_HOME="$HOME/.cache"


export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools


# Path for programs
#alias yarn='yarn --use-yarnrc "$XDG_CONFIG_HOME/yarn/config"'

# check_new_package() {
#     # Get the last installed package from the pacman log
#     last_installed=$(grep "installed" "$PACMAN_LOG" | tail -n 1)

#     # Check if the last installed package is different from the stored value
#     if [[ "$last_installed" != "$(cat $LAST_INSTALL_FILE 2>/dev/null)" ]]; then
#         # Update the stored value
#         echo "$last_installed" > "$LAST_INSTALL_FILE"
        
#         # Rehash and reinitialize completions
#         rehash
#         compinit -i
#     fi
# }

# Hook to run the check before each command
preexec() {
    # check_new_package
}



# History
HISTSIZE=5000
HISTFILE=~/.zsh_history
SAVEHIST=$HISTSIZE
HISTDUP=erase
setopt appendhistory
setopt sharehistory
setopt hist_ignore_space
setopt hist_ignore_all_dups
setopt hist_save_no_dups
setopt hist_ignore_dups
setopt hist_find_no_dups
