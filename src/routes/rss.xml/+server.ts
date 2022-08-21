import { encode } from "html-entities";
import { getPostsMetadata } from "$lib/posts";

function xml(posts) {
  return `<?xml version="1.0"?>
<?xml-stylesheet type="text/xsl" media="screen" href="/rss.xsl"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Dheepak Krishnamurthy's Blog</title>
    <description>My thoughts, notes and blogs</description>
    <link>https://blog.kdheepak.com/</link>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <pubDate>${new Date().toUTCString()}</pubDate>
    <language>en-us</language>
    <copyright>Copyright 2020, Dheepak Krishnamurthy</copyright>
    <atom:link href="https://blog.kdheepak.com/rss.xml" rel="self" type="application/rss+xml"/>
    <generator>sveltekit</generator>
    ${posts
      .map(
        (post) => `
    <item>
      <title>${post.title}</title>
      <link>https://blog.kdheepak.com/${post.slug}</link>
      <guid isPermaLink="true">https://blog.kdheepak.com/${post.slug}</guid>
      <atom:link href="https://blog.kdheepak.com/${post.slug}" rel="self"></atom:link>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${encode(post.summary)}</description>
    </item>
    `,
      )
      .join("\n")}
  </channel>
</rss>`;
}

export function GET() {
  const posts = getPostsMetadata("src/posts");
  const headers = {
    "Cache-Control": "max-age=0, s-maxage=3600",
    "Content-Type": "application/xml",
  };
  return {
    headers,
    body: xml(posts),
  };
}
