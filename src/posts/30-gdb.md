---
title: How to install gdb on OSX
date: 2015-07-27T10:52:17-06:00
category: blog
summary: Installing gdb and fixing the certificate issue
---

```bash
brew tap homebrew/dupes
brew install gdb
```

Certificate issue can be resolved by the following steps

```bash
sudo security add-trust -d -r trustRoot -p basic -p codeSign -k /Library/Keychains/System.keychain ~/Desktop/gdb-cert.cer
```
