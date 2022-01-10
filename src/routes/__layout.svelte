<script context="module">
  import Prism from 'prismjs';
  const highlight = (code, syntax) => Prism.highlight(code, Prism.languages[syntax], syntax);
</script>

<script>
  import '../app.css'
  import '/node_modules/papercss/dist/paper.min.css'
  import {onMount} from 'svelte'

  // if you are intending to use Prism functions manually, you will need to set:
  Prism.manual = true;

  onMount(() => Prism.highlightAll())
</script>

<main>
  <slot />
</main>
