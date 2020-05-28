---
title: Beginners guide to getting started with Vim
category: blog
date: 2015-05-01T22:59:49-06:00
tags: vim
keywords: vim, beginner, tutorial
---

When I first started using vim, I found it frustrating and difficult to get anything done. I now realize that there were a list of things I had to do to understand how to use vim. Learning vim can be an extremely gratifying experience, but it is probably unlike anything you have seen before. So having a guide to getting started may be useful.

I haven't been using vim for very long, so I'm by no means an expert. But since I'm starting out, I figured it would be useful for beginners if I put down what I think is the order in which you should approach vim.

* Spend half an hour (maybe over lunch) using vimtutor
    - Type `vimtutor` in a command line window and follow instructions
* Stay in normal mode often. If you want to make a change, enter insert mode, edit text and return to normal mode
* Speed up your key repeat
* Force yourself to use `hjkl` to navigate by disabling arrow keys
* Understand how to use macros
    - `q` : Start a macro
    - `[REG]` : Assign a macro to a register, e.g. `a`. Starts recording a macro
    - `[keystrokes]` : Perform a set of keystrokes, e.g. `ciwhelloESC`
    - `q` : End recording a macro
    - `@[REG]` : Play a macro from cursor current position
    - `@@` : Play last played macro
* Craft your lightsaber - Don't be afraid to customize your editor, but also don't add anything in your .vimrc
  that you don't understand.
* Find plugins to boost your productivity (e.g. NERDTree, ).
* Use a plugin manager.
* Watch other people use vim on [vimcasts](https://vimcasts.org)
* Change CAPSLOCK to ESC
