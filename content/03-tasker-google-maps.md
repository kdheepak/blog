---
title:  Tasker and Google Maps
category: blog
date: 2014-12-13T10:00:00-06:00
tags: Tasker,Android
summary: Tasker in combination with Python with SL4A can be used to calculate information about events from Google Calendar. This is very similar to what Google Now does but more customizable ...
---


### Android Projects

I've shared this on
[UnleashThePhones](https://unleashthephones.com/2013/06/03/tasker-tutorial-integrating-google-calendar-and-google-directions-using-transit/)
a while back as well. This is a small tutorial on how to use Python with
SL4A.

![](https://raw.githubusercontent.com/kdheepak/tasker_sl4a/master/Screenshots/5.png){.aligncenter
width="270" height="480"}

When Google Now first came out, it would tell you which bus you could
take at what time to get to your meeting or event on time based on the
location and time information available in Google Calendar. It's every
student's dream, especially in countries like the United States or
Singapore, where transit navigation is very accurate.

I loved the idea, but I wanted it to be ever so slightly better. For
example, I wanted my phone to inform me well in advance at what time I
should consider leaving home to get to the bus on time. I also wanted
information on earlier and later buses, so I could have knowledge of my
options, very similar to the way it shows in Google Directions.

Enter Tasker. I have a profile set up, which responds to a Google
Calendar event reminder. (Tasker requires accessibility access for this
by the way.) All my events in Google Calendar have a reminder set to pop
up one hour before the event. This triggers a python script that pulls
the next event details from Google Calendar, strips and parses the
necessary information. Using my current location, the directions to the
location is fetched and parsed again for transit details. Tasker then
displays this as a notification.

![](https://raw.githubusercontent.com/kdheepak/tasker_sl4a/master/Screenshots/7.png){.aligncenter
width="270" height="480"}

This is very similar to a thread found on XDA-Dev. The idea is based on
the thread, but in the thread brandall decided to do everything in
Tasker. While this is completely doable it made it a little complicated
to debug. Also, the profiles attached in his thread require the calendar
event to have the name 'Meeting' and also require a description to be
entered. Again, not something you cannot do, but you will have to invest
a significant amount of time in case you want to make any significant
change.

If you would like to setup something similar follow the steps below.

1) Install Tasker, SL4A and the Python intepreter.

2) Paste the python script from the link here in the SL4A folder. This
script has to be modified depending on what you want done. To use
information from your Google Calendar, you need to add your private
Google Calendar link to the script. I've written this to pull Transit
details from a xml data, but you can theoretically do anything.

3) Setup a tasker profile similar to what I have below.

![](https://raw.githubusercontent.com/kdheepak/tasker_sl4a/master/Screenshots/1.png){.aligncenter
width="270" height="480"}

4) The Task that will be performed when this context is triggered is
setup as below.

![](https://raw.githubusercontent.com/kdheepak/tasker_sl4a/master/Screenshots/2.png){width="270"
height="480"}[ ]{style="text-align: center; line-height: 1.5em;"}![](https://raw.githubusercontent.com/kdheepak/tasker_sl4a/master/Screenshots/3.png){width="270"
height="480"}

5) The above task turns on GPS, finds your current location using GPS
and NET, stores the location data in a file and runs the python script.
The python script uses the location data written into the file along
with your next calendar event information to find out transit details.
This then calls the show route task.

6) The show route is attached below.

![](https://raw.githubusercontent.com/kdheepak/tasker_sl4a/master/Screenshots/4.png){.aligncenter
width="270" height="480"}

7) All you need to do now is create an event on your Calendar with
location information and you are good to go!

Here are some screenshots of what it looks like after you are done.

![](https://raw.githubusercontent.com/kdheepak/tasker_sl4a/master/Screenshots/6.png){width="270"
height="480"} ![](https://raw.githubusercontent.com/kdheepak/tasker_sl4a/master/Screenshots/7.png){width="270"
height="480"}

I've attached the xml from Tasker
[here](https://github.com/kdheepak/tasker_sl4a/blob/master/pyCode.py) so
that it can be imported. Show Route and GetCalData. I've used
Autonotification, a tasker plugin by joaomgcd to display the
notification. You will need to use this if you want a button in the
notification. This entire setup is currently in a primitive stage, I
haven't added any error handling or additional functionality but I
intend to. I will update this post when I do that.

BeautifulSoup is supported by SL4A in python, which can make it
extremely easy to parse information. I haven't used it in my script
though, since mine was a very small program. But it is nice to know that
is an option. Big shoutout to PocketTables for offering a world of
useful information on Tasker. I found their posts to be extremely
helpful. Tasker is an amazing application and is extremely powerful. It
can allow for a world of customization.

If you have any questions about this setup please do let me know.
