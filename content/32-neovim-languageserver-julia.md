---
title: Neovim + LanguageServer.jl
slug: neovim-languageserver-julia
category: blog
date: 2020-06-02T01:28:44-06:00
tags: neovim, languageserver, julia
keywords: neovim, vim, languageserver, julia, lsp
summary: Showcasing Neovim and LanguageServer.jl
---

I wanted to showcase the capabilities of Julia's LanguageServer.jl and Neovim's built in lsp client.

# Completion

![[vim.lsp.omnifunc](https://github.com/kdheepak/dotfiles/blob/9f2f76877e0b6ace32c109d95e206ee9f1851193/vimrc#L648)](images/autocomplete.mov.gif){ .fullwidth }

# Documentation

![[vim.lsp.buf.hover](https://github.com/kdheepak/dotfiles/blob/9f2f76877e0b6ace32c109d95e206ee9f1851193/vimrc#L971)](images/documentation.mov.gif){ .fullwidth }

# Jump to definition

![[vim.lsp.buf.definition](https://github.com/kdheepak/dotfiles/blob/9f2f76877e0b6ace32c109d95e206ee9f1851193/vimrc#L968)](images/jumptodefinition.mov.gif){ .fullwidth }

# Linting

![[vim.lsp.util.show_line_diagnostics](https://github.com/kdheepak/dotfiles/blob/9f2f76877e0b6ace32c109d95e206ee9f1851193/vimrc#L992)](images/linting.mov.gif){ .fullwidth }

# Show all references in quickfix window

![[vim.lsp.buf.references](https://github.com/kdheepak/dotfiles/blob/9f2f76877e0b6ace32c109d95e206ee9f1851193/vimrc#L983)](images/references.mov.gif){ .fullwidth }

# Show all symbols in current document

![[vim.lsp.buf.document\_symbol](https://github.com/kdheepak/dotfiles/blob/9f2f76877e0b6ace32c109d95e206ee9f1851193/vimrc#L986)](images/symbols.mov.gif){ .fullwidth }
