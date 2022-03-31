<script context="module">
  import { base } from '$app/paths'
  import { page } from '$app/stores'
  import { browser } from '$app/env'
  import { onMount } from 'svelte'

  import '../../static/css/app.css'
  import '../../static/css/latex.css'
  import '../../static/css/pandoc.css'
  import '../../static/css/tufte-extra.css'
  import '../../static/css/tufte.css'

  import DiGithubBadge from 'svelte-icons/di/DiGithubBadge.svelte'
  import FaRssSquare from 'svelte-icons/fa/FaRssSquare.svelte'

  import { SvelteToast, toast } from '@zerodevx/svelte-toast'

  export async function load({ fetch }) {
    try {
      await fetch('/rss.xml')
      await fetch('/sitemap.xml')
      return true
    } catch (error) {
      console.error(error)
    }
  }
</script>

<script>
  function isTagUrl(url) {
    if (!url.startsWith('/tags')) {
      return false
    }
    const chunks = url.split('/').filter((c) => c != '')
    if (chunks[chunks.length - 1] == 'tags' || chunks.length == 1) {
      return false
    }
    return true
  }
  $: rssFeed = isTagUrl($page.url.pathname) ? `${$page.url.pathname}/rss.xml` : '/rss.xml'
  const options = {}
</script>

<SvelteToast {options} />

<main>
  <slot />
</main>

<footer>
  <p>
    <a
      rel="license noopener noreferrer"
      target="_blank"
      href="https://creativecommons.org/licenses/by/4.0/"
      ><img
        alt="This work is licensed under a Creative Commons Attribution 4.0 International License"
        style="border-width:0"
        src="https://i.creativecommons.org/l/by/4.0/88x31.png"
      /></a
    >
  </p>
  <br />
  <div class="icons">
    <div class="icon">
      <a href="https://github.com/kdheepak" target="_blank"><DiGithubBadge /></a>
    </div>
    <div class="icon">
      <a rel="external" href={rssFeed}><FaRssSquare /></a>
    </div>
  </div>
</footer>
