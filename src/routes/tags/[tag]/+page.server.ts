import fs from "fs";
import matter from "gray-matter";
import path from "path";
import child_process from "child_process";
import { getPostsMetadata } from "$lib/posts";

export async function load({ params }) {
  const tag = params.tag;

  let { posts, tags } = await getPostsMetadata("src/posts/", ".md");
  const options = { year: "numeric", month: "short", day: "numeric", weekday: "short" };
  const humanDate = new Date().toLocaleDateString(undefined, options);
  posts = posts.filter((post) =>
    post.tags
      ?.split(",")
      .map((s) => s.trim().toLowerCase())
      .includes(tag.toLowerCase()),
  );

  return {
    tag,
    tags,
    humanDate,
    posts,
  };
}
