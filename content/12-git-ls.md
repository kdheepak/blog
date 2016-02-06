Title:Better git log with git ls
Category:blog
Date:Jun 1 20:45:00 MDT 2015
Tags:git
Keywords:Git tips and tricks
Summary:I've competely stopped using git log and have replaced it with this custom command ...
Alias:/blog/better-git-log-with-git-ls/


Add the following command to ~/.gitconfig


    [alias]
        ls = log --graph --abbrev-commit --decorate --color=always --date=relative --format=format:'%C(bold blue)%h%C(reset) - %C(bold green)(%ar)%C(reset) %C(white)%s%C(reset) - %C(dim red)%an%C(reset)%C(bold yellow)%d%C(reset)' --all


Here is an example of what the command output looks like.

![](../../images/gitls.png)
