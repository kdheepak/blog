Title:Neovim and Tmux
Category:blog 
Status:draft
Date: Sat Feb  6 00:54:00 MST 2016

  brew update
  brew upgrade neovim
  brew install tmux
  brew install reattach-to-user-namespace
  infocmp $TERM | sed 's/kbs=^[hH]/kbs=\\177/' > $TERM.ti
  tic $TERM.ti
