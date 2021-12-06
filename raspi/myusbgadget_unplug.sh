#!/bin/bash

echo "remove usb gadget"

modprobe -r libcomposite

rm -rf /sys/kernel/config/usb_gadget/mygadget

echo "done"
