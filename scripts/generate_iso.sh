#!/bin/bash
set -e

# Variables
ISO_NAME="custom_project.iso"
SOURCE_DIR="iso_source"
OUTPUT_DIR="dist"

# Prepare directory structure
mkdir -p $SOURCE_DIR/boot
mkdir -p $OUTPUT_DIR

# Copy files to ISO source directory
cp -r custom_files/* $SOURCE_DIR/

# (Optional) Configure bootloader
# Example for GRUB:
grub-mkrescue -o $SOURCE_DIR/boot/grub/iso9660/boot.img $SOURCE_DIR

# Generate ISO
genisoimage -o $OUTPUT_DIR/$ISO_NAME -J -R -V "CUSTOM_PROJECT" $SOURCE_DIR

echo "ISO generated at $OUTPUT_DIR/$ISO_NAME"
