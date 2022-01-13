<script context="module">
  import { base } from '$app/paths'
  /** @type {import('@sveltejs/kit').ErrorLoad} */
  export function load({ error, status }) {
    return {
      props: {
        title: `${status}`,
      },
    }
  }
</script>

<script>
  export let title
</script>

<svelte:head>
  <title>{title}</title>
  <link rel="icon" type="image/svg+xml" href="../../static/favicon.ico" />
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
      / {title}
    </h1>
  </header>

  <section>
    <p>
      Sorry, this URL is broken. If you would like to let me know, please report it <a
        href="https://github.com/kdheepak/blog/issues"
        target="_blank">here</a
      >.
    </p>
    <p>
      You can see all available posts here: <a href="{base}/" class="uri"
        >https://blog.kdheepak.com</a
      >
    </p>
  </section>
</article>
