---
title: Change `$PATH` inside vim
category: blog
date: 2015-09-19T09:05:36-06:00
tags: neovim, vim, osx
keywords: neovim, vim, osx, change path, set path,
summary: How to change `$PATH` from inside vim
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
