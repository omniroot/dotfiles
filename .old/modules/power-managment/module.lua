return {
  packages = { "ryzen_smu-dkms-git" },
  post_install_hook = "scripts/dkms-install.sh",
  hook_behavior = "once",

}
