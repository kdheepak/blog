import { base } from "$app/paths";
import FaRegCalendarAlt from "svelte-icons/fa/FaRegCalendarAlt.svelte";
import FaGlasses from "svelte-icons/fa/FaGlasses.svelte";
import FaTags from "svelte-icons/fa/FaTags.svelte";
import DarkModeToggle from "$lib/components/DarkModeToggle.svelte";
import Search from "$lib/components/Search.svelte";

import child_process from "child_process";

import { getPostsMetadata } from "$lib/posts";

export async function load() {
  const { posts, tags } = await getPostsMetadata("src/posts/", ".md");
  const options = { year: "numeric", month: "short", day: "numeric", weekday: "short" };
  const humanDate = new Date().toLocaleDateString(undefined, options);
  const commit = child_process
    .spawnSync("git", ["log", "-n", "1", "--pretty=format:%H"])
    .stdout.toString();
  const source = `https://github.com/kdheepak/blog/tree/${commit}`;
  return {
    tags,
    humanDate,
    source,
    posts,
  };
}
