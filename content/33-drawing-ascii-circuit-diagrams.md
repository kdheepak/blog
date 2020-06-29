---
title: Drawing in ASCII
category: blog
date: 2020-06-05T13:54:19-06:00
tags: ascii, blog
keywords: ascii, svgbob, pandoc, filter, lua, circuit, diagrams
summary: Drawing ascii diagrams and rendering them to svg using svgbob, pandoc and lua filters
---

Here is a simple 3-bus circuit diagram using text / ascii.

```ascii
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

We can define a lua filter that takes any code block that has the language defined as `render_svgbob`, and passes the text inside that code block to [svgbob](https://github.com/ivanceras/svgbob).

````
```render_svgbob
text here will be passed to svgbob
```
````

This is what it would look like when rendered on this blog:

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
