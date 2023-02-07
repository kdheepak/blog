<script>
  export const prerender = true
  import { page } from "$app/stores";

  import DiGithubBadge from "svelte-icons/di/DiGithubBadge.svelte";
  import FaRssSquare from "svelte-icons/fa/FaRssSquare.svelte";

  import { SvelteToast, toast } from "@zerodevx/svelte-toast";

  function isTagUrl(url) {
    if (!url.startsWith("/tags")) {
      return false;
    }
    const chunks = url.split("/").filter((c) => c != "");
    if (chunks[chunks.length - 1] == "tags" || chunks.length == 1) {
      return false;
    }
    return true;
  }
  $: rssFeed = isTagUrl($page.url.pathname) ? `${$page.url.pathname}/rss.xml` : "/rss.xml";
  const options = {};
</script>

<SvelteToast {options} />

<main>
  <slot />
</main>

<footer>
  <p>
    <a
      rel="license noopener noreferrer"
      target="_blank"
      href="https://creativecommons.org/licenses/by/4.0/"
      ><img
        alt="This work is licensed under a Creative Commons Attribution 4.0 International License"
        style="border-width:0"
        src="https://i.creativecommons.org/l/by/4.0/88x31.png"
      /></a
    >
  </p>
  <br />
  <div class="icons">
    <div class="icon">
      <a href="https://github.com/kdheepak" target="_blank"><DiGithubBadge /></a>
    </div>
    <div class="icon">
      <a rel="external" href={rssFeed}><FaRssSquare /></a>
    </div>
  </div>
  &nbsp; &nbsp;
  <div>This site does not collect any analytics.</div>
  <div>
    Made with <a target="_blank" href="https://kit.svelte.dev/">SvelteKit</a>,
    <a target="_blank" href="https://pandoc.org">Pandoc</a>
    and <a target="_blank" href="https://edwardtufte.github.io/tufte-css/">Tufte CSS</a>.
  </div>
</footer>

<style>
  footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 32px;
    width: 50%;
    justify-content: center;
  }

  .icons {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
  }

  .icon {
    width: 32px;
    height: 32px;
  }
</style>
