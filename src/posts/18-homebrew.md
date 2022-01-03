---
title: Uninstalling and Re-Installing Homebrew on OSX
date: 2015-08-27T22:52:17-06:00
category: blog
tags: osx
keywords: how to install homebrew on osx, how to remove homebrew on osx
summary: How to install homebrew on MacOSX
---

[Gist](https://gist.github.com/mxcl/1173223)

```bash
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
```

Set permission on Homebrew folder

```bash
sudo chown -R $USER /Library/Caches/Homebrew/
```
