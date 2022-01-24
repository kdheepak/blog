---
title: Emacsclient and tmux split navigation
date: 2015-07-26T22:00:00-06:00
tags: emacs, osx
keywords: emacsclient, terminal, workflow, tmux, split, navigation
summary: I use the following set of lisps my .emacs to get seamless navigation between emacs splits and tmux panes ...
---

I've described some of the scripts that I use regularly when using emacs in the terminal. I also using emacs with tmux, even though it seems like emacs itself could be tweaked to replace tmux. Currently, my tmux+zsh setup has been much more powerful that what emacs alone can provide. zsh did not play well, even with multiterm and I've had mixed results with getting ipython to work well inside emacs.

I use the following set of lisps my .emacs to get seamless navigation between emacs splits and tmux panes.

```lisp
;; Many thanks to the author of and contributors to the following posts:
;; https://gist.github.com/mislav/5189704
;; https://robots.thoughtbot.com/post/53022241323/seamlessly-navigate-vim-and-tmux-splits
;;
;; TODO: Make a script that generates tmux and emacs code without duplication
;;
;; NOTE: My keybindings are not the default emacs ones, using windmove

;; Try to move direction, which is supplied as arg
;; If cannot move that direction, send a tmux command to do appropriate move
(defun windmove-emacs-or-tmux(dir tmux-cmd)
(interactive)
(if (ignore-errors (funcall (intern (concat "windmove-" dir))))
nil                       ;; Moving within emacs
(shell-command tmux-cmd)) ;; At edges, send command to tmux
)

;Move between windows with custom keybindings
(global-set-key (kbd "C-k")
   '(lambda () (interactive) (windmove-emacs-or-tmux "up"  "tmux select-pane -U")))
(global-set-key (kbd "C-j")
   '(lambda () (interactive) (windmove-emacs-or-tmux "down"  "tmux select-pane -D")))
(global-set-key (kbd "C-l")
   '(lambda () (interactive) (windmove-emacs-or-tmux "right" "tmux select-pane -R")))
(global-set-key (kbd "C-h")
   '(lambda () (interactive) (windmove-emacs-or-tmux "left"  "tmux select-pane -L")))
```

The following was added to .tmux.conf

```tmux
    ## Smart pane switching with awareness of emacs splits.
    bind -n C-h run "(tmux display-message -p '#{pane_current_command}' | grep -iqE '(^|\/)g?(view|emacs?)(diff)?$' && tmux send-keys C-h) || tmux select-pane -L"
    bind -n C-j run "(tmux display-message -p '#{pane_current_command}' | grep -iqE '(^|\/)g?(view|emacs?)(diff)?$' && tmux send-keys C-j) || tmux select-pane -D"
    bind -n C-k run "(tmux display-message -p '#{pane_current_command}' | grep -iqE '(^|\/)g?(view|emacs?)(diff)?$' && tmux send-keys C-k) || tmux select-pane -U"
    bind -n C-l run "(tmux display-message -p '#{pane_current_command}' | grep -iqE '(^|\/)g?(view|emacs?)(diff)?$' && tmux send-keys C-l) || tmux select-pane -R"
    bind -n C-\ run "(tmux display-message -p '#{pane_current_command}' | grep -iqE '(^|\/)g?(view|emacs?)(diff)?$' && tmux send-keys 'C-\\') || tmux select-pane -l"
```
