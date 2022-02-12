---
title: Emacs workflow — Using Emacs in the terminal
date: 2015-07-25T22:00:50-06:00
tags: emacs, tmux
keywords: emacs, workflow, emacs daemon, terminal, tmux
summary: A description of my emacs workflow
slug: emacs-workflow-using-emacs-in-the-terminal
---

I use the command line a lot, frequently editing files locally or remotely. Up until now, I've been using [vim with tmux and zsh](./11-vim-tmux-zsh.md). I've recently been experimenting with emacs and have been trying to get it to work well inplace of vim. I personally think the author of [this post](https://mjwall.com/blog/2013/10/04/how-i-use-emacs/) nailed it regarding emacs workflow. I've only made minor modifications to get it to suit my requirements.

I've created a separate script called ess (emacsserverstart) added a `&` at the end of the emacs script to get it to run in the background.

`/usr/local/bin/ess`:

```bash
#!/bin/zsh
/Applications/Emacs.app/Contents/MacOS/Emacs &
```

`/usr/local/bin/emacs`:

```bash
#!/bin/zsh
/Applications/Emacs.app/Contents/MacOS/Emacs "$@"
```

I've found that when using emacsclient connecting to `emacs --daemon` renders certain things differently, as compared to opening emacs, starting a server and connecting to that instead. I also have `(server-start)` in my .emacs file.

The following script connects a emacsclient to an already existing emacs server. If a server does not exist, it starts a daemon and then connects to it. This is done using the `-a ""` flag, which allows you to set an alternate editor. If no editor it set it defaults to running a daemon. It also shifts focus to the emacsclient after it opens.

`/usr/local/bin/ec`:

```bash
#!/bin/zsh

# This script starts emacs daemon if it is not running, opens whatever file
# you pass in and changes the focus to emacs.  Without any arguments, it just
# opens the current buffer or *scratch* if nothing else is open.  The following
# example will open ~/.bashrc

# ec ~/.bashrc

# You can also pass it multiple files, it will open them all.  Unbury-buffer
# will cycle through those files in order

# The compliment to the script is et, which opens emacs in the terminal
# attached to a daemon

# If you want to execute elisp, pass in -e whatever.
# You may also want to stop the output from returning to the terminal, like
# ec -e "(message \"Hello\")" > /dev/null

# emacsclient options for reference
# -a "" starts emacs daemon and reattaches
# -c creates a new frame
# -n returns control back to the terminal
# -e eval the script

# Number of current visible frames,
# Emacs daemon always has a visible frame called F1
visible_frames() {
  emacsclient -a "" -e '(length (visible-frame-list))'
}

change_focus() {
  emacsclient -n -e "(select-frame-set-input-focus (selected-frame))" > /dev/null
}


# try switching to the frame incase it is just minimized
# will start a server if not running
test "$(visible_frames)" -eq "1" && change_focus

if [ "$(visible_frames)" -lt  "2" ]; then # need to create a frame
  # -c $@ with no args just opens the scratch buffer
  emacsclient -n -c "$@" && change_focus
else # there is already a visible frame besides the daemon, so
  change_focus
  # -n $@ errors if there are no args
  test  "$#" -ne "0" && emacsclient -n "$@"
fi
```

This script opens an emacsclient in the terminal and connects it to a running server. The `-t` flag opens it in the terminal.

`/usr/local/bin/et`:

```bash
#!/bin/zsh

# Makes sure emacs daemon is running and opens the file in Emacs in
# the terminal.

# If you want to execute elisp, use -e whatever, like so

# et -e "(message \"Word up\")"

# You may want to redirect that to /dev/null if you don't want the
# return to printed on the terminal.  Also, just echoing a message
# may not be visible if Emacs then gives you a message about what
# to do when do with the frame

# The compliment to this script is ec

# Emacsclient option reference
# -a "" starts emacs daemon and reattaches
# -t starts in terminal, since I won't be using the gui
# can also pass in -n if you want to have the shell return right away

exec emacsclient -a "" -t "$@"
```

This following script stops the emacs server.

`/usr/local/bin/es`:

```bash
#!/bin/zsh

# simple script to shutdown the running Emacs daemon

# emacsclient options for reference
# -a Alternate editor, runs bin/false in this case
# -e eval the script

# If the server-process is bound and the server is in a good state, then kill
# the server

server_ok() {
  emacsclient -a "false" -e "(boundp 'server-process)"
}

if [ "t" == "$(server_ok)" ]; then
  echo "Shutting down Emacs server"
  # wasn't removing emacs from ALT-TAB on mac
  # emacsclient -e "(server-force-delete)"
  emacsclient -e '(spacemacs/kill-emacs)'
else
  echo "Emacs server not running"
fi
```
