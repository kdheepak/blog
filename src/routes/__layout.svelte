<script context="module">
  import '../css/tufte.css'
  import '../css/tufte-extra.css'
  import '../css/latex.css'
  import '../css/pandoc.css'
  import '../css/prism.css'
  import '../css/app.css'
</script>

<script>
  import {onMount} from 'svelte'
  onMount(() => Prism.highlightAll())
</script>

<main class="line-numbers match-braces rainbow-braces">
  <slot />
</main>
