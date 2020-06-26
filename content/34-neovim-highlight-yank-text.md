---
title: Neovim Highlight Yank Text
category: blog
date: 2020-06-27T09:42:32-06:00
tags: neovim
keywords: neovim, highlight, yank, text
summary: Visually highlight the text in neovim when yanking it
---

Neovim has a few quality of life features built in to the editor. One of them is neovim's feature to highlight yanked text[^1: If you want to use this feature in vim, you can do so with this plugin.].

![](images/vim-highlight.mov.gif)

At the time of writing, you'll need a nightly release for this feature of neovim.

```bash
nvim --version | head -1
```

```
NVIM v0.5.0-556-ge78658348
```

You can add the following in your vimrc to enable this feature:

```vim
augroup LuaHighlight
  autocmd!
  autocmd TextYankPost * silent! lua require'vim.highlight'.on_yank()
augroup END
```
