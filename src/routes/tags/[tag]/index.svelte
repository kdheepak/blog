<script>
  import { base } from '$app/paths'
  import FaTags from 'svelte-icons/fa/FaTags.svelte'
  import FaRssSquare from 'svelte-icons/fa/faRssSquare.svelte'
  import DarkModeToggle from '$lib/components/DarkModeToggle.svelte'
  import { onMount } from 'svelte'
  export let posts = []
  export let tags = []
  export let humanDate = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short' })
  export let tag = ''
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }
</script>

<svelte:head>
  <title>Dheepak Krishnamurthy - Blog</title>
  <link rel="canonical" href="https://blog.kdheepak.com/" />
  <meta property="og:url" content="https://blog.kdheepak.com/" />
  <link rel="alternate" type="application/rss+xml" title="RSS" href="./rss.xml" />
</svelte:head>

<article>
  <header>
    <h1 class="title">
      <a href="https://kdheepak.com">~</a> / <a rel="external" class="bloghome" href="{base}/">blog</a> / <i>{tag}</i>
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
              <a sveltekit:prefetch href="../{post.slug}/">
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
          <a rel="external" href="{base}/tags/{tag}/">{tag}</a>{index == tags.length - 1 ? '' : ', '}
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
