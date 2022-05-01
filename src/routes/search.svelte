<script>
  import { onMount } from 'svelte'
  onMount(() => {
    stork.register("blog", `${base}/assets/stork/search.st`);
  })
</script>


<input data-stork="blog" />
<div data-stork="blog-output"></div>
