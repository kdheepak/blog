title:mpld3 networkx d3.js force layout
date:Sun Oct  2 12:41:05 MDT 2016
tags:python
summary:Notes on mpld3 force layout
keywords:python
slug:mpld3-networkx-d3js-force-layout
category:blog
alias:/blog/mpld3-networkx-d3js-force-layout
JavaScripts: myvis.js, karateclub.js

[mpld3](http://mpld3.github.io/) is a matplotlib to d3 library.
It is lightweight and a pure Python / Javascript package, allowing a lot of the matplotlib interface to be accessible in the web.
There are a number of [examples](http://mpld3.github.io/examples/) on their website.
Its integration with d3 allows someone familiar with Javascript to use Python and visualize using the power of d3.
d3.js is a powerful low level visualization library and there are loads of examples online on the many features it brings to the table.

mpld3 also has the ability to add [plugins](http://mpld3.github.io/_downloads/custom_plugins.html) to add new functionality. I wanted to take a shot at adding a d3.js force layout plugin. The force layout is a powerful visualization tool and NetworkX has a nifty function that will convert the graph along with its attributes into a JSON graph format.
I'd played around with this before and figured this would be a nice feature to have, so I've worked on it over the weekend and here it is - a NetworkX to d3.js force layout plugin for mpld3. I've shared an example below.

```
%matplotlib inline
import numpy as np
import matplotlib.pyplot as plt
import mpld3
mpld3.enable_notebook()

from mpld3 import plugins

fig, ax = plt.subplots()

import networkx as nx
G=nx.Graph()
G.add_node(1, color='red', x=0.25, y=0.25, fixed=True, name='Node1')
G.add_node(2, x=0.75, y=0.75, fixed=True)
G.add_edge(1,2)
G.add_edge(1,3)
G.add_edge(2,3)

pos = None

plugins.connect(fig, NetworkXD3ForceLayout(G, pos, ax))
```

<div id="fig_el6303944499107368844826201"></div>

I've implemented a sticky version of the force layout, since this is what I wanted.
This can be turned off by passing an argument to the plugin.
The reason it is called a sticky version is because dragging a node to a new position will fix it at that location.
You can double click the node to release it.

I'll run through an explanation of the code briefly.

```
fig, ax = plt.subplots()
```

This returns a figure and axes object.
This plugin requires a single axes object to be passed to it.
The figure and axes object, and everything that is on the axes object is converted to mpld3 plot objects.
In theory, you could use NetworkX's draw function to visualize the graph and mpld3 will render it fine.
The only downside to that is that the final output will not be a force layout.

Next we create a graph with the following commands

```
import networkx as nx
G=nx.Graph()
G.add_node(1, color='red', x=0.25, y=0.25, fixed=True, name='Node1')
G.add_node(2, x=0.75, y=0.75, fixed=True)
G.add_edge(1,2)
G.add_edge(1,3)
G.add_edge(2,3)
```

I've set the `color` attribute of the first node to `red`.
This is an attribute on the node object and will be used by the force layout to color the node.
We can also set the `(x, y)` coordinates to values for the first and second node.
Passing the `fixed=True` keyword argument assigns a attribute `fixed` with the value `True` on the NetworkX graph.
When converted to a force layout, this will fix the positions of those nodes.

We are almost done! This registers the plugin with mpld3.

```
plugins.connect(fig, NetworkXD3ForceLayout(G, pos, ax))
```

The `pos` argument passed here is `None`. I plan to set it up such that you can pass a position dictionary to the plugin
and have the plugin assign `(x,y)` coordinates when available. You can generate the `pos` dictionary using any of NetworkX's layout functions.

Additional keywords arguments can be passed to the constructor of the `NetworkXD3ForceLayout` class.
This allows a user to control certain force layout properties like `gravity`, `linkDistance`, `linkStrength` etc.
You can also set a default node size or turn off the dragging feature.
The full list of attributes that can be passed is found in the docstring.
I plan to write a more detailed description in a following post.

Here is another example of a NetworkX graph converted to a force layout.
This is Zachary's Karate Club.
Nodes in `Mr Hi`'s club are coloured purple and the rest are coloured orange.
Node size is also changed based on the number of neighbours.

```
import matplotlib.pyplot as plt
import networkx as nx

fig, axs = plt.subplots(1, 1, figsize=(10, 10))
ax = axs

G=nx.karate_club_graph()
pos = None

for node, data in G.nodes(data=True):
    if data['club'] == 'Mr. Hi':
        data['color'] = 'purple'
    else:
        data['color'] = 'orange'

for n, data in G.nodes(data=True):
    data['size'] = len(G.neighbors(n))

mpld3.plugins.connect(fig,  NetworkXD3ForceLayout(G,
                                                  pos,
                                                  ax,
                                                  gravity=.5,
                                                  link_distance=20,
                                                  charge=-600,
                                                  friction=1
                                                 )
                     )
```

<div id="fig_el8173445058185128276242074"></div>
