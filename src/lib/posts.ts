import fs from "fs";
import matter from "gray-matter";
import path from "path";
import { encode } from "html-entities";
import child_process from "child_process";

export function formatDate(dateString: string) {
  const options = { year: "numeric", month: "short", day: "numeric", weekday: "short" };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

export function readingTime(post, metadata) {
  const WORDS_PER_MINUTE = 200;
  const regex = /\w+/g;
  const wordCount = (post || "").match(regex).length;
  metadata.readingTime = Math.ceil(wordCount / WORDS_PER_MINUTE);
}

export async function getPostsMetadata(startPath: string, filter = ".md") {
  let posts = [];
  let metadatas = {};
  let tags = [];
  const files = fs.readdirSync(startPath);
  for (let i = 0; i < files.length; i++) {
    const filename = path.join(startPath, files[i]);
    const stat = fs.lstatSync(filename);
    if (stat.isDirectory()) {
      continue;
    } else if (filename.indexOf(filter) >= 0) {
      const doc = await fs.promises.readFile(filename, "utf8");
      const { data: metadata, content } = matter(doc);
      const commit = child_process
        .spawnSync("git", ["log", "-n", "1", "--pretty=format:%H", "--", `${filename}`])
        .stdout.toString();
      readingTime(content, metadata);
      metadata.source = `https://github.com/kdheepak/blog/blob/${commit}/${filename}`;
      metadata.htmltags = metadata.tags === undefined ? "" : metadata.tags;
      metadata.htmltags = metadata.htmltags
        .split(",")
        .map((s: string) => s.trim().toLowerCase())
        .filter((s: string) => s !== undefined || s !== "");
      if (!metadata.slug) {
        metadata.slug = metadata.title
          .toString()
          .toLowerCase()
          .replace(/<code>/, "")
          .replace(/<\/code>/g, "")
          .replace(/[^\w ]+/g, "")
          .replace(/ +/g, "-");
      }
      metadata.slug = encode(metadata.slug);
      if (metadata.date) {
        metadata.humanDate = formatDate(metadata.date);
        metadata.date = formatDate(metadata.date);
        posts.push(metadata);
        metadatas[metadata.slug] = { metadata, content };
      }
      for (const tag of metadata.htmltags
        .map((s) => s.trim().toLowerCase())
        .filter((s) => s !== undefined && s !== "")) {
        tags.push(tag);
      }
    }
  }
  tags = [...new Set(tags)];
  tags.sort();
  tags = tags.filter((tag) => tag !== undefined && tag !== "");
  posts = posts
    .sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    })
    .reverse();
  return { metadatas, posts, tags };
}
