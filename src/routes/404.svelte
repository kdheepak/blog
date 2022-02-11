<script lang="ts">
  import { base } from '$app/paths'
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
      Sorry, this URL is broken.
      <a class="home" href="https://blog.kdheepak.com">Go back to the home page</a> to find all blog
      posts. If you would you like to report this, please open an issue
      <a href="https://github.com/kdheepak/blog/issues" target="_blank">here</a>.
    </p>
  </section>
</article>
