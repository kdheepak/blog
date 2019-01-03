---
title: Better git log with git ls
category: blog
date: Jun 1 20:45:00 MDT 2015
tags: git
keywords: Git tips and tricks
summary: I've competely stopped using git log and have replaced it with this custom command ...
---


Add the following command to ~/.gitconfig


    [alias]
        ls = log --graph --abbrev-commit --decorate --color=always --date=relative --format=format:'%C(bold blue)%h%C(reset) - %C(bold green)(%ar)%C(reset) %C(white)%s%C(reset) - %C(dim red)%an%C(reset)%C(bold yellow)%d%C(reset)' --all


Here is an example of what the command output looks like.

![](../../images/gitls.png)
