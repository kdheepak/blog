Title:Change $PATH inside vim
Category:blog 
Date:Sat Sep 19 09:05:36 MDT 2015
Tags:neovim, vim, osx
Keywords:neovim, vim, osx, change path, set path,
Alias:/blog/change-PATH-inside-vim/

Save the following script in `/usr/local/bin/cpvim`

```
#!/bin/zsh
source ~/.zshrc >/dev/null 2>&1
PATH=$VIM_PATH 
exec nvim "$@"
```

Add the following to your .zshrc

    alias vim=/usr/local/bin/cpvim

