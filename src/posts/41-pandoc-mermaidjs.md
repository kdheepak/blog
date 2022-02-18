---
title: Using MermaidJS with Pandoc
date: 2022-02-17T22:03:31-06:00
tags: pandoc
keywords: mermaid, js, pandoc, lua, filter
summary: Showcase of using integrating MermaidJS with Pandoc lua filters
---

GitHub recently announced [support for MermaidJS](https://github.blog/2022-02-14-include-diagrams-markdown-files-mermaid).
I thought it would be nice to integrate it as part of my blog using Pandoc lua filters.
So the following:

````
```mermaid
sequenceDiagram
    participant Alice
    participant Bob
    Alice->>John: Hello John, how are you?
    Note right of John: Rational thoughts <br/>prevail!
    John-->>Alice: Great!
    John->>Bob: How about you?
    Bob-->>John: Jolly good!
```
````

would be rendered as:

```mermaid
sequenceDiagram
    participant Alice
    participant Bob
    Alice->>John: Hello John, how are you?
    Note right of John: Rational thoughts <br/>prevail!
    John-->>Alice: Great!
    John->>Bob: How about you?
    Bob-->>John: Jolly good!
```
