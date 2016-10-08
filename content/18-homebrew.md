---
title: Uninstalling and Re-Installing Homebrew on OSX
date: Thu Aug 27 22:52:17 MDT 2015
category: blog
tags: osx
keywords: how to install homebrew on osx, how to remove homebrew on osx
alias: /blog/uninstalling-and-Re-Installing-Homebrew-on-OSX/
---

[Gist](https://gist.github.com/mxcl/1173223)

    #!/bin/sh
    # Just copy and paste the lines below (all at once, it won't work line by line!)
    # MAKE SURE YOU ARE HAPPY WITH WHAT IT DOES FIRST! THERE IS NO WARRANTY!

    brew list > ~/brew_list.txt
    
    function abort {
      echo "$1"
      exit 1
    }
    
    set -e
    
    /usr/bin/which -s git || abort "brew install git first!"
    test -d /usr/local/.git || abort "brew update first!"
    
    cd `brew --prefix`
    git checkout master
    git ls-files -z | pbcopy
    rm -rf Cellar
    bin/brew prune
    pbpaste | xargs -0 rm
    rm -r Library/Homebrew Library/Aliases Library/Formula Library/Contributions 
    test -d Library/LinkedKegs && rm -r Library/LinkedKegs
    rmdir -p bin Library share/man/man1 2> /dev/null
    rm -rf .git
    rm -rf ~/Library/Caches/Homebrew
    rm -rf ~/Library/Logs/Homebrew
    rm -rf /Library/Caches/Homebrew

Set permission on Homebrew folder

    sudo chown -R $USER /Library/Caches/Homebrew/
