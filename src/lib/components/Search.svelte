<script>
  import { base } from "$app/paths";
  import { onMount } from "svelte";
  onMount(() => {
    stork.register("blog", `${base}/assets/stork/search.st`);
  });
</script>

<div class="stork-wrapper-flat">
  <input data-stork="blog" class="stork-input" />
  <div data-stork="blog-output" class="stork-output" />
</div>
