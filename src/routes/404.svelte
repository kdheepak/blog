<script lang="ts">
  import { base } from '$app/paths'
  import { dev, browser } from '$app/env'
  import { goto } from '$app/navigation'

  if (browser) {
    const slug = window.location.href
    if (slug.endsWith('.html')) {
      goto(`/${slug.replace(/.html/g, '/')}`)
    }
  }
</script>

<svelte:head>
  <title>404</title>
  <link
    rel="alternate"
    type="application/rss+xml"
    title="RSS"
    href="https://blog.kdheepak.com/rss.xml"
  />
</svelte:head>

<article>
  <header>
    <h1 class="title">
      <a class="home" href="https://kdheepak.com">~</a> /
      <a class="bloghome" href="{base}/">blog</a>
      / 404
    </h1>
  </header>

  <section>
    <p>
      Sorry, this URL is broken. If you would like to let me know, please report it <a
        href="https://github.com/kdheepak/blog/issues"
        target="_blank">here</a
      >.
    </p>
  </section>
</article>
