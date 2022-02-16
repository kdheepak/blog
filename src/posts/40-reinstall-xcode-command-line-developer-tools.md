---
title: Reinstall xcode command line developer tools
date: 2022-02-15T16:03:31-06:00
tags: osx
keywords: reinstall xcode command line developer tools
summary: Steps to uninstall and reinstall xcode command line developer tools
---

Delete existing command line tools and install them again.

::: Warning
This requires root.
:::

```bash
# uninstall command line tools
sudo rm -rf /Library/Developer/CommandLineTools
# install command line tools
xcode-select —install
```
