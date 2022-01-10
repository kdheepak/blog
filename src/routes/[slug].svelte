<script context="module">
  export const prerender = true

  import { browser, dev } from '$app/env'
  import { base, assets } from '$app/paths'
  import { onMount } from 'svelte'

  const allPosts = import.meta.glob('/src/posts/*.md')
  export const hydrate = dev
  export const router = browser

  export async function load({ params, fetch }) {
    const url = `/${params.slug}.json`
    const res = await fetch(url)
    if (res.ok) {
      const { metadata } = await res.json()
      const component = (await allPosts[`/${metadata.path}`]()).default
      return { props: { component, metadata } }
    }
    return {
      status: res.status,
      error: new Error(`Could not load ${url}`),
    }
  }
</script>

<script>
  export let component
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

<article class="article">
  <h2 class="article-title">
    <a class="home" href="https://kdheepak.com">~</a> / <a class="bloghome" href="{base}/">blog</a>
    / {metadata.title}
  </h2>
  <p class="article-meta">
    <a target="_blank" href={metadata.source}>
      {metadata.humanDate}
    </a>
  </p>

  <svelte:component this={component} />

  <section>
    <opt-in-script
      src="https://giscus.app/client.js"
      data-repo="kdheepak/blog"
      data-repo-id="MDEwOlJlcG9zaXRvcnk1MTE5NDQ4OA=="
      data-category="Comments"
      data-category-id="DIC_kwDOAw0qeM4B_3gQ"
      data-mapping="url"
      data-reactions-enabled="1"
      data-emit-metadata="0"
      data-theme="light"
      data-lang="en"
      crossorigin="anonymous"
      async
    >
      <button class="comments-button">Show Comments</button>
    </opt-in-script>
  </section>
</article>

<style>
</style>
