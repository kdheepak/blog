<script context="module">
  export const prerender = true

  import { browser, dev } from '$app/env'
  import { base, assets } from '$app/paths'
  import { onMount } from 'svelte'
  export const hydrate = dev
  export const router = browser

  export async function load({ params, fetch }) {
    const url = `/${params.slug}.json`
    const res = await fetch(url)
    if (res.ok) {
      const { html, metadata } = await res.json()
      return { props: { html, metadata } }
    }
    return {
      status: res.status,
      error: new Error(`Could not load ${url}`),
    }
  }
</script>

<script>
  export let html
  export let metadata
  const slug = metadata.title.replaceAll(' ', '_').toLowerCase()
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }
  $: metadata.humanDate = formatDate(metadata.date)
</script>

<svelte:head>
  <title>{metadata.title}</title>
  <link rel="canonical" href="https://blog.kdheepak.com/{slug}" />
  <meta name="description" content={metadata.description} />
  <meta property="og:url" content="https://blog.kdheepak.com/{slug}/" />
  <meta property="og:title" content={metadata.title} />
  <meta property="og:description" content={metadata.description} />
  <meta property="og:published_time" content={metadata.date} />
  {#if metadata.summary}
    <meta name="description" content={metadata.summary} />
  {/if}
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
    <a class="home" href="https://kdheepak.com">~</a> / <a class="bloghome" href="{base}/">blog</a>
    / {metadata.title}
  </h1>
  <p class="subtitle sourceurl">
    <a class="sourceurl" target="_blank" href={metadata.source}>
      {metadata.humanDate}
    </a>
  </p>

  {@html html}
</article>

<style>
</style>
