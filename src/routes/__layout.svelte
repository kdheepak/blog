<script>
import { onMount } from 'svelte';

  import '../css/app.css'
  import '../css/tufte.css'
  import '../css/tufte-extra.css'
  import '../css/latex.css'
  import '../css/pandoc.css'
  import '../css/prism.css'
  import '../css/custom.css'

  onMount(() => {
    let script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js";
    document.head.append(script);

    script.onload = () => {
      MathJax = {
        tex: {inlineMath: [['$', '$'], ['\\(', '\\)']]},
        svg: {fontCache: 'global'}
      };
    };
  })


</script>

<main>
  <slot />
</main>
