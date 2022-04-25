---
title: Neovim and Tmux
date: 2016-02-06T00:54:00-06:00
keywords: neovim, tmux, vim, writing
tags: vim
summary: Set up neovim and tmux to work with osx.
---

These instructions are OSX specific. On Windows machines, I tend to use Sublime Text or Atom. On Linux machines, I use Vim when my local machine is OSX running tmux.

I've found that with Neovim and tmux, I rarely have to leave the terminal to get something done.
I wanted to save here some of the commands required to set up Neovim and tmux.

First update brew.
If you don't have brew, you can install it from [here](https://brew.sh/).

```bash
brew update
```

After updating brew, you can install Neovim from HEAD using the following.

```bash
# https://github.com/neovim/homebrew-neovim/blob/master/README.md
brew install --HEAD neovim
brew reinstall --HEAD neovim
```

Install tmux using the following

```bash
brew install tmux
```

The following allows you to use copy paste instead tmux on OSX.

```bash
brew install reattach-to-user-namespace
```

This changes the cursor inside vim in the terminal when you change from NORMAL to INSERT and back.

```bash
infocmp $TERM | sed 's/kbs=^[hH]/kbs=\\177/' > $TERM.ti
tic $TERM.ti
```
