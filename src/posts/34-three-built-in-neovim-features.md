---
title: Three built-in `neovim` features
date: 2020-06-27T09:42:32-06:00
tags: neovim
keywords: neovim, nvim, neovim vs vim, nightly, highlight, yank, text, live, substitution, built-in lsp, language server protocol
summary: I want to share a few neovim built-in features that can make you more productive.
---

I want to share three built-in `neovim` features that I think are under the category of "quality of life improvements".
They are **live substitution**, **highlight yanked text**, and the built-in **language server protocol** support.

# Live Substitution

By default, `vim`’s `:substitute` command only modifies the document when you execute the command by pressing `Enter` (`<CR>`).
In `neovim`, you can update the document interactively. `neovim` also shows you a preview window of all the changes you are going to make in the document.

![](images/nvim-live-substitution.mov.gif){.fullwidth}

Just add the following option to your `vimrc` file.

```vim
set inccommand=split
```

# Highlight Yanked Text

With the latest version of neovim, you have the ability to highlight yanked text without using any plugins[^1].

[^1]: _aside_: If you want to use this feature in `neovim` v0.4.x or in `vim` 8, you can do so with [this](https://github.com/machakann/vim-highlightedyank) or [this](https://github.com/statox/FYT.vim) plugin. Also, check out this well written [post](https://www.statox.fr/posts/vim/vim_flash_yanked_text/) on how this works under the hood.

![](images/nvim-highlight-yank.mov.gif){.fullwidth}

At the time of writing, you'll need a `v0.5.0` or `nightly`[^nightly-1] release of `neovim` for this feature.

[^nightly-1]: _aside_: Precompiled binaries are available on the [github releases](https://github.com/neovim/neovim/releases/tag/nightly) page.

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

# Language Server Protocol

`neovim` has a built-in implementation of the [Language Server Protocol](https://microsoft.github.io/language-server-protocol/) client and [default configurations for over 50 languages](https://github.com/neovim/nvim-lsp).

![Completion, diagnostics and jump to references in lua.](images/nvim-built-in-lsp.mov.gif){.fullwidth}

At the time of writing, you'll need a `v0.5.0` or `nightly`[^nightly-2] release of `neovim` for this feature.

[^nightly-2]: _aside_: Precompiled binaries are available on the [github releases](https://github.com/neovim/neovim/releases/tag/nightly) page.

```bash
nvim --version | head -1
```

```
NVIM v0.5.0-556-ge78658348
```

While technically you can configure the LSP client straight from your `vimrc` file, it is easier to use configurations from the [`neovim/nvim-lsp`](https://github.com/neovim/nvim-lsp) repository that the `neovim` developers maintain.

In order to set this up you need to do 3 things:

1. Add the `neovim/nvim-lsp` plugin:

   ```vim
   Plug 'neovim/nvim-lsp'
   ```

2. Run `:LspInstall {servername}`:

   ```vim
   :LspInstall sumneko_lua
   :LspInstall julials
   :LspInstall nimls
   :LspInstall rust_analyzer
   :LspInstall vimls
   :LspInstall pyls
   ```

3. Set up configurations with options in your `vimrc`:

   ```lua
   lua <<EOF
       local nvim_lsp = require'nvim_lsp'
       nvim_lsp.sumneko_lua.setup()
       nvim_lsp.julials.setup()
       nvim_lsp.nimls.setup()
       nvim_lsp.vimls.setup()
       nvim_lsp.pyls.setup{
           settings = {
               pyls = {
                   configurationSources = {
                       pycodestyle,
                       flake8
                   }
               }
           }
       }
   EOF
   ```
