---
title: Drawing in ASCII
date: 2020-06-05T13:54:19-06:00
tags: pandoc
keywords: ascii, svgbob, pandoc, filter, lua, circuit, diagrams
summary: Drawing ascii diagrams and rendering them to svg using svgbob, pandoc and lua filters
---

We can define [a lua filter for pandoc](https://github.com/kdheepak/blog/blob/39513edbb284ed29ce58508f74192d189603c96d/scripts/render.lua) that takes a code block that has the language defined as `render_svgbob`, and passes the text inside that code block to [svgbob](https://github.com/ivanceras/svgbob).

Here is a simple 3-bus circuit diagram using text / ascii.

````
```render_svgbob
ㅤ           |           +-----------+           |
           +-----------+           +-----------+
           |           +-----------+           |
     +-----+1               y12               2+------+
     |     |                                   |      |
     |     +-+                               +-+      |
   .-+-.   |  \                             /  |    .-+-.
   |   |       \                           /        |   |
   |   |y1    .-+-.                     .-+-.     y2|   |
   '-+-'       \   \ y13          y23  /   /        '-+-'
     |          \   \                 /   /           |
     |           '-+-'               '-+-'            |
  -------           \                 /            -------
    ---              +               +               ---
     -               |        3      |                -
                  ---+-------+-------+---
                             |
                           .-+-.
                           |   |
                           |   |y3
                           '-+-'
                             |
                             |
                          -------
                           -----
                             -
```
````

This is what it would look like when the above ascii image is rendered on this blog:

```render_svgbob
           |           +-----------+           |
           +-----------+           +-----------+
           |           +-----------+           |
     +-----+1               y12               2+------+
     |     |                                   |      |
     |     +-+                               +-+      |
   .-+-.   |  \                             /  |    .-+-.
   |   |       \                           /        |   |
   |   |y1    .-+-.                     .-+-.     y2|   |
   '-+-'       \   \ y13          y23  /   /        '-+-'
     |          \   \                 /   /           |
     |           '-+-'               '-+-'            |
  -------           \                 /            -------
    ---              +               +               ---
     -               |        3      |                -
                  ---+-------+-------+---
                             |
                           .-+-.
                           |   |
                           |   |y3
                           '-+-'
                             |
                             |
                          -------
                           -----
                             -
```
