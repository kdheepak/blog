---
title: Svelte and Pandoc
date: 2022-01-11T23:03:31-06:00
tags: svelte, pandoc
---

This is an example of using a svelte component when using pandoc as a preprocessor.

The following is a button that is a Svelte component that increments a counter when you click on it:

<script>
    import Counter from "$lib/components/Counter.svelte"
</script>

<Counter/>

The following is the code I included in the Markdown source file:

```svelte
<script>
  import Counter from "$lib/components/Counter.svelte";
</script>

<Counter />
```

You can click on the date in this blog post to see the source markdown file.
