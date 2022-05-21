<script>
  import { base } from "$app/paths";
  import FaTags from "svelte-icons/fa/FaTags.svelte";
  import FaRegCalendarAlt from "svelte-icons/fa/FaRegCalendarAlt.svelte";
  import DarkModeToggle from "$lib/components/DarkModeToggle.svelte";
  import { onMount } from "svelte";
  export let posts = [];
  export let tags = [];
  export let tag = "";
  export let humanDate;
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric", weekday: "short" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
</script>

<svelte:head>
  <title>Dheepak Krishnamurthy - Blog</title>
  <link rel="canonical" href="https://blog.kdheepak.com/" />
  <meta property="og:url" content="https://blog.kdheepak.com/" />
  <link rel="alternate" type="application/rss+xml" title="RSS" href="{base}/tags/{tag}/rss.xml" />
</svelte:head>

<article>
  <header>
    <div class="flex">
      <h1 class="title flex">
        <a href="https://kdheepak.com">~</a> / <a class="bloghome" href="{base}/">blog</a> /
        <a class="bloghome" href="{base}/tags">tags</a>
        / <i>{tag}</i>
      </h1>
    </div>
    <div class="flex main-subtitle">
      <div class="subtitle sourceurl">
        <span class="tag">
          <FaRegCalendarAlt />
        </span>
        <a target="_blank" href="https://github.com/kdheepak/blog">
          {humanDate}
        </a>
        <DarkModeToggle />
      </div>
      <div class="flex">
        <p>&nbsp;</p>
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
              <a sveltekit:prefetch href="../{post.slug}">
                {post.title}
              </a>
              <span class="dull">({post.readingTime} min)</span>
            </span>
            <span class="tocdate">
              <a target="_blank" href={post.source}>{formatDate(post.date)}</a>
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
          <a href="{base}/tags/{tag}">{tag}</a>{index == tags.length - 1 ? "" : ", "}
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

  .subtitle {
    margin-top: 1.4rem;
    margin-bottom: 1.4rem;
    padding-right: 0;
    vertical-align: baseline;
  }

  .tag {
    height: 1.25rem;
    width: 1.25rem;
    color: var(--text-color);
  }

  .dull {
    color: var(--text-color-dull);
  }
</style>
