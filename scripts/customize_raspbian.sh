#!/bin/bash
set -e

KIVY_BINARY=$1
SVELTEKIT_BUILD_DIR=$2

# Variables
BASE_IMAGE="raspbian-lite.img"
CUSTOM_IMAGE="custom-raspbian-lite.img"
MOUNT_DIR="./mnt"

# Create a working copy of the base image
cp $BASE_IMAGE $CUSTOM_IMAGE

# Mount the image
LOOP_DEVICE=$(losetup -fP --show $CUSTOM_IMAGE)
PARTITION="${LOOP_DEVICE}p2" # Assuming root partition is second
mkdir -p $MOUNT_DIR
sudo mount $PARTITION $MOUNT_DIR

# Add Kivy Binary
sudo mkdir -p $MOUNT_DIR/home/pi/kivy-app
sudo cp $KIVY_BINARY $MOUNT_DIR/home/pi/kivy-app/
sudo chmod +x $MOUNT_DIR/home/pi/kivy-app/main

# Add SvelteKit Build
sudo mkdir -p $MOUNT_DIR/var/www/sveltekit
sudo cp -r $SVELTEKIT_BUILD_DIR/* $MOUNT_DIR/var/www/sveltekit/

# Configure Kivy app to run on boot
sudo tee $MOUNT_DIR/etc/systemd/system/kivy-app.service > /dev/null <<EOL
[Unit]
Description=Kivy App
After=multi-user.target

[Service]
Type=simple
ExecStart=/usr/bin/python3 /home/pi/kivy-app/main
Restart=always
User=pi
WorkingDirectory=/home/pi/kivy-app

[Install]
WantedBy=multi-user.target
EOL

sudo chroot $MOUNT_DIR systemctl enable kivy-app.service

# Unmount and cleanup
sudo umount $MOUNT_DIR
losetup -d $LOOP_DEVICE
rm -rf $MOUNT_DIR