<script context="module">
  import { browser, dev } from '$app/env'
  import { base, assets } from '$app/paths'
  export const hydrate = dev
  export const router = browser

  const options = { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short' }
  let humanDate = new Date().toLocaleDateString(undefined, options)

  export async function load({ params, fetch }) {
    const url = `/index.json`
    const res = await fetch(url)
    if (res.ok) {
      const { posts } = await res.json()
      return { props: { posts } }
    }
    return {
      status: res.status,
      error: new Error(`Could not load ${url}`),
    }
  }
</script>

<script>
  import { onMount } from 'svelte'
  export let posts = []
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }
</script>

<svelte:head>
  <title>Dheepak Krishnamurthy - Blog</title>
  <link rel="canonical" href="https://blog.kdheepak.com/" />
  <meta property="og:url" content="https://blog.kdheepak.com/" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link
    rel="alternate"
    type="application/rss+xml"
    title="RSS"
    href="https://blog.kdheepak.com/rss.xml"
  />
</svelte:head>

<article>
  <h1 class="title">
    <a href="https://kdheepak.com">~</a> / blog
  </h1>
  <p class="subtitle sourceurl">
    <a target="_blank" href="https://github.com/kdheepak/blog">
      {humanDate}
    </a>
  </p>
  <section>
    <div class="tocwrapper">
      <br />
        {#each posts as post}
      <p>
          {#if post.date}
              <span class="toclink">
                <a href={post.slug}>
                  {post.title}
                </a>
              </span>
              <span class="tocdate">
                {formatDate(post.date)}
              </span>
            <br />
          {/if}
      </p>
        {/each}
    </div>
  </section>
</article>

<style>
</style>
