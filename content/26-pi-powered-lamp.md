---
Title: Raspberry Pi Powered LED Lamp
Category: blog
Date: Sun Mar 27 19:17:58 MDT 2016
keywords: raspberry, pi, led, flask
tags: raspberry-pi, flask, led
summary: Use your Raspberry Pi to control a desk lamp
---

With a Raspberry Pi, you can control a RGB addressable LED strip.
The instructions are very simple^[https://learn.adafruit.com/raspberry-pi-spectrum-analyzer-display-on-rgb-led-strip/led-strip-and-rgb-led-software] and the results are pretty cool.
I decided to make a desk lamp with a web interface.
This post will go through the steps to build your own Pi powered desk lamp.

[![Raspberry Pi Powered LED Desk Lamp](https://giant.gfycat.com/UnfortunatePessimisticFruitfly.gif)](https://gfycat.com/CoolEvergreenArcticseal)

# Requirements

* Raspberry Pi
* Memory card (greater than 4 GB recommended)
* Power Adapter
* LED Strip (LPD8806)
* Wires
* Lamp shade

# Instructions

Any model of the Raspberry Pi should work for this project.
First we need to set up the Raspberry Pi.

## Hardware

To use SPI on the Raspberry Pi, you need to connect 4 pins.
Adafruit has an excellent image in their tutorial that shows how you can do this, which I've also linked below.

![](/images/raspberry_pi_diagram.png)

I've used the same power source to the LED strip to power the Raspberry Pi as well.

I found the lamp shades on [Amazon](http://www.amazon.com/s/field-keywords=puzzle+lamp). 
I purchased them in white, since the LEDs are RGB.

I purchased the LED strip from Adafruit. 

## Software

Download the latest Raspbian from the official source^[https://www.raspberrypi.org/downloads/raspbian/].
I used the image `2016-03-18-raspbian-jessie.img`.
Flash the operating system onto a memory card.

    sudo dd bs=1m if=2016-03-18-raspbian-jessie.img of=/dev/rdisk$DISKNUMBER

Tip - When using `dd` on OSX, I've found that `rdisk` is much faster than `disk`. Both will work fine, but if you are using `disk` be prepared to wait for an hour^[http://serenity.ee/post/82120938429/mac-os-dd-with-devdisk-vs-devrdisk].

**Optional** - Expand the file system to use all the available space on the memory card.

    sudo raspi-config
    -> Expand File System
    -> Save
    -> Reboot

To control this particular LED strip, we are going to use the SPI bus on the Raspberry Pi.
We need to set up the Pi to use SPI.

    sudo raspi-config
    -> Advanced Options
    -> Enable SPI
    -> Enable on Boot
    -> Save
    -> Reboot

Next, we need to install some packages to use the SPI bus.
First, let's update the Raspberry Pi.

    sudo apt-get update
    sudo apt-get upgrade

Then we need to install `python-dev`, `pyspidev`^[https://github.com/doceme/py-spidev] and `BiblioPixel`^[https://github.com/ManiacalLabs/BiblioPixel].
These are all required to control the LED strip.

    sudo apt-get install python-dev
    sudo pip install spidev
    sudo pip install BiblioPixel

Instead of installing spidev and BiblioPixel, you can also clone the repository and add them to your `PYTHONPATH`.
I found that `sudo pip install <package-name>` is easier, however I had to browse through the source code of `BiblioPixel`, and found having a local copy accessible was helpful.

Finally, we need `Flask` to set up a server on the Raspberry Pi.

    sudo pip install Flask

**Note** - I've used `sudo` for all the `pip` installations. It is definitely required for `spidev`, but may not be for the others. You will need to use `sudo` to run the application, since root access is required to control GPIO pins on the Raspberry Pi.

### BiblioPixel

The tutorial on Adafruit's page links to a library for their LED strip, which the author has deprecated in favour of the excellent BiblioPixel.
I recommend using BiblioPixel as well - if you want to use a different LED strip in the future this will make it very easy to use the same code base.

At this point, you should be able to run a few examples, and see animations on your LED strip.

### Flask

I've set up a simple Flask server and am using a Javascript library called colorwheel^[https://jweir.github.io/colorwheel/] to send a user selected color to the Raspberry Pi.
The code for the Flask server is available on GitHub^[https://github.com/kdheepak89/arp] under MIT License.

# References
