---
title: Mac OSX Tweaks
category: blog
date: 2015-03-21 19:00
tags: OSX
summary: OSX is more customizable that you think. Here are a bunch of tweaks that I found useful. Since I've posted this, I've maintained a updated version of these tweaks along with my dotfiles on GitHub ...
alias: /blog/mac-osx-tweaks/
---

# Update

I've decided to maintain a repo [here](https://github.com/kdheepak/dotfiles/blob/master/.osx) instead. 

___

# General UI

    # Disable Dashboard
    defaults write com.apple.dashboard mcx-disabled -bool true

    # Don’t show Dashboard as a Space
    defaults write com.apple.dock dashboard-in-overlay -bool true
    
    # disable automatic spell checking
    defaults write -g NSAllowContinuousSpellChecking -bool false
    
    # don't treat period or colon as part of words
    # en_US_POSIX corresponds to the "United States (Computer)" setting that was shown in System Preferences in 10.8 and earlier
    defaults write -g AppleTextBreakLocale en_US_POSIX

    # Disable the sound effects on boot
    sudo nvram SystemAudioVolume=" "

# Disks                                                                        

    # Disks: disable Time Machine prompts
    defaults write com.apple.TimeMachine DoNotOfferNewDisksForBackup -bool true

    # Disks: disable local Time Machine backups
    hash tmutil &> /dev/null && sudo tmutil disablelocal

    # Disks: disable disk image verification
    # defaults write com.apple.frameworks.diskimages skip-verify -bool true
    # defaults write com.apple.frameworks.diskimages skip-verify-locked -bool true
    # defaults write com.apple.frameworks.diskimages skip-verify-remote -bool true

    # don't save .DS_Store files on network volumes
    defaults write com.apple.desktopservices DSDontWriteNetworkStores -bool true

    # Expand save panel by default
    defaults write NSGlobalDomain NSNavPanelExpandedStateForSaveMode -bool true

    # Don’t automatically rearrange Spaces based on most recent use
    defaults write com.apple.dock mru-spaces -bool false

# Keyboard                                                                     

    # Set a blazingly fast keyboard repeat rate
    defaults write NSGlobalDomain KeyRepeat -int 0

# Finder                                                                      

    # Disable automatic termination of inactive apps
    defaults write NSGlobalDomain NSDisableAutomaticTermination -bool true

    # Finder: disable window animations and Get Info animations
    defaults write com.apple.finder DisableAllAnimations -bool true

    # Finder: show all filename extensions
    defaults write NSGlobalDomain AppleShowAllExtensions -bool true

    # Disable the warning when changing a file extension
    defaults write com.apple.finder FXEnableExtensionChangeWarning -bool false

    # Save to disk (not to iCloud) by default
    defaults write NSGlobalDomain NSDocumentSaveNewDocumentsToCloud -bool false

    # Finder: disable window and Get Info animations
    defaults write com.apple.finder DisableAllAnimations -bool true

    # Finder: show the ~/Library folder (in OS X Lion)
    chflags nohidden ~/Library

    # Finder: empty Trash securely by default
    defaults write com.apple.finder EmptyTrashSecurely -bool true

# Dock & hot corners                                                          

    # Autohide the Dock
    defaults write com.apple.dock autohide -bool true

    # Magnify Dock icons on hover
    defaults write com.apple.dock magnification -bool false

# Panels                                                                      

    # Panels: expand save panel by default
    defaults write NSGlobalDomain NSNavPanelExpandedStateForSaveMode -bool true

    # Panels: expand print panel by default
    defaults write NSGlobalDomain PMPrintingExpandedStateForPrint -bool true

    # Panels: disable the “Are you sure you want to open this application?” dialog
    defaults write com.apple.LaunchServices LSQuarantine -bool false

    # Panels: enable full keyboard access for all controls (e.g. enable Tab in modal dialogs)
    defaults write NSGlobalDomain AppleKeyboardUIMode -int 3

# Screen                                                                      

    # Screen: save screenshots to the desktop
    defaults write com.apple.screencapture location -string "$HOME/Desktop"

    # Screen: disable shadow in screenshots
    defaults write com.apple.screencapture disable-shadow -bool true

# Misc                                                                        

    # Misc: only use UTF-8 in Terminal.app
    defaults write com.apple.terminal StringEncodings -array 4

    # Misc: disable Dictionary results
    defaults write com.apple.spotlight DictionaryLookupEnabled -bool false

    # Misc: disable auto-correct
    defaults write NSGlobalDomain NSAutomaticSpellingCorrectionEnabled -bool false

<!---
{% comment %} 
for app in "Dashboard" "Dock" "Finder" "SystemUIServer" "Terminal" "iTunes"; do
    killall "$app" > /dev/null 2>&1
done
{% uncomment %} 
-->
