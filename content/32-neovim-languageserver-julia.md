---
title: Neovim + LanguageServer.jl
slug: neovim-languageserver-julia
category: blog
date: 2020-06-02T01:28:44-06:00
tags: neovim, languageserver, julia
keywords: neovim, vim, languageserver, julia, lsp
summary: Showcasing Neovim and LanguageServer.jl
---

I wanted to showcase the capabilities of [Julia's LanguageServer.jl](https://github.com/julia-vscode/LanguageServer.jl) and [Neovim's built in lsp client](https://neovim.io/doc/user/lsp.html), and show how you can install this on your machine.

# Capabilities

The `.vimrc` code for the capabilities show are linked below the image.

## Completion

![[vim.lsp.omnifunc](https://github.com/kdheepak/dotfiles/blob/9f2f76877e0b6ace32c109d95e206ee9f1851193/vimrc#L648)](images/autocomplete.mov.gif){ .fullwidth }

## Documentation

![[vim.lsp.buf.hover](https://github.com/kdheepak/dotfiles/blob/9f2f76877e0b6ace32c109d95e206ee9f1851193/vimrc#L971)](images/documentation.mov.gif){ .fullwidth }

## Jump to definition

![[vim.lsp.buf.definition](https://github.com/kdheepak/dotfiles/blob/9f2f76877e0b6ace32c109d95e206ee9f1851193/vimrc#L968)](images/jumptodefinition.mov.gif){ .fullwidth }

## Linting

![[vim.lsp.util.show_line_diagnostics](https://github.com/kdheepak/dotfiles/blob/9f2f76877e0b6ace32c109d95e206ee9f1851193/vimrc#L992)](images/linting.mov.gif){ .fullwidth }

## Show all references in quickfix window

![[vim.lsp.buf.references](https://github.com/kdheepak/dotfiles/blob/9f2f76877e0b6ace32c109d95e206ee9f1851193/vimrc#L983)](images/references.mov.gif){ .fullwidth }

## Show all symbols in current document

![[vim.lsp.buf.document\_symbol](https://github.com/kdheepak/dotfiles/blob/9f2f76877e0b6ace32c109d95e206ee9f1851193/vimrc#L986)](images/symbols.mov.gif){ .fullwidth }

# Install

If you'd like to use this you will need the following:

1. [neovim v0.5.0](https://github.com/neovim/neovim/releases/tag/nightly)
2. [`neovim/nvim-lsp`](https://github.com/neovim/nvim-lsp)

The `neovim/nvim-lsp` repository contains language server configurations for a bunch of languages.
Once you have `neovim/nvim-lsp` installed with your favorite plugin manager, you can run `:LspInstall julials`.
That should download and install `LanguageServer.jl` and `SymbolServer.jl` into your global environment.
You also may want to use [`JuliaEditorSupport/julia-vim`](https://github.com/JuliaEditorSupport/julia-vim) for syntax highlighting and other niceties.

At the time of writing, you'll have to make some changes to `julials` file. The changes are in this PR: https://github.com/neovim/nvim-lsp/pull/258.

And at the time of writing, neovim v0.5.0 isn't released yet, so you'll have to get the latest commit on `master` and build from source or download a release from the [`nightly`](https://github.com/neovim/neovim/releases/tag/nightly) tag on github.

Here is a minimal `.vimrc` configuration that works with `NVIM v0.5.0-539-g91e41c857`.

<figure class="fullwidth">
```vim
set nocompatible              " be iMproved, required
filetype off                  " required

if empty(glob('~/.local/share/nvim/site/autoload/plug.vim'))
  silent !curl -fLo ~/.local/share/nvim/site/autoload/plug.vim --create-dirs
    \ https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
  autocmd VimEnter * PlugInstall --sync | source $MYVIMRC
endif
"
" Specify a directory for plugins
" - For Neovim:
" - Avoid using standard Vim directory names like 'plugin'
call plug#begin('~/.local/share/nvim/plugged')

Plug 'JuliaEditorSupport/julia-vim' | " julia support for vim
Plug 'neovim/nvim-lsp'              | " collection of common configurations for the Nvim LSP client.

" Initialize plugin system
call plug#end()

let mapleader = " "

" use built in neovim lsp for autocomplete
autocmd Filetype julia setlocal omnifunc=v:lua.vim.lsp.omnifunc

lua << EOF
    require'nvim_lsp'.julials.setup{}
EOF

nnoremap <silent> <c-]> <cmd>lua vim.lsp.buf.definition()<CR>
nnoremap <silent> K     <cmd>lua vim.lsp.buf.hover()<CR>
nnoremap <silent> gD    <cmd>lua vim.lsp.buf.implementation()<CR>
nnoremap <silent> <c-k> <cmd>lua vim.lsp.buf.signature_help()<CR>
nnoremap <silent> 1gD   <cmd>lua vim.lsp.buf.type_definition()<CR>
nnoremap <silent> gr    <cmd>lua vim.lsp.buf.references()<CR>
nnoremap <silent> g0    <cmd>lua vim.lsp.buf.document_symbol()<CR>
nnoremap <silent> gW    <cmd>lua vim.lsp.buf.workspace_symbol()<CR>
```
</figure>
