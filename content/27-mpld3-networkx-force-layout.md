title:mpld3 networkx d3.js force layout
date:Sun Oct  2 12:41:05 MDT 2016
tags:python
summary:Notes on mpld3 force layout
keywords:python
slug:mpld3-networkx-d3js-force-layout
category:blog
alias:/blog/mpld3-networkx-d3js-force-layout
JavaScripts: myvis.js

[mpld3](http://mpld3.github.io/) is a matplotlib to d3 library. There are a number of [examples](http://mpld3.github.io/examples/) on their website.
There is also the ability to add [plugins](http://mpld3.github.io/_downloads/custom_plugins.html) to add new iterative functionality. I wanted to take a shot at adding a d3.js force layout plugin. I've worked on it over the weekend and here it is, a networkx to d3js force layout plugin for mpld3. I've shared an example here below.

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

I've implemented a sticky version of the force layout, since this is what I wanted to have.
Dragging a node to a new position will fix it at that location.
You can double click the node to release it.

I'll run through the explanation briefly here.

```
fig, ax = plt.subplots()
```

This returns a figure and axes object. This plugin requires a single axes object to be passed to it.
This figure and axes, and everything that is on the axes object is converted to mpld3 plot objects.
You can use NetworkX's draw function, the only downside to that is that the final output will not be a force layout.

We can create a graph by the following commands

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

Additional keywords arguments can be passed to the constructor of the NetworkXD3ForceLayout class.
This allows a user to control some force layout properties like `gravity`, `linkDistance`, `linkStrength` etc.
You can also set the default node size or turn off the dragging feature.

I plan to write a more detailed description of everything I learnt in a following post.
