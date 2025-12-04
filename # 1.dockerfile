# 1. Форматируем диски
mkfs.fat -F32 /dev/sda1
mkfs.btrfs -f /dev/sda2
mkfs.btrfs -f /dev/sda3

# 2. Монтируем root с subvolumes
mount -o compress=zstd,subvol=@ /dev/sda2 /mnt
mkdir -p /mnt/{boot,home,var,var/log}
mount -o compress=zstd,subvol=@var /dev/sda2 /mnt/var
mount -o compress=zstd,subvol=@log /dev/sda2 /mnt/var/log
mount -o compress=zstd,subvol=@home /dev/sda3 /mnt/home

# 3. Монтируем EFI
mkdir -p /mnt/boot
mount /dev/sda1 /mnt/boot

# 4. Устанавливаем базовую систему
pacstrap /mnt base base-devel linux linux-firmware amd-ucode btrfs-progs grub grub-btrfs efibootmgr os-prober sudo git micro fastfetch

# 5. Генерируем fstab
genfstab -U /mnt >> /mnt/etc/fstab

# 6. chroot
arch-chroot /mnt /bin/bash

# Внутри chroot:

# 7. Настраиваем hostname и локали
echo "omniinstallpc" > /etc/hostname
echo "en_US.UTF-8 UTF-8" > /etc/locale.gen
locale-gen
echo 'LANG="en_US.UTF-8"' > /etc/locale.conf
ln -sf /usr/share/zoneinfo/Europe/Moscow /etc/localtime
hwclock --systohc

# 8. Создаём пользователей
echo root:sd | chpasswd
useradd -m -G wheel omniroot
echo omniroot:sd | chpasswd
echo '%wheel ALL=(ALL) ALL' > /etc/sudoers.d/wheel

# 9. Устанавливаем GRUB для UEFI
grub-install --target=x86_64-efi --efi-directory=/boot --bootloader-id=GRUB --removable
grub-mkconfig -o /boot/grub/grub.cfg

# 10. Выйти из chroot
exit

# 11. Отмонтировать все
umount -R /mnt

# 12. Перезагрузка
reboot
