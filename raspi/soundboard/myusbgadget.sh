#!/bin/bash

# references
#  - https://irq5.io/2016/12/22/raspberry-pi-zero-as-multiple-usb-gadgets/

echo "insert usb gadget"

modprobe libcomposite

mkdir -p /sys/kernel/config/usb_gadget/mygadget
cd /sys/kernel/config/usb_gadget/mygadget

echo 0x1d6b > idVendor  # Linux Foundation
echo 0x0104 > idProduct # Multifunction Composite Gadget
echo 0x0100 > bcdDevice # v1.0.0
echo 0x0200 > bcdUSB    # USB 2.0

# for windows
echo 0xEF > bDeviceClass
echo 0x02 > bDeviceSubClass
echo 0x01 > bDeviceProtocol
echo 0x08 > bMaxPacketSize

mkdir -p strings/0x409
echo "deadbeef00115599" > strings/0x409/serialnumber
echo "irq5 labs"        > strings/0x409/manufacturer
echo "Pi Zero Gadget"   > strings/0x409/product
echo "MDB Config1"      > strings/0x409/configuration

mkdir -p strings/0x407
echo "deadbeef00115599" > strings/0x407/serialnumber
echo "irq5 labs"        > strings/0x407/manufacturer
echo "Pi Zero Gadget"   > strings/0x407/product
echo "MDB Config1"      > strings/0x407/configuration

echo 1 > os_desc/use
echo 0xcd > os_desc/b_vendor_code
echo MSFT100 > os_desc/qw_sign

mkdir -p configs/c.1
echo 0x80 > configs/c.1/bmAttributes
echo 250 > configs/c.1/MaxPower

# mass storage
mkdir -p functions/mass_storage.usb0
echo 0 > functions/mass_storage.usb0/stall
echo 1 > functions/mass_storage.usb0/lun.0/removable
echo 0 > functions/mass_storage.usb0/lun.0/ro
echo /dev/mmcblk0p3 > functions/mass_storage.usb0/lun.0/file
ln -s functions/mass_storage.usb0 configs/c.1

# audio
mkdir -p functions/uac2.usb0
ln -s functions/uac2.usb0 configs/c.1

# network
mkdir -p functions/rndis.usb0
ln -s functions/rndis.usb0 configs/c.1/
ln -s configs/c.1 os_desc

udevadm settle -t 5 || :
ls /sys/class/udc > UDC

echo "done"

