<script context="module">
  import '../css/app.css'
  import '../css/tufte.css'
  import '../css/tufte-extra.css'
  import '../css/latex.css'
  import '../css/pandoc.css'

</script>

<script>

  import {onMount} from 'svelte'
  onMount(() => {
    const btn = document.querySelector(".theme-toggle");
    const theme = document.querySelector("#prism-theme");

    const currentTheme = localStorage.getItem("theme");
    if (currentTheme == "dark") {
      btn.innerText = ""
      document.body.classList.toggle("dark-mode");
      theme.href = "https://cdn.jsdelivr.net/npm/prismjs@1.26.0/themes/prism-tomorrow.min.css"
    } else if (currentTheme == "light") {
      btn.innerText = ""
      document.body.classList.toggle("light-mode");
      theme.href = "https://cdn.jsdelivr.net/npm/prismjs@1.26.0/themes/prism.min.css"
    }
     
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

    btn.addEventListener("click", function() {

      if (prefersDarkScheme.matches) {
        document.body.classList.toggle("light-mode");
        var mode = document.body.classList.contains("light-mode") ? "light" : "dark";
      } else {
        document.body.classList.toggle("dark-mode");
        var mode = document.body.classList.contains("dark-mode") ? "dark" : "light";
      }
      localStorage.setItem("theme", mode);

      if (mode === "dark") {
        btn.innerText = ""
        theme.href = "https://cdn.jsdelivr.net/npm/prismjs@1.26.0/themes/prism-tomorrow.min.css";
      } else {
        btn.innerText = ""
        theme.href = "https://cdn.jsdelivr.net/npm/prismjs@1.26.0/themes/prism.min.css";
      }
    });
  })

</script>

<main class="line-numbers match-braces rainbow-braces Prose">
  <slot />
</main>
