import { getPostsMetadata } from "$lib/posts";

export async function load() {
  const { posts, tags } = await getPostsMetadata("src/posts/", ".md");
  const options = { year: "numeric", month: "short", day: "numeric", weekday: "short" };
  const humanDate = new Date().toLocaleDateString(undefined, options);
  return { tags, humanDate, posts };
}
