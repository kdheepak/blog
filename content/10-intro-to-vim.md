---
title: Beginners guide to getting started with Vim
category: blog
date: 2015-05-01T22:59:49-06:00
tags: vim
keywords: vim, beginner, tutorial
summary: What I had wished I had known when I first started using vim
---

When I first started using vim, I found it frustrating and difficult to get anything done. I now realize that there were a list of things I had to do to understand how to use vim. Learning vim can be an extremely gratifying experience, but it is probably unlike anything you have seen before. So having a guide to getting started may be useful.

I haven't been using vim for very long, so I'm by no means an expert. But since I'm starting out, I figured it would be useful for beginners if I put down what I think is the order in which you should approach vim as a tutorial.

1. Spend half an hour (maybe over lunch) using vimtutor[^vimtutor].
    - Type `vimtutor` in a command line window and follow instructions.
1. Learn to stay in normal mode often. If you want to make a change, enter insert mode, edit text and return to normal mode.
1. Speed up your key repeat.
1. Force yourself to use `hjkl` to navigate by disabling arrow keys.
1. Understand how to use macros:
    1. `q` : Start a macro
    1. `[REG]` : Assign a macro to a register, e.g. `a`. Starts recording a macro
    1. `[keystrokes]` : Perform a set of keystrokes, e.g. `ciwhelloESC`
    1. `q` : End recording a macro
    1. `@[REG]` : Play a macro from cursor current position
    1. `@@` : Play last played macro
1. Learn how to use buffers, jumplist, taglist etc.
1. Change CAPSLOCK to ESC.
1. Watch other people use vim on [vimcasts](https://vimcasts.org).
1. "Craft your lightsaber" - Make vim your own using .vimrc.
    - Don't be afraid to customize your editor, but also don't add anything in your .vimrc
      that you don't understand.
1. Find plugins to boost your productivity (e.g. NERDTree, ), and use a plugin manager.

[^vimtutor]: _aside_: ![vimtutor](videos/vimtutor.webm){ width=125% loop="true" autoplay="true" }
