<script>
  import { base } from '$app/paths'

  import DarkModeToggle from "$lib/components/DarkModeToggle.svelte"
  import FaTags from 'svelte-icons/fa/FaTags.svelte'
  export let posts = []
  export let tags = []
  export let humanDate = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short' })
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }
</script>

<svelte:head>
  <title>Dheepak Krishnamurthy - Blog</title>
  <link rel="canonical" href="https://blog.kdheepak.com/" />
  <meta property="og:url" content="https://blog.kdheepak.com/" />
  <meta name="description" content="My thoughts and notes" />
  <meta name="robots" content="index, follow">
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://blog.kdheepak.com" />
  <meta property="og:title" content="Dheepak Krishnamurthy - Blog" />
  <meta property="og:description" content="My thoughts and notes" />
  <meta property="og:site_name" content="kdheepak.com" />
  <meta name="twitter:title" content="Dheepak Krishnamurthy - Blog" />
  <meta name="twitter:description" content="My thoughts and notes" />
  <meta name="author" content="Dheepak Krishnamurthy">
  <link
    rel="alternate"
    type="application/rss+xml"
    title="RSS"
    href="/rss.xml"
  />
  {#each tags as tag}
    <link
      rel="alternate"
      type="application/rss+xml"
      title="RSS for {tag}"
      href="/tags/{tag}/rss.xml"
    />
  {/each}
</svelte:head>

<article>
  <header>
    <h1 class="title">
      <a href="https://kdheepak.com">~</a> / blog
    </h1>
    <div class="flex space-between main-subtitle">
      <div class="subtitle sourceurl">
        <a target="_blank" href="https://github.com/kdheepak/blog">
          {humanDate}
        </a>
        <DarkModeToggle/>
      </div>
    </div>
  </header>
  <section>
    <div class="tocwrapper">
      <br />
        {#each posts as post}
          <p>
            {#if post.date}
                <span class="toclink">
                  <a sveltekit:prefetch href="/{post.slug}">
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
          <a sveltekit:prefetch href="{base}/tags/{tag}/">{tag}</a>{index == tags.length - 1 ? '' : ', '}
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
