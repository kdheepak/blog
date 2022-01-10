<script>
import { onMount } from 'svelte';

  import '../css/app.css'
  import '../css/tufte.css'
  import '../css/tufte-extra.css'
  import '../css/latex.css'
  import '../css/pandoc.css'
  import '../css/prism.css'

  import '$lib/prism.js'

  onMount(() => Prism.highlightAll())


</script>

<main>
  <slot />
</main>
