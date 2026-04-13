#!/bin/bash

source ~/.config/zsh/zinit.sh



# zmodload zsh/zprof

# Import plugins
for plugin in ~/.config/zsh/plugins/*.sh; do
    [ -r "$plugin" ] && source "$plugin"
done

# Import configs
source ~/.config/zsh/config.sh
source ~/.config/zsh/alias.sh
source ~/.config/zsh/plugins.sh


zinit cdreplay -q

# Integrations
eval "$(zoxide init zsh)"
eval "$(fzf --zsh)"


# Exports
export PATH="$HOME/.local/bin:$PATH"
# export PATH=$PATH:/home/omniroot/.spicetify

# zprof
