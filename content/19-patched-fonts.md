---
title: Patched fonts madness
category: blog
date: Sat Sep 12 19:59:22 MDT 2015
tags: vim, tmux
keywords: vim, tmux
---

Getting patched fonts for a powerline in the terminal can be quite an adventure. I almost gave up on it, but now that I've figured it out it seems extremely obvious.

    # pip install --user powerline-status
    # brew install fontforge --with-python
    git clone https://github.com/powerline/fonts.git
    cd fonts
    ./install.sh

Most importantly, select the font with the word `powerline` in the name in the preferences option of your terminal.
