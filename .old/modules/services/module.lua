return {
  dotfiles_sync = true,
  post_install_hook = "scripts/start-services.sh",
  hook_behavior = "once",
}
