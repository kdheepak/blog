// @migration task: Check imports
import fs from "fs";
import matter from "gray-matter";
import path from "path";
import child_process from "child_process";
import { getPostsMetadata } from "$lib/posts";

/** @type {import('./$types').PageServerLoad} */
export function load({ params }) {
  const { slug } = params;
  const { metadatas } = getPostsMetadata("src/posts/", ".md");
  const s: string = slug.replace(path.parse(slug).ext, "");
  if (metadatas[s] !== undefined) {
    const { metadata } = metadatas[s];
    return {
      metadata,
    };
  }
}
