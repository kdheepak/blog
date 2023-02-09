import child_process from "child_process";

import { getPostsMetadata } from "$lib/posts";

export function load() {
  const { posts, tags } = getPostsMetadata("src/posts/", ".md", true);
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
