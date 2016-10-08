---
title: Spotify and tmux
category: blog
date: Sun Sep 20 09:26:15 MDT 2015
tags: tmux
keywords: tmux, spotify, powerline
alias: /blog/spotify-and-tmux/
---

Create a file named tmux-spotify-info and place it in a directory that in your `$PATH`. Add the following snippet of code into the file and make sure it is executable.

```
#!/usr/bin/env osascript
# Returns the current playing song in Spotify for OSX

tell application "Spotify"
  if it is running then
    if player state is playing then
      set track_name to name of current track
      set artist_name to artist of current track

      "#[fg=colour39,nobold]#[fg=colour16, bg=colour39, nobold] " & artist_name & " - " & track_name & " #[bg=colour39]"
    end if
  end if
end tell
```

Add this to the end of ~/.tmux.conf

```
# Bad Wolf by Steve Losh
# Modified by Dheepak Krishnamurthy
# =====================
set -g status-fg white
set -g status-bg colour234
# set -g status-bg default #set for transparent background
set -g window-status-activity-attr bold
set -g pane-border-fg colour245
set -g pane-active-border-fg colour39
set -g message-fg colour16
set -g message-bg colour221
set -g message-attr bold
# Custom status bar
# Powerline
set -g status-left-length 32
set -g status-right-length 150
set -g status-interval 5
# Lets add the current weather to our status bar—why? Well Why the french-toast not?
set -g status-left '#[fg=colour16,bg=colour254,bold] #S #[fg=colour254,bg=colour238,nobold]#[fg=colour15,bg=colour238,bold] #(weathermajig boulder --short) #[fg=colour238,bg=colour234,nobold]'
set -g status-right '%R #[fg=colour238,nobold]#[fg=colour254, bg=colour238] %d %b #(tmux-spotify-info)#[fg=colour254,nobold]#[fg=colour16,bg=colour254,bold] #h '
set -g window-status-format "#[fg=white,bg=colour234] #I #W "
set -g window-status-current-format "#[fg=colour234,bg=colour39]#[fg=colour16,bg=colour39,noreverse,bold] #I ❭ #W #[fg=colour39,bg=colour234,nobold]"
```

And your favourite song will be listed in your tmux powerline! You can change the colours by playing the values above.

![tmux-spotify](/images/tmux-spotify.png)
