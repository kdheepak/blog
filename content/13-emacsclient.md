---
title: Create Emacsclient.app using AppleScript
category: blog
date:  Jul 18 10:00:00 MDT 2015
tags: emacs, applescript, osx
keywords: Create an emacsclient application using OSX, applescript
summary: I've created an Emacsclient.app using AppleScript to aid with my Alfred workflow ...
alias: /blog/create-emacsclientapp-using-applescript/
---

Open Automator and go to File->New. Click on Application.

![](../../images/emacsclient1.png)

Then search for 'Run AppleScript' and drag it to the window on the right.

![](../../images/emacsclient2.png)

Copy paste the following gist to the window

<script src="https://gist.github.com/kdheepak/9e287b937edb2509eab9.js"></script>

Save the application in /Applications or /Users/$USER/Applications. Now you can
quickly open emacsclient from Alfred. 

Also check out Alfred workflows in the link below

[https://github.com/franzheidl/alfred-workflows#open-with-emacs](https://github.com/franzheidl/alfred-workflows#open-with-emacs)
