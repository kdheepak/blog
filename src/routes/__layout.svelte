<script context="module">
  import { base } from '$app/paths'
  import { page } from '$app/stores';

  import '../../static/css/app.css'
  import '../../static/css/tufte.css'
  import '../../static/css/tufte-extra.css'
  import '../../static/css/latex.css'
  import '../../static/css/pandoc.css'

  import DiGithubBadge from 'svelte-icons/di/DiGithubBadge.svelte'
  import FaRssSquare from 'svelte-icons/fa/FaRssSquare.svelte'

  export async function load({ fetch }) {
    try {
      await fetch('/rss.xml');
      return true;
    } catch (error) {
      console.error(error);
    }
  }
</script>

<script>
  $: rssFeed = $page.url.pathname.startsWith('/tags/') ? `${$page.url.pathname}/rss.xml` : '/rss.xml'
</script>

<main class="line-numbers match-braces rainbow-braces Prose">
  <slot />
</main>

<footer>
  <p>
    <a rel="license noopener noreferrer" target="_blank" href="http://creativecommons.org/licenses/by/4.0/"><img alt="This work is licensed under a Creative Commons Attribution 4.0 International License" style="border-width:0" src="https://i.creativecommons.org/l/by/4.0/88x31.png" /></a>
  </p>
  <br/>
  <div class="icons">
    <div class="icon">
      <a href="https://github.com/kdheepak" target="_blank"><DiGithubBadge/></a>
    </div>
    <div class="icon">
      <a rel="external" href="{rssFeed}"><FaRssSquare/></a>
    </div>
  </div>
</footer>

<style>
  footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 32px;
    width: 50%;
    justify-content: center;
  }

  .icons {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
  }

  .icon {
    width: 32px;
    height: 32px;
  }
</style>
