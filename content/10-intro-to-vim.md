---
title: Fast track to being productive in Vim
category: blog
date: 2015-05-01T22:59:49-06:00
modified: 2020-05-31T19:07:40-0600
tags: vim
keywords: vim, beginner, tutorial
summary: What I wish I had known when I first started using vim
---

When I first started using vim three months ago, I found it quite challenging to get meaningful work done.
I now realize that there were a list of things I had to grok in order to be productive in vim.
Learning vim can be extremely gratifying, but the core ideas in vim are also probably unlike anything you have seen before.
I thought it would be useful to share some steps one could take to maximize productivity with vim after committing to it.
I haven't been using vim for very long so I'm by no means an expert, and I still learn new things about vim every day.
That said, this is in my experience the best bang for buck in priority order.

1. Spend half an hour (maybe over lunch) using vimtutor[^vimtutor].
    - Type `vimtutor` in a command line window and follow instructions.
1. Learn to stay in normal mode often.
    - If you want to make a change, enter insert mode, edit text and return to normal mode.
1. Force yourself to use learn new ways to navigate text by disabling your previous habits.
    - For example, you can learn to use `hjkl` to navigate by disabling arrow keys.
1. Understand how to use macros:
    1. `q` : Start a macro
    1. `[REG]` : Assign a macro to a register, e.g. `a`. Starts recording a macro
    1. `[keystrokes]` : Perform a set of keystrokes, e.g. `ciwhelloESC`
    1. `q` : End recording a macro
    1. `@[REG]` : Play a macro from cursor current position
    1. `@@` : Play last played macro
1. Learn how to use and navigate buffers (`:ls<CR>`, `:buffer N`, `C-^`), jumplist (`C-O`, `C-I`), and taglist (`C-]`, `C-T`).
1. Learn about the built-in complete sub-mode: Use `C-X` in insert mode to trigger.
1. "Craft your lightsaber" - Make vim your own using .vimrc.
    - Don't be afraid to customize your editor, but also don't add anything in your .vimrc
      that you don't understand.
1. Change CAPSLOCK to ESC.
1. Watch other people use vim on [vimcasts](https://vimcasts.org) and on YouTube.
1. Find plugins to boost your productivity (e.g. NERDTree,), and use a plugin manager.

[^vimtutor]: _aside_: ![vimtutor](videos/vimtutor.webm){ width=100% loop="true" autoplay="true" }
