---
title: Geektool and Desktop Widgets in OSX
category: blog
date: 2014-12-13 10:00
tags: OSX
summary:  This is a Geektool tutorial on customizing OSX desktop - Calvin & Hobbes themed ...
alias: /blog/geektool-and-desktop-widgets-in-osx/
---

<p>This is a Geektool tutorial on how to customize your Mac OSX desktop homescreen. Using Geektool you can add a widget like functionality to your desktop.</p>
<p title=""><a href="https://plus.google.com/photos/+DheepakKrishnamurthy/albums/5969008662076135425" title=""><img alt="" src="https://lh4.googleusercontent.com/TZkEbkEUgfXVhtL3XNgQ8tYNuaO_WF_WhgtuN0nYGJEx=s0" width="100%/" title="" style=""></a></p>
<p><a href="https://plus.google.com/photos/+DheepakKrishnamurthy/albums/5969008662076135425"><img alt="" src="https://raw.githubusercontent.com/kdheepak/GeekToolBash/master/Screenshots/1.png" width="45%" ></a> <a href="https://plus.google.com/photos/+DheepakKrishnamurthy/albums/5969008662076135425"><img alt="" src="https://raw.githubusercontent.com/kdheepak/GeekToolBash/master/Screenshots/2.jpg" width="45%" ></a></p>
<p>All you need to do is download the following script from <a href="https://github.com/kdheepak/GeekToolBash/blob/master/bashScript">here</a> and place it in any folder. Then add a Geektool script and link it to the bash script you’ve downloaded.</p>
<p><img alt="" src="https://raw.githubusercontent.com/kdheepak/GeekToolBash/master/Screenshots/3.png" width="100%"></p>
<p style="text-align: center;"><img class="aligncenter" alt="" src="https://raw.githubusercontent.com/kdheepak/GeekToolBash/master/Screenshots/4.png" width="50%/"></p>
<p>I’ve also used a Calvin and Hobbes / Bill Watterson font to display the day, time and weather using the following codes.</p>
<p>Day</p>
<pre class="brush: bash; title: ; notranslate" title="">date '+%A' | tr [:lower:] [:upper:]
</pre>
<p>Time</p>
<pre class="brush: bash; title: ; notranslate" title="">date '+%I: %M %p'
</pre>
<p>Weather</p>
<pre class="brush: bash; title: ; notranslate" title="">curl --silent "https://xml.weather.yahoo.com/forecastrss?p=50014&amp;u=f" | grep -E '(Current Conditions:|F&lt;BR)' | sed -e 's/Current Conditions://' -e 's/
//' -e 's/&lt;b&gt;//' -e 's/&lt;\/b&gt;//' -e 's/
//' -e 's///' -e 's/&lt;\/description&gt;//'
</pre>
<p><br>
You can also display your battery level, uptime, network connectivity status. There are also loads of preset Geeklets that you can download to get yourself a good looking homescreen. Sky is the limit!</p>


