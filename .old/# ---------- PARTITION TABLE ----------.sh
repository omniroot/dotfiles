# ---------- PARTITION TABLE ----------
parted /dev/sda --script mklabel msdos
parted /dev/sda --script mkpart primary ext4 1MiB 513MiB
parted /dev/sda --script mkpart primary btrfs 513MiB 100%

# если хочешь отдельно /home – делай третий раздел

# ---------- FORMAT ----------
mkfs.ext4 /dev/sda1
mkfs.btrfs -f /dev/sda2

# ---------- SUBVOLUMES ----------
mount /dev/sda2 /mnt
btrfs subvolume create /mnt/@
btrfs subvolume create /mnt/@var
btrfs subvolume create /mnt/@log
umount /mnt

# ---------- MOUNT ----------
mount -o subvol=@,compress=zstd,noatime /dev/sda2 /mnt
mkdir -p /mnt/{boot,var,var/log}

mount -o subvol=@var,compress=zstd,noatime /dev/sda2 /mnt/var
mount -o subvol=@log,compress=zstd,noatime /dev/sda2 /mnt/var/log

mount /dev/sda1 /mnt/boot

# ---------- BASE INSTALL ----------
pacstrap /mnt base linux linux-firmware btrfs-progs grub sudo

genfstab -U /mnt >> /mnt/etc/fstab

arch-chroot /mnt bash << 'EOF'

echo "pc" > /etc/hostname
echo "en_US.UTF-8 UTF-8" >> /etc/locale.gen
locale-gen
echo LANG=en_US.UTF-8 > /etc/locale.conf

ln -sf /usr/share/zoneinfo/Europe/Moscow /etc/localtime
hwclock --systohc

echo root:123 | chpasswd

# ---------- GRUB BIOS ----------
grub-install /dev/sda
grub-mkconfig -o /boot/grub/grub.cfg

EOF

umount -R /mnt
reboot
