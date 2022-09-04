---
title: Installing `homebrew` in an alternative location
tags: osx
keywords: homebrew, alternative, install, osx
summary: Install `homebrew` in an alternative location to avoid globally available homebrew executables and libraries
date: 2022-08-03T13:47:12-0600
---

See [https://gist.github.com/pudquick/29bc95b6c49703992981864e48f8e341](https://gist.github.com/pudquick/29bc95b6c49703992981864e48f8e341)

1. Install homebrew in `~/.local/homebrew`.

```
cd ~/.local/
mkdir homebrew && curl -L https://github.com/Homebrew/brew/tarball/master | tar xz --strip 1 -C homebrew
```

2. Add the following to PATH `alias brew=~/.local/homebrew/bin/brew`
