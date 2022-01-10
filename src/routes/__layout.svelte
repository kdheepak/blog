<script>
  import '../app.css'
  import '/node_modules/papercss/dist/paper.min.css'
  import {prism} from "svelte-prism-action";
  import {onMount} from 'svelte'

</script>

<main use:prism>
  <slot />
</main>
