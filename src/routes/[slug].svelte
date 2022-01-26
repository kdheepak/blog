<script context="module">
  import { base } from '$app/paths'

  const allPosts = import.meta.glob('/src/posts/*.md')

  export async function load({ params, fetch }) {
    if (params.slug.endsWith(".html")) {
      return {
        status: 302,
        redirect: `/${params.slug.replace(/.html/g, "")}`
      }
    }
    const url = `/${params.slug}.json`
    const res = await fetch(url)
    if (res.ok) {
      const { metadata } = await res.json()
      const component = (await allPosts[`/${metadata.path}`]()).default
      return { props: { component, metadata } }
    }
    return {
      status: 404,
      error: new Error(`Could not load ${url}`),
    }
  }
</script>

<script>
  import FaTags from 'svelte-icons/fa/FaTags.svelte'
  export let component
  export let metadata
  let tags
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }
  $: metadata.humanDate = formatDate(metadata.date)
  $: {
    tags = metadata.htmltags.map(s => s.trim().toLowerCase()).filter(s => s !== undefined && s !== '')
  }

  import DarkModeToggle from "$lib/components/DarkModeToggle.svelte"

  import {onMount} from 'svelte'
  onMount(() => {
    Prism.highlightAll()
    document.querySelectorAll("opt-in-script").forEach(ois =>
      (ois.querySelector("button") || ois).addEventListener("click", _ => {
        let commentheader = document.createElement("h1");
        commentheader.id = "comments";
        commentheader.innerHTML = '<a href="#comments">#</a> Comments';
        let script = document.createElement("script")
        Array.from(ois.attributes).forEach(attr =>
          script.setAttribute(attr.name, attr.value))
        const theme = localStorage.getItem('theme')
        if (theme === "light" || theme === "dark") {
          script.setAttribute("data-theme", theme)
        }
        ois.parentNode.prepend(commentheader)
        ois.parentNode.replaceChild(script, ois)
      })
    )
  })
</script>

<svelte:head>
  <title>{metadata.title}</title>
  <link rel="canonical" href="https://blog.kdheepak.com/{metadata.slug}" />
  <meta name="robots" content="index, follow">
  <meta name="description" content={metadata.description} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://blog.kdheepak.com/{metadata.slug}/" />
  <meta property="og:title" content={metadata.title} />
  <meta property="og:description" content={metadata.description} />
  <meta property="og:published_time" content={metadata.date} />
  <meta property="og:site_name" content={metadata.title} />
  <meta name="twitter:title" content={metadata.title} />
  <meta name="twitter:description" content={metadata.description} />
  <meta name="keywords" content={metadata.keywords}>
  <meta name="author" content="Dheepak Krishnamurthy">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <html lang="en-GB"/>
  {#if metadata.summary}
    <meta name="description" content={metadata.summary} />
  {/if}
  <link
    rel="alternate"
    type="application/rss+xml"
    title="RSS"
    href="./rss.xml"
  />
  {#each tags as tag}
    <link
      rel="alternate"
      type="application/rss+xml"
      title="RSS for {tag}"
      href="./tags/{tag}/rss.xml"
    />
  {/each}
</svelte:head>

<article>
  <header>
  <h1 class="title">
    <a class="home" href="https://kdheepak.com">~</a> / <a class="bloghome" href="{base}/">blog</a>
    / {metadata.title}
  </h1>
  <div class="flex space-between main-subtitle">
    <div class="subtitle sourceurl">
      <a target="_blank" href={metadata.source}>
        {metadata.humanDate}
      </a>
      <DarkModeToggle/>
    </div>
    <div class="flex">
      {#if tags.length !== 0}
      <div class="tag">
        <FaTags />
      </div>
        <p>
          &nbsp;
          {#each tags as tag, index}
            <a href="{base}/tags/{tag}">{tag}</a>{index == tags.length - 1 ? '' : ', '}
          {/each}
        </p>
      {/if}
    </div>
  </div>
  </header>

  <section>
    <svelte:component this={component} />
  </section>

  <section>
    <opt-in-script
      src="https://giscus.app/client.js"
      data-repo="kdheepak/blog"
      data-repo-id="MDEwOlJlcG9zaXRvcnk1MTE5NDQ4OA=="
      data-category="Comments"
      data-category-id="DIC_kwDOAw0qeM4B_3gQ"
      data-mapping="url"
      data-reactions-enabled="1"
      data-theme="preferred_color_scheme"
      data-emit-metadata="0"
      data-lang="en"
      crossorigin="anonymous"
      async
    >
      <button class="comments-button">Show Comments</button>
    </opt-in-script>
  </section>
</article>

<style>
  .main-subtitle {
    width: 80%;
  }

  .flex {
    display: flex;
    align-items: center;
  }

  .space-between {
    justify-content: space-between;
  }

  .tag {
    height: 1.25rem;
    width: 1.25rem;
    color: var(--text-color);
  }
</style>
