---
title: Change $PATH inside vim
category: blog
date: Sat Sep 19 09:05:36 MDT 2015
tags: neovim, vim, osx
keywords: neovim, vim, osx, change path, set path,
---

Save the following script in `/usr/local/bin/cpvim`

```
#!/bin/zsh
source ~/.zshrc >/dev/null 2>&1
PATH=$VIM_PATH
exec nvim "$@"
```

Add the following to your .zshrc

    alias vim=/usr/local/bin/cpvim

