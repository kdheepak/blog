<script context="module">
  import { base } from '$app/paths'
  const options = { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short' }
  let humanDate = new Date().toLocaleDateString(undefined, options)
  let tag = ''

  export async function load({ params, fetch }) {
    tag = params.tag
    const url = `/index.json`
    const res = await fetch(url)
    if (res.ok) {
      const { posts } = await res.json()
      var tags = [
        ...new Set(
          posts.flatMap((post) => post.tags?.split(',').map((s) => s.trim().toLowerCase())),
        ),
      ]
      tags.sort()
      tags = tags.filter((tag) => tag !== undefined)
      return {
        props: {
          tags,
          posts: posts.filter((post) =>
            post.tags
              ?.split(',')
              .map((s) => s.trim().toLowerCase())
              .includes(tag.toLowerCase()),
          ),
        },
      }
    }
    return {
      status: res.status,
      error: new Error(`Could not load ${url}`),
    }
  }
</script>

<script>
  import FaTags from 'svelte-icons/fa/FaTags.svelte'
  import DarkModeToggle from '$lib/components/DarkModeToggle.svelte'
  import { onMount } from 'svelte'
  export let posts = []
  export let tags = []
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }
</script>

<svelte:head>
  <title>Dheepak Krishnamurthy - Blog</title>
  <link rel="canonical" href="https://blog.kdheepak.com/" />
  <meta property="og:url" content="https://blog.kdheepak.com/" />
</svelte:head>

<article>
  <header>
    <h1 class="title">
      <a href="https://kdheepak.com">~</a> / <a class="bloghome" href="{base}/">blog</a> /
      <i>{tag}</i>
    </h1>
    <p class="subtitle sourceurl">
      <a target="_blank" href="https://github.com/kdheepak/blog">
        {humanDate}
      </a>
      <DarkModeToggle />
    </p>
  </header>
  <section>
    <div class="tocwrapper">
      <br />
      {#each posts as post}
        <p>
          {#if post.date}
            <span class="toclink">
              <a sveltekit:prefetch href={post.slug}>
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
    <br />
    <div class="flex">
      <div class="tag">
        <FaTags />
      </div>
      <span>
        &nbsp;
        {#each tags as tag, index}
          <a href="{base}/tags/{tag}">{tag}</a>{index == tags.length - 1 ? '' : ', '}
        {/each}
      </span>
    </div>
  </section>
</article>

<style>
  .flex {
    display: flex;
  }

  .tag {
    height: 1.25rem;
    width: 1.25rem;
    color: var(--text-color);
  }
</style>
