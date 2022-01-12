---
title: Svelte and Pandoc
category: blog
date: 2022-01-11T23:03:31-06:00
---

This is a svelte pandoc example.

<script>
import Counter from "$lib/components/Counter.svelte"
</script>

<Counter/>

```javascript
function () {
  console.log("hello world")
}
```


$$x + (x - 1) + (x - 2) + (x - 3) + \ldots + 1 >= N$$

Which can be rewritten as:

$$\sum_{k=1}^{x} k >= N$$

$$\frac{x \times (1 + x)}{2} >= N$$

Markdown is awesome at a set of things, and a much better alternative than Word or $\LaTeX$ for those specific set of things.
Take for example this table {@tbl:table}.

**Example**

  Right     Left     Center     Default
-------     ------ ----------   -------
     12     12        12            12
    123     123       123          123
      1     1          1             1

Table:  Demonstration of simple table syntax. {#tbl:table}
