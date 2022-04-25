---
title: Better git log with git ls
date: 2015-06-01T20:45:00-06:00
tags: git
keywords: Git tips and tricks
summary: I've stopped using git log and have replaced it with this custom command ...
---

Add the following command to `~/.gitconfig`:

```toml
[alias]
    ls = log --graph --abbrev-commit --decorate --color=always --date=relative --format=format:'%C(bold blue)%h%C(reset) - %C(bold green)(%ar)%C(reset) %C(white)%s%C(reset) - %C(dim red)%an%C(reset)%C(bold yellow)%d%C(reset)' --all
```
