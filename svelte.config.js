import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/kit/vite";
import importAssets from "svelte-preprocess-import-assets";

import { getPostsMetadata } from "./src/lib/posts.js";

function getPages() {
  let pages = ["*"];
  const { metadatas, tags } = getPostsMetadata("src/posts");
  for (const data of Object.values(metadatas)) {
    pages.push(`/${data.metadata.slug}`);
  }
  for (const tag of tags) {
    pages.push(`/tags/${tag}`);
    pages.push(`/tags/${tag}/rss.xml`);
  }
  return pages;
}
/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: [".svelte", ".md"],
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: [vitePreprocess(), importAssets()],
  kit: {
    adapter: adapter(),
    prerender: {
      handleMissingId: "warn",
      concurrency: 8,
      crawl: true,
      entries: getPages(),
    },
  },
};

export default config;
