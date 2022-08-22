<script>
  import { base } from "$app/paths";
  import FaRegCalendarAlt from "svelte-icons/fa/FaRegCalendarAlt.svelte";
  import FaGlasses from "svelte-icons/fa/FaGlasses.svelte";
  import FaTags from "svelte-icons/fa/FaTags.svelte";
  import DarkModeToggle from "$lib/components/DarkModeToggle.svelte";
  import Search from "$lib/components/Search.svelte";

  /** @type {import('./$types').PageData} */
  export let data;
  let posts = [];
  let tags = [];
  let { humanDate, source } = data;
  $: ({ posts, tags, humanDate, source } = data);
</script>

<svelte:head>
  <title>Dheepak Krishnamurthy - Blog</title>
  <link rel="canonical" href="https://blog.kdheepak.com/" />
  <meta property="og:url" content="https://blog.kdheepak.com/" />
  <meta name="description" content="My thoughts and notes" />
  <meta name="robots" content="index, follow" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://blog.kdheepak.com" />
  <meta property="og:title" content="Dheepak Krishnamurthy - Blog" />
  <meta property="og:description" content="My thoughts and notes" />
  <meta property="og:site_name" content="kdheepak.com" />
  <meta name="twitter:title" content="Dheepak Krishnamurthy - Blog" />
  <meta name="twitter:description" content="My thoughts and notes" />
  <meta name="author" content="Dheepak Krishnamurthy" />
  <link rel="alternate" type="application/rss+xml" title="RSS" href="/rss.xml" />
  <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
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
    <div class="flex justify-between w-2-by-3">
      <h1 class="title">
        <span>
          <a href="https://kdheepak.com">~</a> / blog
        </span>
      </h1>
      <div class="search">
        <Search />
      </div>
    </div>
    <div class="flex items-center main-subtitle">
      <div class="subtitle sourceurl">
        <div class="tag">
          <FaRegCalendarAlt />
        </div>
        <a target="_blank" href={source}>
          {humanDate}
        </a>
        <DarkModeToggle />
      </div>
      <div class="flex items-center">
        <p>&nbsp;</p>
      </div>
    </div>
  </header>
  <section>
    <div class="flex items-center">
      <div class="tag">
        <FaTags />
      </div>
      <div>
        &nbsp;
        <a sveltekit:prefetch href="{base}/tags">tags</a>,
        {#each tags as tag, index}
          <a sveltekit:prefetch href="{base}/tags/{tag}">{tag}</a>{index == tags.length - 1
            ? ""
            : ", "}
        {/each}
      </div>
    </div>
  </section>
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
              <span class="dull">({post.readingTime} min)</span>
            </span>
            <span class="tocdate">
              <a target="_blank" href={post.source}>{post.humanDate}</a>
            </span>
            <br />
          {/if}
        </p>
      {/each}
    </div>
  </section>
</article>

<style>
  .w-2-by-3 {
    width: 66.66666%;
  }

  @media (max-width: 760px) {
    .w-2-by-3 {
      width: 100%;
    }
  }

  .search {
    width: 33.33333%;
    margin-top: 4rem;
    margin-bottom: 1.4rem;
    padding-top: 0.4rem;
  }

  .subtitle {
    margin-top: 1.4rem;
    margin-bottom: 1.4rem;
    padding-right: 0;
    vertical-align: baseline;
  }

  .flex {
    display: flex;
  }

  .items-center {
    align-items: center;
  }

  .dull {
    color: var(--text-color-dull);
  }

  .justify-between {
    justify-content: space-between;
  }

  .tag {
    height: 1.25rem;
    width: 1.25rem;
    color: var(--text-color);
  }
</style>
