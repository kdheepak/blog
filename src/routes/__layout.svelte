<script context="module">
  import '../css/app.css'
  import '../css/tufte.css'
  import '../css/tufte-extra.css'
  import '../css/latex.css'
  import '../css/pandoc.css'

  import DiGithubBadge from 'svelte-icons/di/DiGithubBadge.svelte'
  import FaRssSquare from 'svelte-icons/fa/FaRssSquare.svelte'
  import MdEmail from 'svelte-icons/md/MdEmail.svelte'
</script>

<main class="line-numbers match-braces rainbow-braces Prose">
  <slot />
</main>

<footer>
  <p>
    <a rel="license noopener noreferrer" target="_blank" href="http://creativecommons.org/licenses/by/4.0/"><img alt="This work is licensed under a Creative Commons Attribution 4.0 International License" style="border-width:0" src="https://i.creativecommons.org/l/by/4.0/88x31.png" /></a>
  </p>
  <div class="icons">
    <div class="icon">
      <a href="https://github.com/kdheepak" target="_blank"><DiGithubBadge/></a>
    </div>
    <div class="icon">
      <a href="./rss.xml" target="_blank"><FaRssSquare/></a>
    </div>
  </div>
</footer>

<style>
  footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 32px;
  }
  .icons {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
  }
  .icon {
    width: 32px;
    height: 32px;
  }

  footer {
    width: 66vw;
    display: flex;
    justify-content: center;
  }
</style>
