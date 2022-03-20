---
title: How to Compile the Moonlander Keyboard with QMK
date: 2022-02-18T22:03:31-06:00
tags: keyboards
keywords: moonlander, qmk, keyboard, compile, firmware
summary: Summary of steps to compile firmware for moonlander keyboard using QMK
---

First, clone the qmk_firmware github repo, and make a fork to maintain your custom keyboard firmware.
This is what my remotes look like:

```bash
$ cd qmk_firmware
$ git remote -v
origin	git@github.com:kdheepak/qmk_firmware.git (fetch)
origin	git@github.com:kdheepak/qmk_firmware.git (push)
qmk	git@github.com:qmk/qmk_firmware.git (fetch)
qmk	git@github.com:qmk/qmk_firmware.git (push)
```

Then, compile the firmware using the following from the root of the repository:

```bash
$ make moonlander:kdheepak:flash
```

The keymaps are located here:

```bash
$ ls keyboards/moonlander/keymaps/kdheepak
Permissions Size Date Modified Git Name
.rw-r--r--   250 19 Mar 20:24   -- config.h
.rw-r--r--  5.7k 19 Mar 20:24   -- keymap.c
.rw-r--r--   292 19 Mar 20:24   -- rules.mk
```

Modify `keymap.c` based on your preferences.
