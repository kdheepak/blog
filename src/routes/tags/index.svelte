<script>
  import { base } from '$app/paths'
  import FaTags from 'svelte-icons/fa/FaTags.svelte'
  import DarkModeToggle from '$lib/components/DarkModeToggle.svelte'
  import { onMount } from 'svelte'
  export let posts = []
  export let tags = []
  export let humanDate

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  function getPostsByTag(posts, tag) {
    return posts.filter((post) =>
      post.tags
        ?.split(',')
        .map((s) => s.trim().toLowerCase())
        .includes(tag.toLowerCase()),
    )
  }

</script>

<svelte:head>
  <title>Dheepak Krishnamurthy - Blog</title>
  <link rel="canonical" href="https://blog.kdheepak.com/" />
  <meta property="og:url" content="https://blog.kdheepak.com/" />
  <link rel="alternate" type="application/rss+xml" title="RSS" href="{base}/rss.xml" />
</svelte:head>

<article>
  <header>
    <h1 class="title">
      <a href="https://kdheepak.com">~</a> / <a class="bloghome" href="{base}/">blog</a> / tags
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
      {#each tags as tag}
        <h3><a class="tag" href="#{tag}">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M497.941 225.941L286.059 14.059A48 48 0 0 0 252.118 0H48C21.49 0 0 21.49 0 48v204.118a48 48 0 0 0 14.059 33.941l211.882 211.882c18.744 18.745 49.136 18.746 67.882 0l204.118-204.118c18.745-18.745 18.745-49.137 0-67.882zM112 160c-26.51 0-48-21.49-48-48s21.49-48 48-48 48 21.49 48 48-21.49 48-48 48zm513.941 133.823L421.823 497.941c-18.745 18.745-49.137 18.745-67.882 0l-.36-.36L527.64 323.522c16.999-16.999 26.36-39.6 26.36-63.64s-9.362-46.641-26.36-63.64L331.397 0h48.721a48 48 0 0 1 33.941 14.059l211.882 211.882c18.745 18.745 18.745 49.137 0 67.882z"></path></svg>
        </a> {tag}</h3>
        {#each getPostsByTag(posts, tag) as post}
          <p>
            {#if post.date}
              <span class="toclink">
                <a sveltekit:prefetch href="../{post.slug}">
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
      {/each}
    </div>
    <br />
    <div class="flex">
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
    align-items: center;
  }

  .tag {
    height: 1.25rem;
    width: 1.25rem;
    color: var(--text-color);
  }

  svg {
    stroke: currentColor;
    fill: currentColor;
    stroke-width: 0;
    width: 0.75em;
    height: auto;
    max-height: 0.75em;
  }
</style>
