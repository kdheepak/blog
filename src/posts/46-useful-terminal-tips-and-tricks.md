---
title: Beginner's guide to using a terminal
tags: terminal
keywords: terminal, bash, zsh, shell
summary: If you are using a terminal for the first time, here's a number of useful things to know to get you started.
---

If you are typically used to GUI applications, you may feel lost when you are getting started with a terminal.
In this post, I'll share a number of basic things that I think you should know that will help you get familiar with a terminal based workflow.

Typically, when you open a terminal on a linux or a mac, you may see something like this:

```bash
$
```

Or

```bash
bash-5.1$
```

This is your terminal prompt.

# Movement

One of the first things you should know is that you can't use your mouse to move your cursor, and almost everything you do needs to be done using your keyboard.

For starters, you can use <kbd>Ctrl + a</kbd> to move to the beginning of the line and <kbd>Ctrl + e</kbd> to move to the end of the line.

| Keyboard shortcut   | Action                          |
| ------------------- | ------------------------------- |
| <kbd>Ctrl + h</kbd> | Delete one character back       |
| <kbd>Ctrl + d</kbd> | Delete one character forward    |
| <kbd>Ctrl + k</kbd> | Delete to the end of line       |
| <kbd>Ctrl + u</kbd> | Delete to the beginning of line |
| <kbd>Ctrl + w</kbd> | Delete previous word            |
| <kbd>Ctrl + f</kbd> | Move forward one character      |
| <kbd>Ctrl + b</kbd> | Move backward one character     |

These are `readline` keybindings and we'll talk more about this in a future post.

# Useful built-in terminal utilties

1. `echo`
1. `ls`
1. `pwd`
1. `cd`
1. `rm`
1. `mkdir`
1. `cat`
1. `find`
1. `grep`
1. `vi` or `vim`

Type the following in your terminal:

```bash
$ echo "hello world"
```

```
hello world
```

Now type the following:

```bash
$ ls $HOME
```

`ls` lists the files and folders in a particular directory.

Now try running `ls -al $HOME`.
Notice the `-al` flags.

<!-- prettier-ignore -->
```bash
$ ls -al $HOME
Permissions Size Date Modified Name
drwx------     - 28 Jan  2020  .bash_sessions/
drwxr-xr-x     - 22 Jun 18:40  .cache/
drwxr-xr-x     - 15 Aug  2021  .cargo/
drwxr-xr-x     - 13 Apr  2020  .cmake/
drwxrwxr-x     - 12 Mar  2020  .conda/
drwxr-xr-x     -  6 Jun 09:23  .config/
drwxr-xr-x     - 23 Oct  2020  .gem/
drwxr-xr-x     -  5 Feb  2020  .ipython/
drwxr-xr-x     - 28 Feb  2021  .iterm2/
drwxr-xr-x     - 26 Jul  2020  .vit/
drwxr-xr-x     - 12 Jul  2020  .vscode/
drwxr-xr-x     -  4 Feb  2020  .yarn/
drwxr-xr-x     - 16 Sep  2021  .zfunc/
drwx--xr-x     - 26 Jul  2020  .zinit/
drwxr-xr-x     - 28 Jun 08:44  Applications/
drwxr-xr-x@    -  5 Jul 13:28  Desktop/
drwxr-xr-x     - 14 Dec  2021  Documents/
drwxr-xr-x@    -  5 Jul 13:21  Downloads/
drwxr-xr-x     - 28 Jun 14:39  gitrepos/
drwx------@    - 17 Feb 11:35  Library/
drwxr-xr-x     - 17 Jun 10:18  local/
drwxr-xr-x     -  9 May 11:34  miniconda3/
drwx------     -  2 Dec  2021  Movies/
drwx------     - 19 Feb  2020  Music/
drwx------     - 30 Jan  2020  Pictures/
drwxr-xr-x     - 28 Jan  2020  Public/
```

# Environment Variables

If you type the following and hit enter:

```bash
$ echo $HOME
```

you should see something like this being printed in your terminal:

```
/Users/USERNAME
```

`$HOME` is an environment variable that contains the value of your user's "home" directory.

# `.bashrc` and `.bash_profile`

# <kbd>Ctrl + c</kbd>, <kbd>Ctrl + d</kbd> and <kbd>Ctrl + z</kbd>

# Piping
