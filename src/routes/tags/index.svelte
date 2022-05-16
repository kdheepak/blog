<script>
  import { base } from "$app/paths";
  import FaTags from "svelte-icons/fa/FaTags.svelte";
  import DarkModeToggle from "$lib/components/DarkModeToggle.svelte";
  import { onMount } from "svelte";
  export let posts = [];
  export let tags = [];
  export let humanDate;

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric", weekday: "short" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  function getPostsByTag(posts, tag) {
    return posts.filter((post) =>
      post.tags
        ?.split(",")
        .map((s) => s.trim().toLowerCase())
        .includes(tag.toLowerCase()),
    );
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
        <h3>
          <a class="tag" href="#{tag}">#</a>&nbsp;<a class="tag" href="{base}/tags/{tag}">{tag}</a>
        </h3>
        {#each getPostsByTag(posts, tag) as post}
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
      {/each}
    </div>
    <br />
    <div class="flex">
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

  .tag {
    height: 1.25rem;
    width: 1.25rem;
    color: var(--text-color);
  }

  .dull {
    color: var(--text-color-dull);
  }
</style>
