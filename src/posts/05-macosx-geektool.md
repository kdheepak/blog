---
title: Geektool and Desktop Widgets in OSX
category: blog
date: 2014-12-13T10:00:00-06:00
tags: osx
summary: This is a Geektool tutorial on customizing OSX desktop - Calvin & Hobbes themed ...
---

This is a Geektool tutorial on how to customize your Mac OSX desktop
homescreen. Using Geektool you can add a widget like functionality to
your desktop.

[![](https://lh4.googleusercontent.com/TZkEbkEUgfXVhtL3XNgQ8tYNuaO_WF_WhgtuN0nYGJEx=s0){width="100%/"}](https://plus.google.com/photos/+DheepakKrishnamurthy/albums/5969008662076135425)

[![](https://raw.githubusercontent.com/kdheepak/GeekToolBash/master/Screenshots/1.png){width="45%"}](https://plus.google.com/photos/+DheepakKrishnamurthy/albums/5969008662076135425)
[![](https://raw.githubusercontent.com/kdheepak/GeekToolBash/master/Screenshots/2.jpg){width="45%"}](https://plus.google.com/photos/+DheepakKrishnamurthy/albums/5969008662076135425)

All you need to do is download the following script from
[here](https://github.com/kdheepak/GeekToolBash/blob/master/bashScript)
and place it in any folder. Then add a Geektool script and link it to
the bash script you've downloaded.

![](https://raw.githubusercontent.com/kdheepak/GeekToolBash/master/Screenshots/3.png){width="100%"}

![](https://raw.githubusercontent.com/kdheepak/GeekToolBash/master/Screenshots/4.png){.aligncenter
width="50%/"}

I've also used a Calvin and Hobbes / Bill Watterson font to display the
day, time and weather using the following codes.

Day

```bash
date '+%A' | tr [:lower:] [:upper:]
```

Time

```bash
date '+%I: %M %p'
```

Weather

```bash
curl --silent "https://xml.weather.yahoo.com/forecastrss?p=50014&u=f" | grep -E '(Current Conditions:|F<BR)' | sed -e 's/Current Conditions://' -e 's/
//' -e 's/<b>//' -e 's/<\/b>//' -e 's/
//' -e 's///' -e 's/<\/description>//'
```

You can also display your battery level, uptime, network connectivity
status. There are also loads of preset Geeklets that you can download to
get yourself a good looking homescreen. Sky is the limit!
