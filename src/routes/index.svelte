<script context="module">
  export const prerender = true
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

<article class="prose lg:prose-xl">
  <h2 class="title">
    <a class="home" href="https://kdheepak.com">~</a> / blog
  </h2>
  <h4>
    <a target="_blank" href="https://github.com/kdheepak/blog">
      {humanDate}
    </a>
  </h4>
  <div class="tocwrapper">
    <br />
    <p>
      {#each posts as post}
        {#if post.date}
          <div class="row flex-edges justify-between">
            <span class="toclink">
              <a href={post.slug}>
                {post.title}
              </a>
            </span>
            <span class="tocdate">
              {formatDate(post.date)}
            </span>
          </div>
          <br />
        {/if}
      {/each}
    </p>
  </div>
</article>

<style>
</style>
