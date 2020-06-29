---
title: Neovim quality of life features
category: blog
date: 2020-06-27T09:42:32-06:00
tags: neovim
keywords: neovim, versus, vim, nightly, highlight, yank, text, live, substitution, built, in, lsp, language, server, protocol, client
summary: Three features in neovim that can make you more productive
---

I want to share three features in `neovim` quality of life improvements over `vim` that are built in to the editor.

# Live Substition

By default, `vim`’s `:substitute` command only modifies the document when you execute the command by pressing `Enter` (`<CR>`).
In `neovim`, you can update the document live as well as show a preview of all the changes you are going to make by setting the following option.

![](images/nvim-live-substitution.mov.gif){.fullwidth}

Just add the following to your `vimrc` file.

```
set inccommand=nosplit
```

# Highlight Yanked Text

The next feature is the ability to highlight yanked text[^1].

[^1]: _aside_: If you want to use this feature in `neovim` v0.4.x or in `vim` 8, you can do so with this plugin: <https://github.com/machakann/vim-highlightedyank>.

![](images/nvim-highlight-yank.mov.gif){.fullwidth}

At the time of writing, you'll need a `v0.5.0` or [`nightly`](https://github.com/neovim/neovim/releases/tag/nightly) release of `neovim` to this feature.

```bash
$ nvim --version | head -1
```

```
NVIM v0.5.0-556-ge78658348
```

You can add the following in your vimrc to enable this feature:

<figure class="fullwidth">
```vim
augroup LuaHighlight
  autocmd!
  autocmd TextYankPost * silent! lua require'vim.highlight'.on_yank()
augroup END
```
</figure>

# Built in LSP

`neovim` has a built in implementation of Language Server Protocol client and [default configurations for over 50 languages](https://github.com/neovim/nvim-lsp).

![](images/nvim-built-in-lsp.mov.gif){.fullwidth}

At the time of writing, you'll need a `v0.5.0` or [`nightly`](https://github.com/neovim/neovim/releases/tag/nightly) release of `neovim` to this feature.

```bash
$ nvim --version | head -1
```

```
NVIM v0.5.0-556-ge78658348
```

Setting it up requires three steps.

1) Adding the configurations repository as a `neovim` plugin:

    ```
    Plug 'neovim/nvim-lsp'
    ```

2) Running `:LspInstall {servername}`:

    <figure class="fullwidth">
    ```vim
    :LspInstall sumneko_lua
    :LspInstall julials
    :LspInstall nimls
    :LspInstall rust_analyzer
    :LspInstall vimls
    :LspInstall pyls
    ```
    </figure>

3) Setting up the configurations with all the options you want in your vimrc:

    <figure class="fullwidth">
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
    </figure>
