<script>
import { onMount } from 'svelte';

  import '../app.css'
  import '/node_modules/papercss/dist/paper.min.css'

  import '../prism.css'
  import '../prism.js'

  onMount(() => Prism.highlightAll())


</script>

<main>
  <slot />
</main>
