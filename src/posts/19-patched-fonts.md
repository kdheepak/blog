---
title: Patched fonts madness
date: 2015-07-12T19:59:22-06:00
tags: vim, tmux
keywords: fonts, osx, vim, tmux
summary: Patched fonts on MacOSX
---

Getting patched fonts for a powerline in the terminal can be quite an adventure, especially when you are using vim and tmux.
I almost gave up on it, but now that I've figured it out it seems extremely obvious.

```bash
# pip install --user powerline-status
# brew install fontforge --with-python
git clone https://github.com/powerline/fonts.git
cd fonts
./install.sh
```

Most importantly, select the font with the word `powerline` in the name in the preferences option of your terminal.
