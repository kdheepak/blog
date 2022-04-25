<script context="module">
  import { dev } from "$app/env";
  import { base } from "$app/paths";
  /** @type {import('@sveltejs/kit').ErrorLoad} */
  export function load({ error, status }) {
    return {
      props: {
        error,
        status,
      },
    };
  }
</script>

<script>
  export let status;
  export let error;
</script>

<svelte:head>
  <title>{status}</title>
  <link rel="alternate" type="application/rss+xml" title="RSS" href="{base}/rss.xml" />
</svelte:head>

<article>
  <header>
    <h1 class="title">
      <a class="home" href="https://kdheepak.com">~</a> /
      <a class="bloghome" href="{base}/">blog</a>
      / {status}
    </h1>
  </header>

  <section>
    <p>
      Sorry, this URL is broken.
      <a class="bloghome" href="{base}/">Go back to the home page</a> to find all blog posts. If you
      would you like to report this, please open an issue
      <a href="https://github.com/kdheepak/blog/issues" target="_blank">here</a>.
    </p>
    <p>{error.message}</p>

    {#if dev && error.stack}
      <pre>{error.stack}</pre>
    {/if}
  </section>
</article>
