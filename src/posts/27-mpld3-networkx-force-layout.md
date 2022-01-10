---
title: mpld3 networkx d3.js force layout
date: 2016-10-02T12:41:05-06:00
tags: python
summary: Notes on mpld3 force layout
keywords: python, mpld3, networkx, d3.js
slug: mpld3-networkx-d3js-force-layout
category: blog
references:
- id: svg
  title: SVG Semantic Zooming
  URL: http://bl.ocks.org/mbostock/3680957
---

[mpld3](https://mpld3.github.io/) is a matplotlib to d3 library.
It is lightweight and a pure Python / Javascript package, allowing a lot of the matplotlib interface to be accessible in the web.
There are a number of [examples](https://mpld3.github.io/examples/) on their website.
Its integration with d3 allows someone familiar with Javascript to use Python and visualize using the power of d3.
d3.js is a powerful low level visualization library and there are loads of examples online on the many features it brings to the table.

mpld3 also has the ability to add [plugins](https://mpld3.github.io/_downloads/custom_plugins.html) to add new functionality. I wanted to take a shot at adding a d3.js force layout plugin. The force layout is a powerful visualization tool and NetworkX has a nifty function that will convert the graph along with its attributes into a JSON graph format.
I'd played around with this before and figured this would be a nice feature to have, so I've worked on it over the weekend and here it is - a NetworkX to d3.js force layout plugin for mpld3. I've shared an example below.

```python
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

These blocks were used as a reference[@svg].

I'll run through an explanation of the code briefly.

```python
fig, ax = plt.subplots()
```

This returns a figure and axes object.
This plugin requires a single axes object to be passed to it.
The figure and axes object, and everything that is on the axes object is converted to mpld3 plot objects.
In theory, you could use NetworkX's draw function to visualize the graph and mpld3 will render it fine.
The only downside to that is that the final output will not be a force layout.

Next we create a graph with the following commands

```python
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


```python
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

```python
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


<script>
function mpld3_load_lib(url, callback){
  var s = document.createElement('script');
  s.src = url;
  s.async = true;
  s.onreadystatechange = s.onload = callback;
  s.onerror = function(){console.warn("failed to load library " + url);};
  document.getElementsByTagName("head")[0].appendChild(s);
}

if(typeof(mpld3) !== "undefined" && mpld3._mpld3IsLoaded){
   // already loaded: just create the figure
   !function(mpld3){


    mpld3.register_plugin("networkxd3forcelayout", NetworkXD3ForceLayoutPlugin);
    NetworkXD3ForceLayoutPlugin.prototype = Object.create(mpld3.Plugin.prototype);
    NetworkXD3ForceLayoutPlugin.prototype.constructor = NetworkXD3ForceLayoutPlugin;
    NetworkXD3ForceLayoutPlugin.prototype.requiredProps = ["graph",
                                                                "ax_id",];
    NetworkXD3ForceLayoutPlugin.prototype.defaultProps = { coordinates: "data",
                                                               draggable: true,
                                                               gravity: 1,
                                                               charge: -30,
                                                               link_strength: 1,
                                                               friction: 0.9,
                                                               link_distance: 20,
                                                               maximum_stroke_width: 2,
                                                               minimum_stroke_width: 1,
                                                               nominal_stroke_width: 1,
                                                               maximum_radius: 10,
                                                               minimum_radius: 1,
                                                               nominal_radius: 5,
                                                            };

    function NetworkXD3ForceLayoutPlugin(fig, props){
        mpld3.Plugin.call(this, fig, props);
    };

    var color = d3.scale.category20();

    NetworkXD3ForceLayoutPlugin.prototype.zoomScaleProp = function (nominal_prop, minimum_prop, maximum_prop) {
        var zoom = this.ax.zoom;
        scalerFunction = function() {
            var prop = nominal_prop;
            if (nominal_prop*zoom.scale()>maximum_prop) prop = maximum_prop/zoom.scale();
            if (nominal_prop*zoom.scale()<minimum_prop) prop = minimum_prop/zoom.scale();
            return prop
        }
        return scalerFunction;
    }

    NetworkXD3ForceLayoutPlugin.prototype.setupDefaults = function () {

        this.zoomScaleStroke = this.zoomScaleProp(this.props.nominal_stroke_width,
                                                  this.props.minimum_stroke_width,
                                                  this.props.maximum_stroke_width)
        this.zoomScaleRadius = this.zoomScaleProp(this.props.nominal_radius,
                                                  this.props.minimum_radius,
                                                  this.props.maximum_radius)
    }

    NetworkXD3ForceLayoutPlugin.prototype.zoomed = function() {
            this.tick()
        }

    NetworkXD3ForceLayoutPlugin.prototype.draw = function(){

        plugin = this
        brush = this.fig.getBrush();

        DEFAULT_NODE_SIZE = this.props.nominal_radius;

        var height = this.fig.height
        var width = this.fig.width

        var graph = this.props.graph
        var gravity = this.props.gravity.toFixed()
        var charge = this.props.charge.toFixed()
        var link_distance = this.props.link_distance.toFixed()
        var link_strength = this.props.link_strength.toFixed()
        var friction = this.props.friction.toFixed()

        this.ax = mpld3.get_element(this.props.ax_id, this.fig)

        var ax = this.ax;

        this.ax.elements.push(this)

        ax_obj = this.ax;

        var width = d3.max(ax.x.range()) - d3.min(ax.x.range()),
            height = d3.max(ax.y.range()) - d3.min(ax.y.range());

        var color = d3.scale.category20();

        this.xScale = d3.scale.linear().domain([0, 1]).range([0, width]) // ax.x;
        this.yScale = d3.scale.linear().domain([0, 1]).range([height, 0]) // ax.y;

        this.force = d3.layout.force()
                            .size([width, height]);

        this.svg = this.ax.axes.append("g");

        for(var i = 0; i < graph.nodes.length; i++){
            var node = graph.nodes[i];
            if (node.hasOwnProperty('x')) {
                node.x = this.ax.x(node.x);
            }
            if (node.hasOwnProperty('y')) {
                node.y = this.ax.y(node.y);
            }
        }

        this.force
            .nodes(graph.nodes)
            .links(graph.links)
            .linkStrength(link_strength)
            .friction(friction)
            .linkDistance(link_distance)
            .charge(charge)
            .gravity(gravity)
            .start();

        this.link = this.svg.selectAll(".link")
            .data(graph.links)
          .enter().append("line")
            .attr("class", "link")
            .attr("stroke", "black")
            .style("stroke-width", function (d) { return Math.sqrt(d.value); });

        this.node = this.svg.selectAll(".node")
            .data(graph.nodes)
          .enter().append("circle")
            .attr("class", "node")
            .attr("r", function(d) {return d.size === undefined ? DEFAULT_NODE_SIZE : d.size ;})
            .style("fill", function (d) { return d.color; });

        this.node.append("title")
            .text(function (d) { return d.name; });

        this.force.on("tick", this.tick.bind(this));

        this.setupDefaults()
        this.conditional_features(this.svg);

    };

    NetworkXD3ForceLayoutPlugin.prototype.tick = function() {

        this.link.attr("x1", function (d) { return this.ax.x(this.xScale.invert(d.source.x)); }.bind(this))
                 .attr("y1", function (d) { return this.ax.y(this.yScale.invert(d.source.y)); }.bind(this))
                 .attr("x2", function (d) { return this.ax.x(this.xScale.invert(d.target.x)); }.bind(this))
                 .attr("y2", function (d) { return this.ax.y(this.yScale.invert(d.target.y)); }.bind(this));

        this.node.attr("transform", function (d) {
            return "translate(" + this.ax.x(this.xScale.invert(d.x)) + "," + this.ax.y(this.yScale.invert(d.y)) + ")";
            }.bind(this)
        );

    }

    NetworkXD3ForceLayoutPlugin.prototype.conditional_features = function(svg) {

        var drag = d3.behavior.drag()
                .on("dragstart", dragstarted)
                .on("drag", dragged.bind(this))
                .on("dragend", dragended);

        function dragstarted(d) {
            d3.event.sourceEvent.stopPropagation();
            d3.select(this).classed("fixed", d.fixed = true);
            d.fixed = true;
        }

        function dblclick(d) {
          self.force.resume();
          d3.select(this).classed("fixed", d.fixed = false);
        }

        function dragged(d) {
            var mouse = d3.mouse(svg.node());
            d.x = this.xScale(this.ax.x.invert(mouse[0]));
            d.y = this.yScale(this.ax.y.invert(mouse[1]));
            d.px = d.x;
            d.py = d.y;
            d.fixed = true;
            this.force.resume();
        }

        function dragended(d) {
            d.fixed = true;
            }

        var self = this;
        if (this.props.draggable === true) {
            this.node.on("dblclick", dblclick).call(drag)
        }

    }



       mpld3.draw_figure("fig_el8173445058185128276242074", {"axes": [{"xlim": [0.0, 1.0], "yscale": "linear", "axesbg": "#FFFFFF", "texts": [], "zoomable": true, "images": [], "xdomain": [0.0, 1.0], "ylim": [0.0, 1.0], "paths": [], "sharey": [], "sharex": [], "axesbgalpha": null, "axes": [{"scale": "linear", "tickformat": null, "grid": {"gridOn": false}, "fontsize": 10.0, "position": "bottom", "nticks": 6, "tickvalues": null}, {"scale": "linear", "tickformat": null, "grid": {"gridOn": false}, "fontsize": 10.0, "position": "left", "nticks": 6, "tickvalues": null}], "lines": [], "markers": [], "id": "el817344499264912", "ydomain": [0.0, 1.0], "collections": [], "xscale": "linear", "bbox": [0.125, 0.125, 0.77500000000000002, 0.77500000000000002]}], "height": 720.0, "width": 720.0, "plugins": [{"type": "reset"}, {"enabled": false, "button": true, "type": "zoom"}, {"enabled": false, "button": true, "type": "boxzoom"}, {"draggable": true, "charge": -600, "link_distance": 20, "link_strength": 1, "ax_id": "el817344499264912", "graph": {"directed": false, "graph": {"name": "Zachary's Karate Club"}, "nodes": [{"club": "Mr. Hi", "color": "purple", "id": 0, "size": 16}, {"club": "Mr. Hi", "color": "purple", "id": 1, "size": 9}, {"club": "Mr. Hi", "color": "purple", "id": 2, "size": 10}, {"club": "Mr. Hi", "color": "purple", "id": 3, "size": 6}, {"club": "Mr. Hi", "color": "purple", "id": 4, "size": 3}, {"club": "Mr. Hi", "color": "purple", "id": 5, "size": 4}, {"club": "Mr. Hi", "color": "purple", "id": 6, "size": 4}, {"club": "Mr. Hi", "color": "purple", "id": 7, "size": 4}, {"club": "Mr. Hi", "color": "purple", "id": 8, "size": 5}, {"club": "Officer", "color": "orange", "id": 9, "size": 2}, {"club": "Mr. Hi", "color": "purple", "id": 10, "size": 3}, {"club": "Mr. Hi", "color": "purple", "id": 11, "size": 1}, {"club": "Mr. Hi", "color": "purple", "id": 12, "size": 2}, {"club": "Mr. Hi", "color": "purple", "id": 13, "size": 5}, {"club": "Officer", "color": "orange", "id": 14, "size": 2}, {"club": "Officer", "color": "orange", "id": 15, "size": 2}, {"club": "Mr. Hi", "color": "purple", "id": 16, "size": 2}, {"club": "Mr. Hi", "color": "purple", "id": 17, "size": 2}, {"club": "Officer", "color": "orange", "id": 18, "size": 2}, {"club": "Mr. Hi", "color": "purple", "id": 19, "size": 3}, {"club": "Officer", "color": "orange", "id": 20, "size": 2}, {"club": "Mr. Hi", "color": "purple", "id": 21, "size": 2}, {"club": "Officer", "color": "orange", "id": 22, "size": 2}, {"club": "Officer", "color": "orange", "id": 23, "size": 5}, {"club": "Officer", "color": "orange", "id": 24, "size": 3}, {"club": "Officer", "color": "orange", "id": 25, "size": 3}, {"club": "Officer", "color": "orange", "id": 26, "size": 2}, {"club": "Officer", "color": "orange", "id": 27, "size": 4}, {"club": "Officer", "color": "orange", "id": 28, "size": 3}, {"club": "Officer", "color": "orange", "id": 29, "size": 4}, {"club": "Officer", "color": "orange", "id": 30, "size": 4}, {"club": "Officer", "color": "orange", "id": 31, "size": 6}, {"club": "Officer", "color": "orange", "id": 32, "size": 12}, {"club": "Officer", "color": "orange", "id": 33, "size": 17}], "links": [{"source": 0, "target": 1}, {"source": 0, "target": 2}, {"source": 0, "target": 3}, {"source": 0, "target": 4}, {"source": 0, "target": 5}, {"source": 0, "target": 6}, {"source": 0, "target": 7}, {"source": 0, "target": 8}, {"source": 0, "target": 10}, {"source": 0, "target": 11}, {"source": 0, "target": 12}, {"source": 0, "target": 13}, {"source": 0, "target": 17}, {"source": 0, "target": 19}, {"source": 0, "target": 21}, {"source": 0, "target": 31}, {"source": 1, "target": 2}, {"source": 1, "target": 3}, {"source": 1, "target": 7}, {"source": 1, "target": 13}, {"source": 1, "target": 17}, {"source": 1, "target": 19}, {"source": 1, "target": 21}, {"source": 1, "target": 30}, {"source": 2, "target": 3}, {"source": 2, "target": 32}, {"source": 2, "target": 7}, {"source": 2, "target": 8}, {"source": 2, "target": 9}, {"source": 2, "target": 13}, {"source": 2, "target": 27}, {"source": 2, "target": 28}, {"source": 3, "target": 7}, {"source": 3, "target": 12}, {"source": 3, "target": 13}, {"source": 4, "target": 10}, {"source": 4, "target": 6}, {"source": 5, "target": 16}, {"source": 5, "target": 10}, {"source": 5, "target": 6}, {"source": 6, "target": 16}, {"source": 8, "target": 32}, {"source": 8, "target": 30}, {"source": 8, "target": 33}, {"source": 9, "target": 33}, {"source": 13, "target": 33}, {"source": 14, "target": 32}, {"source": 14, "target": 33}, {"source": 15, "target": 32}, {"source": 15, "target": 33}, {"source": 18, "target": 32}, {"source": 18, "target": 33}, {"source": 19, "target": 33}, {"source": 20, "target": 32}, {"source": 20, "target": 33}, {"source": 22, "target": 32}, {"source": 22, "target": 33}, {"source": 23, "target": 32}, {"source": 23, "target": 25}, {"source": 23, "target": 27}, {"source": 23, "target": 29}, {"source": 23, "target": 33}, {"source": 24, "target": 25}, {"source": 24, "target": 27}, {"source": 24, "target": 31}, {"source": 25, "target": 31}, {"source": 26, "target": 33}, {"source": 26, "target": 29}, {"source": 27, "target": 33}, {"source": 28, "target": 33}, {"source": 28, "target": 31}, {"source": 29, "target": 32}, {"source": 29, "target": 33}, {"source": 30, "target": 33}, {"source": 30, "target": 32}, {"source": 31, "target": 33}, {"source": 31, "target": 32}, {"source": 32, "target": 33}], "multigraph": false}, "nominal_radius": 5, "type": "networkxd3forcelayout", "gravity": 0.5, "friction": 1}], "data": {}, "id": "el817344505818512"});
   }(mpld3);
}else if(typeof define === "function" && define.amd){
   // require.js is available: use it to load d3/mpld3
   require.config({paths: {d3: "https://mpld3.github.io/js/d3.v3.min"}});
   require(["d3"], function(d3){
      window.d3 = d3;
      mpld3_load_lib("https://mpld3.github.io/js/mpld3.v0.2.js", function(){


    mpld3.register_plugin("networkxd3forcelayout", NetworkXD3ForceLayoutPlugin);
    NetworkXD3ForceLayoutPlugin.prototype = Object.create(mpld3.Plugin.prototype);
    NetworkXD3ForceLayoutPlugin.prototype.constructor = NetworkXD3ForceLayoutPlugin;
    NetworkXD3ForceLayoutPlugin.prototype.requiredProps = ["graph",
                                                                "ax_id",];
    NetworkXD3ForceLayoutPlugin.prototype.defaultProps = { coordinates: "data",
                                                               draggable: true,
                                                               gravity: 1,
                                                               charge: -30,
                                                               link_strength: 1,
                                                               friction: 0.9,
                                                               link_distance: 20,
                                                               maximum_stroke_width: 2,
                                                               minimum_stroke_width: 1,
                                                               nominal_stroke_width: 1,
                                                               maximum_radius: 10,
                                                               minimum_radius: 1,
                                                               nominal_radius: 5,
                                                            };

    function NetworkXD3ForceLayoutPlugin(fig, props){
        mpld3.Plugin.call(this, fig, props);
    };

    var color = d3.scale.category20();

    NetworkXD3ForceLayoutPlugin.prototype.zoomScaleProp = function (nominal_prop, minimum_prop, maximum_prop) {
        var zoom = this.ax.zoom;
        scalerFunction = function() {
            var prop = nominal_prop;
            if (nominal_prop*zoom.scale()>maximum_prop) prop = maximum_prop/zoom.scale();
            if (nominal_prop*zoom.scale()<minimum_prop) prop = minimum_prop/zoom.scale();
            return prop
        }
        return scalerFunction;
    }

    NetworkXD3ForceLayoutPlugin.prototype.setupDefaults = function () {

        this.zoomScaleStroke = this.zoomScaleProp(this.props.nominal_stroke_width,
                                                  this.props.minimum_stroke_width,
                                                  this.props.maximum_stroke_width)
        this.zoomScaleRadius = this.zoomScaleProp(this.props.nominal_radius,
                                                  this.props.minimum_radius,
                                                  this.props.maximum_radius)
    }

    NetworkXD3ForceLayoutPlugin.prototype.zoomed = function() {
            this.tick()
        }

    NetworkXD3ForceLayoutPlugin.prototype.draw = function(){

        plugin = this
        brush = this.fig.getBrush();

        DEFAULT_NODE_SIZE = this.props.nominal_radius;

        var height = this.fig.height
        var width = this.fig.width

        var graph = this.props.graph
        var gravity = this.props.gravity.toFixed()
        var charge = this.props.charge.toFixed()
        var link_distance = this.props.link_distance.toFixed()
        var link_strength = this.props.link_strength.toFixed()
        var friction = this.props.friction.toFixed()

        this.ax = mpld3.get_element(this.props.ax_id, this.fig)

        var ax = this.ax;

        this.ax.elements.push(this)

        ax_obj = this.ax;

        var width = d3.max(ax.x.range()) - d3.min(ax.x.range()),
            height = d3.max(ax.y.range()) - d3.min(ax.y.range());

        var color = d3.scale.category20();

        this.xScale = d3.scale.linear().domain([0, 1]).range([0, width]) // ax.x;
        this.yScale = d3.scale.linear().domain([0, 1]).range([height, 0]) // ax.y;

        this.force = d3.layout.force()
                            .size([width, height]);

        this.svg = this.ax.axes.append("g");

        for(var i = 0; i < graph.nodes.length; i++){
            var node = graph.nodes[i];
            if (node.hasOwnProperty('x')) {
                node.x = this.ax.x(node.x);
            }
            if (node.hasOwnProperty('y')) {
                node.y = this.ax.y(node.y);
            }
        }

        this.force
            .nodes(graph.nodes)
            .links(graph.links)
            .linkStrength(link_strength)
            .friction(friction)
            .linkDistance(link_distance)
            .charge(charge)
            .gravity(gravity)
            .start();

        this.link = this.svg.selectAll(".link")
            .data(graph.links)
          .enter().append("line")
            .attr("class", "link")
            .attr("stroke", "black")
            .style("stroke-width", function (d) { return Math.sqrt(d.value); });

        this.node = this.svg.selectAll(".node")
            .data(graph.nodes)
          .enter().append("circle")
            .attr("class", "node")
            .attr("r", function(d) {return d.size === undefined ? DEFAULT_NODE_SIZE : d.size ;})
            .style("fill", function (d) { return d.color; });

        this.node.append("title")
            .text(function (d) { return d.name; });

        this.force.on("tick", this.tick.bind(this));

        this.setupDefaults()
        this.conditional_features(this.svg);

    };

    NetworkXD3ForceLayoutPlugin.prototype.tick = function() {

        this.link.attr("x1", function (d) { return this.ax.x(this.xScale.invert(d.source.x)); }.bind(this))
                 .attr("y1", function (d) { return this.ax.y(this.yScale.invert(d.source.y)); }.bind(this))
                 .attr("x2", function (d) { return this.ax.x(this.xScale.invert(d.target.x)); }.bind(this))
                 .attr("y2", function (d) { return this.ax.y(this.yScale.invert(d.target.y)); }.bind(this));

        this.node.attr("transform", function (d) {
            return "translate(" + this.ax.x(this.xScale.invert(d.x)) + "," + this.ax.y(this.yScale.invert(d.y)) + ")";
            }.bind(this)
        );

    }

    NetworkXD3ForceLayoutPlugin.prototype.conditional_features = function(svg) {

        var drag = d3.behavior.drag()
                .on("dragstart", dragstarted)
                .on("drag", dragged.bind(this))
                .on("dragend", dragended);

        function dragstarted(d) {
            d3.event.sourceEvent.stopPropagation();
            d3.select(this).classed("fixed", d.fixed = true);
            d.fixed = true;
        }

        function dblclick(d) {
          self.force.resume();
          d3.select(this).classed("fixed", d.fixed = false);
        }

        function dragged(d) {
            var mouse = d3.mouse(svg.node());
            d.x = this.xScale(this.ax.x.invert(mouse[0]));
            d.y = this.yScale(this.ax.y.invert(mouse[1]));
            d.px = d.x;
            d.py = d.y;
            d.fixed = true;
            this.force.resume();
        }

        function dragended(d) {
            d.fixed = true;
            }

        var self = this;
        if (this.props.draggable === true) {
            this.node.on("dblclick", dblclick).call(drag)
        }

    }



         mpld3.draw_figure("fig_el8173445058185128276242074", {"axes": [{"xlim": [0.0, 1.0], "yscale": "linear", "axesbg": "#FFFFFF", "texts": [], "zoomable": true, "images": [], "xdomain": [0.0, 1.0], "ylim": [0.0, 1.0], "paths": [], "sharey": [], "sharex": [], "axesbgalpha": null, "axes": [{"scale": "linear", "tickformat": null, "grid": {"gridOn": false}, "fontsize": 10.0, "position": "bottom", "nticks": 6, "tickvalues": null}, {"scale": "linear", "tickformat": null, "grid": {"gridOn": false}, "fontsize": 10.0, "position": "left", "nticks": 6, "tickvalues": null}], "lines": [], "markers": [], "id": "el817344499264912", "ydomain": [0.0, 1.0], "collections": [], "xscale": "linear", "bbox": [0.125, 0.125, 0.77500000000000002, 0.77500000000000002]}], "height": 720.0, "width": 720.0, "plugins": [{"type": "reset"}, {"enabled": false, "button": true, "type": "zoom"}, {"enabled": false, "button": true, "type": "boxzoom"}, {"draggable": true, "charge": -600, "link_distance": 20, "link_strength": 1, "ax_id": "el817344499264912", "graph": {"directed": false, "graph": {"name": "Zachary's Karate Club"}, "nodes": [{"club": "Mr. Hi", "color": "purple", "id": 0, "size": 16}, {"club": "Mr. Hi", "color": "purple", "id": 1, "size": 9}, {"club": "Mr. Hi", "color": "purple", "id": 2, "size": 10}, {"club": "Mr. Hi", "color": "purple", "id": 3, "size": 6}, {"club": "Mr. Hi", "color": "purple", "id": 4, "size": 3}, {"club": "Mr. Hi", "color": "purple", "id": 5, "size": 4}, {"club": "Mr. Hi", "color": "purple", "id": 6, "size": 4}, {"club": "Mr. Hi", "color": "purple", "id": 7, "size": 4}, {"club": "Mr. Hi", "color": "purple", "id": 8, "size": 5}, {"club": "Officer", "color": "orange", "id": 9, "size": 2}, {"club": "Mr. Hi", "color": "purple", "id": 10, "size": 3}, {"club": "Mr. Hi", "color": "purple", "id": 11, "size": 1}, {"club": "Mr. Hi", "color": "purple", "id": 12, "size": 2}, {"club": "Mr. Hi", "color": "purple", "id": 13, "size": 5}, {"club": "Officer", "color": "orange", "id": 14, "size": 2}, {"club": "Officer", "color": "orange", "id": 15, "size": 2}, {"club": "Mr. Hi", "color": "purple", "id": 16, "size": 2}, {"club": "Mr. Hi", "color": "purple", "id": 17, "size": 2}, {"club": "Officer", "color": "orange", "id": 18, "size": 2}, {"club": "Mr. Hi", "color": "purple", "id": 19, "size": 3}, {"club": "Officer", "color": "orange", "id": 20, "size": 2}, {"club": "Mr. Hi", "color": "purple", "id": 21, "size": 2}, {"club": "Officer", "color": "orange", "id": 22, "size": 2}, {"club": "Officer", "color": "orange", "id": 23, "size": 5}, {"club": "Officer", "color": "orange", "id": 24, "size": 3}, {"club": "Officer", "color": "orange", "id": 25, "size": 3}, {"club": "Officer", "color": "orange", "id": 26, "size": 2}, {"club": "Officer", "color": "orange", "id": 27, "size": 4}, {"club": "Officer", "color": "orange", "id": 28, "size": 3}, {"club": "Officer", "color": "orange", "id": 29, "size": 4}, {"club": "Officer", "color": "orange", "id": 30, "size": 4}, {"club": "Officer", "color": "orange", "id": 31, "size": 6}, {"club": "Officer", "color": "orange", "id": 32, "size": 12}, {"club": "Officer", "color": "orange", "id": 33, "size": 17}], "links": [{"source": 0, "target": 1}, {"source": 0, "target": 2}, {"source": 0, "target": 3}, {"source": 0, "target": 4}, {"source": 0, "target": 5}, {"source": 0, "target": 6}, {"source": 0, "target": 7}, {"source": 0, "target": 8}, {"source": 0, "target": 10}, {"source": 0, "target": 11}, {"source": 0, "target": 12}, {"source": 0, "target": 13}, {"source": 0, "target": 17}, {"source": 0, "target": 19}, {"source": 0, "target": 21}, {"source": 0, "target": 31}, {"source": 1, "target": 2}, {"source": 1, "target": 3}, {"source": 1, "target": 7}, {"source": 1, "target": 13}, {"source": 1, "target": 17}, {"source": 1, "target": 19}, {"source": 1, "target": 21}, {"source": 1, "target": 30}, {"source": 2, "target": 3}, {"source": 2, "target": 32}, {"source": 2, "target": 7}, {"source": 2, "target": 8}, {"source": 2, "target": 9}, {"source": 2, "target": 13}, {"source": 2, "target": 27}, {"source": 2, "target": 28}, {"source": 3, "target": 7}, {"source": 3, "target": 12}, {"source": 3, "target": 13}, {"source": 4, "target": 10}, {"source": 4, "target": 6}, {"source": 5, "target": 16}, {"source": 5, "target": 10}, {"source": 5, "target": 6}, {"source": 6, "target": 16}, {"source": 8, "target": 32}, {"source": 8, "target": 30}, {"source": 8, "target": 33}, {"source": 9, "target": 33}, {"source": 13, "target": 33}, {"source": 14, "target": 32}, {"source": 14, "target": 33}, {"source": 15, "target": 32}, {"source": 15, "target": 33}, {"source": 18, "target": 32}, {"source": 18, "target": 33}, {"source": 19, "target": 33}, {"source": 20, "target": 32}, {"source": 20, "target": 33}, {"source": 22, "target": 32}, {"source": 22, "target": 33}, {"source": 23, "target": 32}, {"source": 23, "target": 25}, {"source": 23, "target": 27}, {"source": 23, "target": 29}, {"source": 23, "target": 33}, {"source": 24, "target": 25}, {"source": 24, "target": 27}, {"source": 24, "target": 31}, {"source": 25, "target": 31}, {"source": 26, "target": 33}, {"source": 26, "target": 29}, {"source": 27, "target": 33}, {"source": 28, "target": 33}, {"source": 28, "target": 31}, {"source": 29, "target": 32}, {"source": 29, "target": 33}, {"source": 30, "target": 33}, {"source": 30, "target": 32}, {"source": 31, "target": 33}, {"source": 31, "target": 32}, {"source": 32, "target": 33}], "multigraph": false}, "nominal_radius": 5, "type": "networkxd3forcelayout", "gravity": 0.5, "friction": 1}], "data": {}, "id": "el817344505818512"});
      });
    });
}else{
    // require.js not available: dynamically load d3 & mpld3
    mpld3_load_lib("https://mpld3.github.io/js/d3.v3.min.js", function(){
         mpld3_load_lib("https://mpld3.github.io/js/mpld3.v0.2.js", function(){


    mpld3.register_plugin("networkxd3forcelayout", NetworkXD3ForceLayoutPlugin);
    NetworkXD3ForceLayoutPlugin.prototype = Object.create(mpld3.Plugin.prototype);
    NetworkXD3ForceLayoutPlugin.prototype.constructor = NetworkXD3ForceLayoutPlugin;
    NetworkXD3ForceLayoutPlugin.prototype.requiredProps = ["graph",
                                                                "ax_id",];
    NetworkXD3ForceLayoutPlugin.prototype.defaultProps = { coordinates: "data",
                                                               draggable: true,
                                                               gravity: 1,
                                                               charge: -30,
                                                               link_strength: 1,
                                                               friction: 0.9,
                                                               link_distance: 20,
                                                               maximum_stroke_width: 2,
                                                               minimum_stroke_width: 1,
                                                               nominal_stroke_width: 1,
                                                               maximum_radius: 10,
                                                               minimum_radius: 1,
                                                               nominal_radius: 5,
                                                            };

    function NetworkXD3ForceLayoutPlugin(fig, props){
        mpld3.Plugin.call(this, fig, props);
    };

    var color = d3.scale.category20();

    NetworkXD3ForceLayoutPlugin.prototype.zoomScaleProp = function (nominal_prop, minimum_prop, maximum_prop) {
        var zoom = this.ax.zoom;
        scalerFunction = function() {
            var prop = nominal_prop;
            if (nominal_prop*zoom.scale()>maximum_prop) prop = maximum_prop/zoom.scale();
            if (nominal_prop*zoom.scale()<minimum_prop) prop = minimum_prop/zoom.scale();
            return prop
        }
        return scalerFunction;
    }

    NetworkXD3ForceLayoutPlugin.prototype.setupDefaults = function () {

        this.zoomScaleStroke = this.zoomScaleProp(this.props.nominal_stroke_width,
                                                  this.props.minimum_stroke_width,
                                                  this.props.maximum_stroke_width)
        this.zoomScaleRadius = this.zoomScaleProp(this.props.nominal_radius,
                                                  this.props.minimum_radius,
                                                  this.props.maximum_radius)
    }

    NetworkXD3ForceLayoutPlugin.prototype.zoomed = function() {
            this.tick()
        }

    NetworkXD3ForceLayoutPlugin.prototype.draw = function(){

        plugin = this
        brush = this.fig.getBrush();

        DEFAULT_NODE_SIZE = this.props.nominal_radius;

        var height = this.fig.height
        var width = this.fig.width

        var graph = this.props.graph
        var gravity = this.props.gravity.toFixed()
        var charge = this.props.charge.toFixed()
        var link_distance = this.props.link_distance.toFixed()
        var link_strength = this.props.link_strength.toFixed()
        var friction = this.props.friction.toFixed()

        this.ax = mpld3.get_element(this.props.ax_id, this.fig)

        var ax = this.ax;

        this.ax.elements.push(this)

        ax_obj = this.ax;

        var width = d3.max(ax.x.range()) - d3.min(ax.x.range()),
            height = d3.max(ax.y.range()) - d3.min(ax.y.range());

        var color = d3.scale.category20();

        this.xScale = d3.scale.linear().domain([0, 1]).range([0, width]) // ax.x;
        this.yScale = d3.scale.linear().domain([0, 1]).range([height, 0]) // ax.y;

        this.force = d3.layout.force()
                            .size([width, height]);

        this.svg = this.ax.axes.append("g");

        for(var i = 0; i < graph.nodes.length; i++){
            var node = graph.nodes[i];
            if (node.hasOwnProperty('x')) {
                node.x = this.ax.x(node.x);
            }
            if (node.hasOwnProperty('y')) {
                node.y = this.ax.y(node.y);
            }
        }

        this.force
            .nodes(graph.nodes)
            .links(graph.links)
            .linkStrength(link_strength)
            .friction(friction)
            .linkDistance(link_distance)
            .charge(charge)
            .gravity(gravity)
            .start();

        this.link = this.svg.selectAll(".link")
            .data(graph.links)
          .enter().append("line")
            .attr("class", "link")
            .attr("stroke", "black")
            .style("stroke-width", function (d) { return Math.sqrt(d.value); });

        this.node = this.svg.selectAll(".node")
            .data(graph.nodes)
          .enter().append("circle")
            .attr("class", "node")
            .attr("r", function(d) {return d.size === undefined ? DEFAULT_NODE_SIZE : d.size ;})
            .style("fill", function (d) { return d.color; });

        this.node.append("title")
            .text(function (d) { return d.name; });

        this.force.on("tick", this.tick.bind(this));

        this.setupDefaults()
        this.conditional_features(this.svg);

    };

    NetworkXD3ForceLayoutPlugin.prototype.tick = function() {

        this.link.attr("x1", function (d) { return this.ax.x(this.xScale.invert(d.source.x)); }.bind(this))
                 .attr("y1", function (d) { return this.ax.y(this.yScale.invert(d.source.y)); }.bind(this))
                 .attr("x2", function (d) { return this.ax.x(this.xScale.invert(d.target.x)); }.bind(this))
                 .attr("y2", function (d) { return this.ax.y(this.yScale.invert(d.target.y)); }.bind(this));

        this.node.attr("transform", function (d) {
            return "translate(" + this.ax.x(this.xScale.invert(d.x)) + "," + this.ax.y(this.yScale.invert(d.y)) + ")";
            }.bind(this)
        );

    }

    NetworkXD3ForceLayoutPlugin.prototype.conditional_features = function(svg) {

        var drag = d3.behavior.drag()
                .on("dragstart", dragstarted)
                .on("drag", dragged.bind(this))
                .on("dragend", dragended);

        function dragstarted(d) {
            d3.event.sourceEvent.stopPropagation();
            d3.select(this).classed("fixed", d.fixed = true);
            d.fixed = true;
        }

        function dblclick(d) {
          self.force.resume();
          d3.select(this).classed("fixed", d.fixed = false);
        }

        function dragged(d) {
            var mouse = d3.mouse(svg.node());
            d.x = this.xScale(this.ax.x.invert(mouse[0]));
            d.y = this.yScale(this.ax.y.invert(mouse[1]));
            d.px = d.x;
            d.py = d.y;
            d.fixed = true;
            this.force.resume();
        }

        function dragended(d) {
            d.fixed = true;
            }

        var self = this;
        if (this.props.draggable === true) {
            this.node.on("dblclick", dblclick).call(drag)
        }

    }



                 mpld3.draw_figure("fig_el8173445058185128276242074", {"axes": [{"xlim": [0.0, 1.0], "yscale": "linear", "axesbg": "#FFFFFF", "texts": [], "zoomable": true, "images": [], "xdomain": [0.0, 1.0], "ylim": [0.0, 1.0], "paths": [], "sharey": [], "sharex": [], "axesbgalpha": null, "axes": [{"scale": "linear", "tickformat": null, "grid": {"gridOn": false}, "fontsize": 10.0, "position": "bottom", "nticks": 6, "tickvalues": null}, {"scale": "linear", "tickformat": null, "grid": {"gridOn": false}, "fontsize": 10.0, "position": "left", "nticks": 6, "tickvalues": null}], "lines": [], "markers": [], "id": "el817344499264912", "ydomain": [0.0, 1.0], "collections": [], "xscale": "linear", "bbox": [0.125, 0.125, 0.77500000000000002, 0.77500000000000002]}], "height": 720.0, "width": 720.0, "plugins": [{"type": "reset"}, {"enabled": false, "button": true, "type": "zoom"}, {"enabled": false, "button": true, "type": "boxzoom"}, {"draggable": true, "charge": -600, "link_distance": 20, "link_strength": 1, "ax_id": "el817344499264912", "graph": {"directed": false, "graph": {"name": "Zachary's Karate Club"}, "nodes": [{"club": "Mr. Hi", "color": "purple", "id": 0, "size": 16}, {"club": "Mr. Hi", "color": "purple", "id": 1, "size": 9}, {"club": "Mr. Hi", "color": "purple", "id": 2, "size": 10}, {"club": "Mr. Hi", "color": "purple", "id": 3, "size": 6}, {"club": "Mr. Hi", "color": "purple", "id": 4, "size": 3}, {"club": "Mr. Hi", "color": "purple", "id": 5, "size": 4}, {"club": "Mr. Hi", "color": "purple", "id": 6, "size": 4}, {"club": "Mr. Hi", "color": "purple", "id": 7, "size": 4}, {"club": "Mr. Hi", "color": "purple", "id": 8, "size": 5}, {"club": "Officer", "color": "orange", "id": 9, "size": 2}, {"club": "Mr. Hi", "color": "purple", "id": 10, "size": 3}, {"club": "Mr. Hi", "color": "purple", "id": 11, "size": 1}, {"club": "Mr. Hi", "color": "purple", "id": 12, "size": 2}, {"club": "Mr. Hi", "color": "purple", "id": 13, "size": 5}, {"club": "Officer", "color": "orange", "id": 14, "size": 2}, {"club": "Officer", "color": "orange", "id": 15, "size": 2}, {"club": "Mr. Hi", "color": "purple", "id": 16, "size": 2}, {"club": "Mr. Hi", "color": "purple", "id": 17, "size": 2}, {"club": "Officer", "color": "orange", "id": 18, "size": 2}, {"club": "Mr. Hi", "color": "purple", "id": 19, "size": 3}, {"club": "Officer", "color": "orange", "id": 20, "size": 2}, {"club": "Mr. Hi", "color": "purple", "id": 21, "size": 2}, {"club": "Officer", "color": "orange", "id": 22, "size": 2}, {"club": "Officer", "color": "orange", "id": 23, "size": 5}, {"club": "Officer", "color": "orange", "id": 24, "size": 3}, {"club": "Officer", "color": "orange", "id": 25, "size": 3}, {"club": "Officer", "color": "orange", "id": 26, "size": 2}, {"club": "Officer", "color": "orange", "id": 27, "size": 4}, {"club": "Officer", "color": "orange", "id": 28, "size": 3}, {"club": "Officer", "color": "orange", "id": 29, "size": 4}, {"club": "Officer", "color": "orange", "id": 30, "size": 4}, {"club": "Officer", "color": "orange", "id": 31, "size": 6}, {"club": "Officer", "color": "orange", "id": 32, "size": 12}, {"club": "Officer", "color": "orange", "id": 33, "size": 17}], "links": [{"source": 0, "target": 1}, {"source": 0, "target": 2}, {"source": 0, "target": 3}, {"source": 0, "target": 4}, {"source": 0, "target": 5}, {"source": 0, "target": 6}, {"source": 0, "target": 7}, {"source": 0, "target": 8}, {"source": 0, "target": 10}, {"source": 0, "target": 11}, {"source": 0, "target": 12}, {"source": 0, "target": 13}, {"source": 0, "target": 17}, {"source": 0, "target": 19}, {"source": 0, "target": 21}, {"source": 0, "target": 31}, {"source": 1, "target": 2}, {"source": 1, "target": 3}, {"source": 1, "target": 7}, {"source": 1, "target": 13}, {"source": 1, "target": 17}, {"source": 1, "target": 19}, {"source": 1, "target": 21}, {"source": 1, "target": 30}, {"source": 2, "target": 3}, {"source": 2, "target": 32}, {"source": 2, "target": 7}, {"source": 2, "target": 8}, {"source": 2, "target": 9}, {"source": 2, "target": 13}, {"source": 2, "target": 27}, {"source": 2, "target": 28}, {"source": 3, "target": 7}, {"source": 3, "target": 12}, {"source": 3, "target": 13}, {"source": 4, "target": 10}, {"source": 4, "target": 6}, {"source": 5, "target": 16}, {"source": 5, "target": 10}, {"source": 5, "target": 6}, {"source": 6, "target": 16}, {"source": 8, "target": 32}, {"source": 8, "target": 30}, {"source": 8, "target": 33}, {"source": 9, "target": 33}, {"source": 13, "target": 33}, {"source": 14, "target": 32}, {"source": 14, "target": 33}, {"source": 15, "target": 32}, {"source": 15, "target": 33}, {"source": 18, "target": 32}, {"source": 18, "target": 33}, {"source": 19, "target": 33}, {"source": 20, "target": 32}, {"source": 20, "target": 33}, {"source": 22, "target": 32}, {"source": 22, "target": 33}, {"source": 23, "target": 32}, {"source": 23, "target": 25}, {"source": 23, "target": 27}, {"source": 23, "target": 29}, {"source": 23, "target": 33}, {"source": 24, "target": 25}, {"source": 24, "target": 27}, {"source": 24, "target": 31}, {"source": 25, "target": 31}, {"source": 26, "target": 33}, {"source": 26, "target": 29}, {"source": 27, "target": 33}, {"source": 28, "target": 33}, {"source": 28, "target": 31}, {"source": 29, "target": 32}, {"source": 29, "target": 33}, {"source": 30, "target": 33}, {"source": 30, "target": 32}, {"source": 31, "target": 33}, {"source": 31, "target": 32}, {"source": 32, "target": 33}], "multigraph": false}, "nominal_radius": 5, "type": "networkxd3forcelayout", "gravity": 0.5, "friction": 1}], "data": {}, "id": "el817344505818512"});
            })
         });
}


</script>


<script>
function mpld3_load_lib(url, callback){
  var s = document.createElement('script');
  s.src = url;
  s.async = true;
  s.onreadystatechange = s.onload = callback;
  s.onerror = function(){console.warn("failed to load library " + url);};
  document.getElementsByTagName("head")[0].appendChild(s);
}

if(typeof(mpld3) !== "undefined" && mpld3._mpld3IsLoaded){
   // already loaded: just create the figure
   !function(mpld3){


    mpld3.register_plugin("networkxd3forcelayout", NetworkXD3ForceLayoutPlugin);
    NetworkXD3ForceLayoutPlugin.prototype = Object.create(mpld3.Plugin.prototype);
    NetworkXD3ForceLayoutPlugin.prototype.constructor = NetworkXD3ForceLayoutPlugin;
    NetworkXD3ForceLayoutPlugin.prototype.requiredProps = ["graph",
                                                                "ax_id",];
    NetworkXD3ForceLayoutPlugin.prototype.defaultProps = { coordinates: "data",
                                                               draggable: true,
                                                               gravity: 1,
                                                               charge: -30,
                                                               link_strength: 1,
                                                               friction: 0.9,
                                                               link_distance: 20,
                                                               maximum_stroke_width: 2,
                                                               minimum_stroke_width: 1,
                                                               nominal_stroke_width: 1,
                                                               maximum_radius: 10,
                                                               minimum_radius: 1,
                                                               nominal_radius: 5,
                                                            };

    function NetworkXD3ForceLayoutPlugin(fig, props){
        mpld3.Plugin.call(this, fig, props);
    };

    var color = d3.scale.category20();

    NetworkXD3ForceLayoutPlugin.prototype.zoomScaleProp = function (nominal_prop, minimum_prop, maximum_prop) {
        var zoom = this.ax.zoom;
        scalerFunction = function() {
            var prop = nominal_prop;
            if (nominal_prop*zoom.scale()>maximum_prop) prop = maximum_prop/zoom.scale();
            if (nominal_prop*zoom.scale()<minimum_prop) prop = minimum_prop/zoom.scale();
            return prop
        }
        return scalerFunction;
    }

    NetworkXD3ForceLayoutPlugin.prototype.setupDefaults = function () {

        this.zoomScaleStroke = this.zoomScaleProp(this.props.nominal_stroke_width,
                                                  this.props.minimum_stroke_width,
                                                  this.props.maximum_stroke_width)
        this.zoomScaleRadius = this.zoomScaleProp(this.props.nominal_radius,
                                                  this.props.minimum_radius,
                                                  this.props.maximum_radius)
    }

    NetworkXD3ForceLayoutPlugin.prototype.zoomed = function() {
            this.tick()
        }

    NetworkXD3ForceLayoutPlugin.prototype.draw = function(){

        plugin = this
        brush = this.fig.getBrush();

        DEFAULT_NODE_SIZE = this.props.nominal_radius;

        var height = this.fig.height
        var width = this.fig.width

        var graph = this.props.graph
        var gravity = this.props.gravity.toFixed()
        var charge = this.props.charge.toFixed()
        var link_distance = this.props.link_distance.toFixed()
        var link_strength = this.props.link_strength.toFixed()
        var friction = this.props.friction.toFixed()

        this.ax = mpld3.get_element(this.props.ax_id, this.fig)

        var ax = this.ax;

        this.ax.elements.push(this)

        ax_obj = this.ax;

        var width = d3.max(ax.x.range()) - d3.min(ax.x.range()),
            height = d3.max(ax.y.range()) - d3.min(ax.y.range());

        var color = d3.scale.category20();

        this.xScale = d3.scale.linear().domain([0, 1]).range([0, width]) // ax.x;
        this.yScale = d3.scale.linear().domain([0, 1]).range([height, 0]) // ax.y;

        this.force = d3.layout.force()
                            .size([width, height]);

        this.svg = this.ax.axes.append("g");

        for(var i = 0; i < graph.nodes.length; i++){
            var node = graph.nodes[i];
            if (node.hasOwnProperty('x')) {
                node.x = this.ax.x(node.x);
            }
            if (node.hasOwnProperty('y')) {
                node.y = this.ax.y(node.y);
            }
        }

        this.force
            .nodes(graph.nodes)
            .links(graph.links)
            .linkStrength(link_strength)
            .friction(friction)
            .linkDistance(link_distance)
            .charge(charge)
            .gravity(gravity)
            .start();

        this.link = this.svg.selectAll(".link")
            .data(graph.links)
          .enter().append("line")
            .attr("class", "link")
            .attr("stroke", "black")
            .style("stroke-width", function (d) { return Math.sqrt(d.value); });

        this.node = this.svg.selectAll(".node")
            .data(graph.nodes)
          .enter().append("circle")
            .attr("class", "node")
            .attr("r", function(d) {return d.size === undefined ? DEFAULT_NODE_SIZE : d.size ;})
            .style("fill", function (d) { return d.color; });

        this.node.append("title")
            .text(function (d) { return d.name; });

        this.force.on("tick", this.tick.bind(this));

        this.setupDefaults()
        this.conditional_features(this.svg);

    };

    NetworkXD3ForceLayoutPlugin.prototype.tick = function() {

        this.link.attr("x1", function (d) { return this.ax.x(this.xScale.invert(d.source.x)); }.bind(this))
                 .attr("y1", function (d) { return this.ax.y(this.yScale.invert(d.source.y)); }.bind(this))
                 .attr("x2", function (d) { return this.ax.x(this.xScale.invert(d.target.x)); }.bind(this))
                 .attr("y2", function (d) { return this.ax.y(this.yScale.invert(d.target.y)); }.bind(this));

        this.node.attr("transform", function (d) {
            return "translate(" + this.ax.x(this.xScale.invert(d.x)) + "," + this.ax.y(this.yScale.invert(d.y)) + ")";
            }.bind(this)
        );

    }

    NetworkXD3ForceLayoutPlugin.prototype.conditional_features = function(svg) {

        var drag = d3.behavior.drag()
                .on("dragstart", dragstarted)
                .on("drag", dragged.bind(this))
                .on("dragend", dragended);

        function dragstarted(d) {
            d3.event.sourceEvent.stopPropagation();
            d3.select(this).classed("fixed", d.fixed = true);
            d.fixed = true;
        }

        function dblclick(d) {
          self.force.resume();
          d3.select(this).classed("fixed", d.fixed = false);
        }

        function dragged(d) {
            var mouse = d3.mouse(svg.node());
            d.x = this.xScale(this.ax.x.invert(mouse[0]));
            d.y = this.yScale(this.ax.y.invert(mouse[1]));
            d.px = d.x;
            d.py = d.y;
            d.fixed = true;
            this.force.resume();
        }

        function dragended(d) {
            d.fixed = true;
            }

        var self = this;
        if (this.props.draggable === true) {
            this.node.on("dblclick", dblclick).call(drag)
        }

    }



       mpld3.draw_figure("fig_el6303944499107368844826201", {"axes": [{"xlim": [0.0, 1.0], "yscale": "linear", "axesbg": "#FFFFFF", "texts": [], "zoomable": true, "images": [], "xdomain": [0.0, 1.0], "ylim": [0.0, 1.0], "paths": [], "sharey": [], "sharex": [], "axesbgalpha": null, "axes": [{"scale": "linear", "tickformat": null, "grid": {"gridOn": false}, "fontsize": 10.0, "position": "bottom", "nticks": 6, "tickvalues": null}, {"scale": "linear", "tickformat": null, "grid": {"gridOn": false}, "fontsize": 10.0, "position": "left", "nticks": 6, "tickvalues": null}], "lines": [], "markers": [], "id": "el630394450434960", "ydomain": [0.0, 1.0], "collections": [], "xscale": "linear", "bbox": [0.125, 0.125, 0.77500000000000002, 0.77500000000000002]}], "height": 288.0, "width": 432.0, "plugins": [{"type": "reset"}, {"enabled": false, "button": true, "type": "zoom"}, {"enabled": false, "button": true, "type": "boxzoom"}, {"draggable": true, "charge": -30, "link_distance": 20, "link_strength": 1, "ax_id": "el630394450434960", "graph": {"directed": false, "graph": {}, "nodes": [{"name": "Node1", "color": "red", "y": 0.25, "x": 0.25, "fixed": true, "id": 1}, {"y": 0.75, "x": 0.75, "fixed": true, "id": 2}, {"id": 3}], "links": [{"source": 0, "target": 1}, {"source": 0, "target": 2}, {"source": 1, "target": 2}], "multigraph": false}, "nominal_radius": 5, "type": "networkxd3forcelayout", "gravity": 1, "friction": 0.9}], "data": {}, "id": "el630394449910736"});
   }(mpld3);
}else if(typeof define === "function" && define.amd){
   // require.js is available: use it to load d3/mpld3
   require.config({paths: {d3: "https://mpld3.github.io/js/d3.v3.min"}});
   require(["d3"], function(d3){
      window.d3 = d3;
      mpld3_load_lib("https://mpld3.github.io/js/mpld3.v0.2.js", function(){


    mpld3.register_plugin("networkxd3forcelayout", NetworkXD3ForceLayoutPlugin);
    NetworkXD3ForceLayoutPlugin.prototype = Object.create(mpld3.Plugin.prototype);
    NetworkXD3ForceLayoutPlugin.prototype.constructor = NetworkXD3ForceLayoutPlugin;
    NetworkXD3ForceLayoutPlugin.prototype.requiredProps = ["graph",
                                                                "ax_id",];
    NetworkXD3ForceLayoutPlugin.prototype.defaultProps = { coordinates: "data",
                                                               draggable: true,
                                                               gravity: 1,
                                                               charge: -30,
                                                               link_strength: 1,
                                                               friction: 0.9,
                                                               link_distance: 20,
                                                               maximum_stroke_width: 2,
                                                               minimum_stroke_width: 1,
                                                               nominal_stroke_width: 1,
                                                               maximum_radius: 10,
                                                               minimum_radius: 1,
                                                               nominal_radius: 5,
                                                            };

    function NetworkXD3ForceLayoutPlugin(fig, props){
        mpld3.Plugin.call(this, fig, props);
    };

    var color = d3.scale.category20();

    NetworkXD3ForceLayoutPlugin.prototype.zoomScaleProp = function (nominal_prop, minimum_prop, maximum_prop) {
        var zoom = this.ax.zoom;
        scalerFunction = function() {
            var prop = nominal_prop;
            if (nominal_prop*zoom.scale()>maximum_prop) prop = maximum_prop/zoom.scale();
            if (nominal_prop*zoom.scale()<minimum_prop) prop = minimum_prop/zoom.scale();
            return prop
        }
        return scalerFunction;
    }

    NetworkXD3ForceLayoutPlugin.prototype.setupDefaults = function () {

        this.zoomScaleStroke = this.zoomScaleProp(this.props.nominal_stroke_width,
                                                  this.props.minimum_stroke_width,
                                                  this.props.maximum_stroke_width)
        this.zoomScaleRadius = this.zoomScaleProp(this.props.nominal_radius,
                                                  this.props.minimum_radius,
                                                  this.props.maximum_radius)
    }

    NetworkXD3ForceLayoutPlugin.prototype.zoomed = function() {
            this.tick()
        }

    NetworkXD3ForceLayoutPlugin.prototype.draw = function(){

        plugin = this
        brush = this.fig.getBrush();

        DEFAULT_NODE_SIZE = this.props.nominal_radius;

        var height = this.fig.height
        var width = this.fig.width

        var graph = this.props.graph
        var gravity = this.props.gravity.toFixed()
        var charge = this.props.charge.toFixed()
        var link_distance = this.props.link_distance.toFixed()
        var link_strength = this.props.link_strength.toFixed()
        var friction = this.props.friction.toFixed()

        this.ax = mpld3.get_element(this.props.ax_id, this.fig)

        var ax = this.ax;

        this.ax.elements.push(this)

        ax_obj = this.ax;

        var width = d3.max(ax.x.range()) - d3.min(ax.x.range()),
            height = d3.max(ax.y.range()) - d3.min(ax.y.range());

        var color = d3.scale.category20();

        this.xScale = d3.scale.linear().domain([0, 1]).range([0, width]) // ax.x;
        this.yScale = d3.scale.linear().domain([0, 1]).range([height, 0]) // ax.y;

        this.force = d3.layout.force()
                            .size([width, height]);

        this.svg = this.ax.axes.append("g");

        for(var i = 0; i < graph.nodes.length; i++){
            var node = graph.nodes[i];
            if (node.hasOwnProperty('x')) {
                node.x = this.ax.x(node.x);
            }
            if (node.hasOwnProperty('y')) {
                node.y = this.ax.y(node.y);
            }
        }

        this.force
            .nodes(graph.nodes)
            .links(graph.links)
            .linkStrength(link_strength)
            .friction(friction)
            .linkDistance(link_distance)
            .charge(charge)
            .gravity(gravity)
            .start();

        this.link = this.svg.selectAll(".link")
            .data(graph.links)
          .enter().append("line")
            .attr("class", "link")
            .attr("stroke", "black")
            .style("stroke-width", function (d) { return Math.sqrt(d.value); });

        this.node = this.svg.selectAll(".node")
            .data(graph.nodes)
          .enter().append("circle")
            .attr("class", "node")
            .attr("r", function(d) {return d.size === undefined ? DEFAULT_NODE_SIZE : d.size ;})
            .style("fill", function (d) { return d.color; });

        this.node.append("title")
            .text(function (d) { return d.name; });

        this.force.on("tick", this.tick.bind(this));

        this.setupDefaults()
        this.conditional_features(this.svg);

    };

    NetworkXD3ForceLayoutPlugin.prototype.tick = function() {

        this.link.attr("x1", function (d) { return this.ax.x(this.xScale.invert(d.source.x)); }.bind(this))
                 .attr("y1", function (d) { return this.ax.y(this.yScale.invert(d.source.y)); }.bind(this))
                 .attr("x2", function (d) { return this.ax.x(this.xScale.invert(d.target.x)); }.bind(this))
                 .attr("y2", function (d) { return this.ax.y(this.yScale.invert(d.target.y)); }.bind(this));

        this.node.attr("transform", function (d) {
            return "translate(" + this.ax.x(this.xScale.invert(d.x)) + "," + this.ax.y(this.yScale.invert(d.y)) + ")";
            }.bind(this)
        );

    }

    NetworkXD3ForceLayoutPlugin.prototype.conditional_features = function(svg) {

        var drag = d3.behavior.drag()
                .on("dragstart", dragstarted)
                .on("drag", dragged.bind(this))
                .on("dragend", dragended);

        function dragstarted(d) {
            d3.event.sourceEvent.stopPropagation();
            d3.select(this).classed("fixed", d.fixed = true);
            d.fixed = true;
        }

        function dblclick(d) {
          self.force.resume();
          d3.select(this).classed("fixed", d.fixed = false);
        }

        function dragged(d) {
            var mouse = d3.mouse(svg.node());
            d.x = this.xScale(this.ax.x.invert(mouse[0]));
            d.y = this.yScale(this.ax.y.invert(mouse[1]));
            d.px = d.x;
            d.py = d.y;
            d.fixed = true;
            this.force.resume();
        }

        function dragended(d) {
            d.fixed = true;
            }

        var self = this;
        if (this.props.draggable === true) {
            this.node.on("dblclick", dblclick).call(drag)
        }

    }



         mpld3.draw_figure("fig_el6303944499107368844826201", {"axes": [{"xlim": [0.0, 1.0], "yscale": "linear", "axesbg": "#FFFFFF", "texts": [], "zoomable": true, "images": [], "xdomain": [0.0, 1.0], "ylim": [0.0, 1.0], "paths": [], "sharey": [], "sharex": [], "axesbgalpha": null, "axes": [{"scale": "linear", "tickformat": null, "grid": {"gridOn": false}, "fontsize": 10.0, "position": "bottom", "nticks": 6, "tickvalues": null}, {"scale": "linear", "tickformat": null, "grid": {"gridOn": false}, "fontsize": 10.0, "position": "left", "nticks": 6, "tickvalues": null}], "lines": [], "markers": [], "id": "el630394450434960", "ydomain": [0.0, 1.0], "collections": [], "xscale": "linear", "bbox": [0.125, 0.125, 0.77500000000000002, 0.77500000000000002]}], "height": 288.0, "width": 432.0, "plugins": [{"type": "reset"}, {"enabled": false, "button": true, "type": "zoom"}, {"enabled": false, "button": true, "type": "boxzoom"}, {"draggable": true, "charge": -30, "link_distance": 20, "link_strength": 1, "ax_id": "el630394450434960", "graph": {"directed": false, "graph": {}, "nodes": [{"name": "Node1", "color": "red", "y": 0.25, "x": 0.25, "fixed": true, "id": 1}, {"y": 0.75, "x": 0.75, "fixed": true, "id": 2}, {"id": 3}], "links": [{"source": 0, "target": 1}, {"source": 0, "target": 2}, {"source": 1, "target": 2}], "multigraph": false}, "nominal_radius": 5, "type": "networkxd3forcelayout", "gravity": 1, "friction": 0.9}], "data": {}, "id": "el630394449910736"});
      });
    });
}else{
    // require.js not available: dynamically load d3 & mpld3
    mpld3_load_lib("https://mpld3.github.io/js/d3.v3.min.js", function(){
         mpld3_load_lib("https://mpld3.github.io/js/mpld3.v0.2.js", function(){


    mpld3.register_plugin("networkxd3forcelayout", NetworkXD3ForceLayoutPlugin);
    NetworkXD3ForceLayoutPlugin.prototype = Object.create(mpld3.Plugin.prototype);
    NetworkXD3ForceLayoutPlugin.prototype.constructor = NetworkXD3ForceLayoutPlugin;
    NetworkXD3ForceLayoutPlugin.prototype.requiredProps = ["graph",
                                                                "ax_id",];
    NetworkXD3ForceLayoutPlugin.prototype.defaultProps = { coordinates: "data",
                                                               draggable: true,
                                                               gravity: 1,
                                                               charge: -30,
                                                               link_strength: 1,
                                                               friction: 0.9,
                                                               link_distance: 20,
                                                               maximum_stroke_width: 2,
                                                               minimum_stroke_width: 1,
                                                               nominal_stroke_width: 1,
                                                               maximum_radius: 10,
                                                               minimum_radius: 1,
                                                               nominal_radius: 5,
                                                            };

    function NetworkXD3ForceLayoutPlugin(fig, props){
        mpld3.Plugin.call(this, fig, props);
    };

    var color = d3.scale.category20();

    NetworkXD3ForceLayoutPlugin.prototype.zoomScaleProp = function (nominal_prop, minimum_prop, maximum_prop) {
        var zoom = this.ax.zoom;
        scalerFunction = function() {
            var prop = nominal_prop;
            if (nominal_prop*zoom.scale()>maximum_prop) prop = maximum_prop/zoom.scale();
            if (nominal_prop*zoom.scale()<minimum_prop) prop = minimum_prop/zoom.scale();
            return prop
        }
        return scalerFunction;
    }

    NetworkXD3ForceLayoutPlugin.prototype.setupDefaults = function () {

        this.zoomScaleStroke = this.zoomScaleProp(this.props.nominal_stroke_width,
                                                  this.props.minimum_stroke_width,
                                                  this.props.maximum_stroke_width)
        this.zoomScaleRadius = this.zoomScaleProp(this.props.nominal_radius,
                                                  this.props.minimum_radius,
                                                  this.props.maximum_radius)
    }

    NetworkXD3ForceLayoutPlugin.prototype.zoomed = function() {
            this.tick()
        }

    NetworkXD3ForceLayoutPlugin.prototype.draw = function(){

        plugin = this
        brush = this.fig.getBrush();

        DEFAULT_NODE_SIZE = this.props.nominal_radius;

        var height = this.fig.height
        var width = this.fig.width

        var graph = this.props.graph
        var gravity = this.props.gravity.toFixed()
        var charge = this.props.charge.toFixed()
        var link_distance = this.props.link_distance.toFixed()
        var link_strength = this.props.link_strength.toFixed()
        var friction = this.props.friction.toFixed()

        this.ax = mpld3.get_element(this.props.ax_id, this.fig)

        var ax = this.ax;

        this.ax.elements.push(this)

        ax_obj = this.ax;

        var width = d3.max(ax.x.range()) - d3.min(ax.x.range()),
            height = d3.max(ax.y.range()) - d3.min(ax.y.range());

        var color = d3.scale.category20();

        this.xScale = d3.scale.linear().domain([0, 1]).range([0, width]) // ax.x;
        this.yScale = d3.scale.linear().domain([0, 1]).range([height, 0]) // ax.y;

        this.force = d3.layout.force()
                            .size([width, height]);

        this.svg = this.ax.axes.append("g");

        for(var i = 0; i < graph.nodes.length; i++){
            var node = graph.nodes[i];
            if (node.hasOwnProperty('x')) {
                node.x = this.ax.x(node.x);
            }
            if (node.hasOwnProperty('y')) {
                node.y = this.ax.y(node.y);
            }
        }

        this.force
            .nodes(graph.nodes)
            .links(graph.links)
            .linkStrength(link_strength)
            .friction(friction)
            .linkDistance(link_distance)
            .charge(charge)
            .gravity(gravity)
            .start();

        this.link = this.svg.selectAll(".link")
            .data(graph.links)
          .enter().append("line")
            .attr("class", "link")
            .attr("stroke", "black")
            .style("stroke-width", function (d) { return Math.sqrt(d.value); });

        this.node = this.svg.selectAll(".node")
            .data(graph.nodes)
          .enter().append("circle")
            .attr("class", "node")
            .attr("r", function(d) {return d.size === undefined ? DEFAULT_NODE_SIZE : d.size ;})
            .style("fill", function (d) { return d.color; });

        this.node.append("title")
            .text(function (d) { return d.name; });

        this.force.on("tick", this.tick.bind(this));

        this.setupDefaults()
        this.conditional_features(this.svg);

    };

    NetworkXD3ForceLayoutPlugin.prototype.tick = function() {

        this.link.attr("x1", function (d) { return this.ax.x(this.xScale.invert(d.source.x)); }.bind(this))
                 .attr("y1", function (d) { return this.ax.y(this.yScale.invert(d.source.y)); }.bind(this))
                 .attr("x2", function (d) { return this.ax.x(this.xScale.invert(d.target.x)); }.bind(this))
                 .attr("y2", function (d) { return this.ax.y(this.yScale.invert(d.target.y)); }.bind(this));

        this.node.attr("transform", function (d) {
            return "translate(" + this.ax.x(this.xScale.invert(d.x)) + "," + this.ax.y(this.yScale.invert(d.y)) + ")";
            }.bind(this)
        );

    }

    NetworkXD3ForceLayoutPlugin.prototype.conditional_features = function(svg) {

        var drag = d3.behavior.drag()
                .on("dragstart", dragstarted)
                .on("drag", dragged.bind(this))
                .on("dragend", dragended);

        function dragstarted(d) {
            d3.event.sourceEvent.stopPropagation();
            d3.select(this).classed("fixed", d.fixed = true);
            d.fixed = true;
        }

        function dblclick(d) {
          self.force.resume();
          d3.select(this).classed("fixed", d.fixed = false);
        }

        function dragged(d) {
            var mouse = d3.mouse(svg.node());
            d.x = this.xScale(this.ax.x.invert(mouse[0]));
            d.y = this.yScale(this.ax.y.invert(mouse[1]));
            d.px = d.x;
            d.py = d.y;
            d.fixed = true;
            this.force.resume();
        }

        function dragended(d) {
            d.fixed = true;
            }

        var self = this;
        if (this.props.draggable === true) {
            this.node.on("dblclick", dblclick).call(drag)
        }

    }



                 mpld3.draw_figure("fig_el6303944499107368844826201", {"axes": [{"xlim": [0.0, 1.0], "yscale": "linear", "axesbg": "#FFFFFF", "texts": [], "zoomable": true, "images": [], "xdomain": [0.0, 1.0], "ylim": [0.0, 1.0], "paths": [], "sharey": [], "sharex": [], "axesbgalpha": null, "axes": [{"scale": "linear", "tickformat": null, "grid": {"gridOn": false}, "fontsize": 10.0, "position": "bottom", "nticks": 6, "tickvalues": null}, {"scale": "linear", "tickformat": null, "grid": {"gridOn": false}, "fontsize": 10.0, "position": "left", "nticks": 6, "tickvalues": null}], "lines": [], "markers": [], "id": "el630394450434960", "ydomain": [0.0, 1.0], "collections": [], "xscale": "linear", "bbox": [0.125, 0.125, 0.77500000000000002, 0.77500000000000002]}], "height": 288.0, "width": 432.0, "plugins": [{"type": "reset"}, {"enabled": false, "button": true, "type": "zoom"}, {"enabled": false, "button": true, "type": "boxzoom"}, {"draggable": true, "charge": -30, "link_distance": 20, "link_strength": 1, "ax_id": "el630394450434960", "graph": {"directed": false, "graph": {}, "nodes": [{"name": "Node1", "color": "red", "y": 0.25, "x": 0.25, "fixed": true, "id": 1}, {"y": 0.75, "x": 0.75, "fixed": true, "id": 2}, {"id": 3}], "links": [{"source": 0, "target": 1}, {"source": 0, "target": 2}, {"source": 1, "target": 2}], "multigraph": false}, "nominal_radius": 5, "type": "networkxd3forcelayout", "gravity": 1, "friction": 0.9}], "data": {}, "id": "el630394449910736"});
            })
         });
}


</script>
