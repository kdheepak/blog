import fs from "fs";
import matter from "gray-matter";
import path from "path";
import child_process from "child_process";

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "short", day: "numeric", weekday: "short" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

function readingTime(post, metadata) {
  const WORDS_PER_MINUTE = 200;
  //Matches words
  //See
  //https://regex101.com/r/q2Kqjg/6
  const regex = /\w+/g;
  const wordCount = (post || "").match(regex).length;
  metadata.readingTime = Math.ceil(wordCount / WORDS_PER_MINUTE);
}

async function fromDir(startPath, filter) {
  const posts = [];
  const files = fs.readdirSync(startPath);
  for (let i = 0; i < files.length; i++) {
    const filename = path.join(startPath, files[i]);
    const stat = fs.lstatSync(filename);
    if (stat.isDirectory()) {
      continue;
    } else if (filename.indexOf(filter) >= 0) {
      // markdown file
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
        .map((s) => s.trim().toLowerCase())
        .filter((s) => s !== undefined || s !== "");
      if (!metadata.slug) {
        metadata.slug = metadata.title
          .toString()
          .toLowerCase()
          .replace(/<code>/, "")
          .replace(/<\/code>/g, "")
          .replace(/[^\w ]+/g, "")
          .replace(/ +/g, "-");
      }
      if (metadata.date) {
        metadata.humanDate = formatDate(metadata.date);
        posts.push(metadata);
      }
    }
  }
  return posts
    .sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    })
    .reverse();
}

export async function get() {
  const posts = await fromDir("src/posts/", ".md");
  const options = { year: "numeric", month: "short", day: "numeric", weekday: "short" };
  const humanDate = new Date().toLocaleDateString(undefined, options);
  let tags = [...new Set(posts.flatMap((metadata) => metadata.htmltags))];
  tags.sort();
  tags = tags.filter((tag) => tag !== undefined && tag !== "");
  const commit = child_process
    .spawnSync("git", ["log", "-n", "1", "--pretty=format:%H"])
    .stdout.toString();
  const source = `https://github.com/kdheepak/blog/tree/${commit}`;
  return {
    body: { tags, humanDate, source, posts },
  };
}
