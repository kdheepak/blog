---
title: Quickstart guide to using a terminal
tags: terminal
keywords: terminal, bash, zsh, shell
summary: If you are using a terminal for the first time, here's a number of useful things to know to get you started.
date: 2022-07-12T00:03:15-0600
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

Type the following in your terminal:

```bash
$ echo "hello world"
```

```
hello world
```

2. `ls`

Now type the following:

```bash
$ ls $HOME
```

`ls` lists the files and folders in a particular directory.

Now try running `ls -al $HOME`.
Notice the `-al` flags.
The `-a` flag is for `all` files or folders and `-l` is for printing it out in a list form.

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

::: tip
Learning how to read "permissions" for files and folders when you use `ls -al path/to/file-or-folder` is crucial to debugging issues with permissions.
:::

A couple of things to note about flags.

- You can typically use them in any order, i.e. `ls -al` is equivalent to `ls -la`
- You can see the full list of options available by using `man ls`.
- Other command line tools might have a `-h/--help` flag that prints out all available flags.

I personally always want to see the output of `ls` in a list form.
If you add the following "alias" to your `.bashrc` or `.bash_profile`, you can use `ls` to invoke `ls -al`.

```bash
alias ls="ls -al"
```

3. `pwd`

Type `pwd` in your terminal.
It should print the full path to the "present working directory" folder in your terminal.
This can be useful to figure out in which directory your prompt is currently is "in".
Typically, any script or command you run will use the `pwd` as the current directory in the script.

4. `cd`

You can use `cd` to "change directory".
Use `cd` or `cd ~` to change to your home directory, and use `cd -` to go back to the last directory that you were in.
Run the following line by line in your terminal:

```bash
pwd
cd ~
pwd
cd -
pwd
```

5. `cp`

You can use `cp /path/to/source /path/to/destination` to "copy" a file from a source location to a destination location.
If you want to copy a folder, you'll need to use `cp -r` for "recursively copy".

6. `mv`

You can use `mv /path/to/source /path/to/destination` to "move" a file or folder from a source location to a destination location.
If you want to rename a file or folder, you will have to `mv oldname newname`.
You want to ensure that the destination does not exist or there is no folder by that name, otherwise you may end up overwriting or moving it to an unintended location.

`mv` has the following flags:

```
       -i      Cause mv to write a prompt to standard error before moving a file that would overwrite an existing file.  If          ↪ the response from the standard input begins with the character `y' or `Y', the move is attempted.  (The -i option           ↪ overrides any previous -f or -n options.)

       -v      Cause mv to be verbose, showing files after they are moved.
```

I like to alias `mv` to `mv -iv` since I always want to play it safe.

7. `rm`

You can use `rm` to remove files.
You can use `rm -r` to remove folders.

8. `mkdir`

You can use `mkdir /path/to/dir` to "make a directory" if `/path/to/` already exists.
If you wish to create nested directories, you can use the `-p` flag, i.e. `mkdir /path/to/nested/dir`.

9. `cat`

`cat` concatenates and prints files to the terminal standard out.
This is useful for seeing the contents of a text file without opening it.

There are two additional commands that are useful for seeing the first or last `n` lines in a file, i.e. `head` and `tail`.

10. `find`

`find` is extremely useful in finding if a file of a certain name or type exists.

```bash
find . -name *.md
```

You can use regular expressions to widen your search criteria.

11. `grep`

`grep` is handy in finding text within files. I like to use `-ri` for recursively searching for a case insensitive match in a particular folder.

```bash
$ grep -ri "when I first" src/posts
```

```
src/posts/10-fast-track-to-being-productive-with-vim.md:summary: What I wish I had known when I first started using vim
src/posts/10-fast-track-to-being-productive-with-vim.md:When I first started using vim three months ago, I found it quite challenging to get meaningful work done.
```

12. `vi` or `vim` or `nano` or `emacs`

Finally, learning how to use a text editor can go a long way in getting you comfortable with a terminal.
Check out [my post on how to get started with vim](./10-fast-track-to-being-productive-with-vim.md) for more information.

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

# <kbd>Ctrl + c</kbd>

For long running processes, you can use <kbd>Ctrl + c</kbd> to kill the process.
You can use <kbd>Ctrl + z</kbd> to background a currently running process and type `fg` to foreground the last backgrounded process.

# Piping

One of the advantages of working from the terminal is that once you have some basics down, you can chain together commands really easily.
You can do this using the pipe operator, i.e. `|`.

Let's say I wanted to show the last 3 lines or the `README.md` in my current folder:

```bash
bat README.md | tail -n3
```

````
  44   │ ```bash
  45   │ npm run deploy
  46   │ ```
───────┴────────────────────────────────────────────────────────────────────────
````

Let's say I wanted to find all the files with "vim" in the name:

```bash
rg --files | rg vim
```

```
58:src/posts/38-rust-lua-nvim.md
91:src/posts/11-vim-tmux-zsh.md
99:src/posts/34-three-built-in-neovim-features.md
110:src/posts/videos/vimtutor.webm
112:src/posts/32-neovim-languageserver-julia.md
113:src/posts/10-fast-track-to-being-productive-with-vim.md
127:src/posts/25-tmux-neovim.md
135:src/posts/20-custom-path-vim.md
157:src/posts/images/nvim-highlight-yank.mov.gif
176:src/posts/images/nvim-live-substitution.mov.gif
182:src/posts/images/nvim-built-in-lsp.mov.gif
189:src/posts/images/vim-tmux-zsh.png
```

The `|` operator takes the `stdout` of one command and feeds it as input to the next.
