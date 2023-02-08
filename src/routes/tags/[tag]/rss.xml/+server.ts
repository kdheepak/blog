import { getPostsMetadata } from "$lib/posts";

function xml(posts, tag) {
  return `<?xml version="1.0"?>
<?xml-stylesheet type="text/xsl" media="screen" href="/rss.xsl"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Dheepak Krishnamurthy's Blog</title>
    <description>My thoughts, notes and blogs</description>
    <link>https://blog.kdheepak.com/</link>
    <language>en-us</language>
    <copyright>Copyright 2020, Dheepak Krishnamurthy</copyright>
    <atom:link href="https://blog.kdheepak.com/tags/${tag}/rss.xml" rel="self" type="application/rss+xml"></atom:link>
    <generator>sveltekit</generator>
    ${posts
      .filter((post) =>
        post.tags
          ?.split(",")
          .map((s) => s.trim())
          .includes(tag),
      )
      .map(
        (post) => `
    <item>
      <title>${post.title}</title>
      <link>https://blog.kdheepak.com/${post.slug}</link>
      <guid isPermaLink="true">https://blog.kdheepak.com/${post.slug}</guid>
      <atom:link href="https://blog.kdheepak.com/${post.slug}" rel="self"></atom:link>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${post.summary}</description>
    </item>
    `,
      )
      .join("\n")}
  </channel>
</rss>`;
}

export function GET({ params }) {
  const { tag } = params;
  const { posts } = getPostsMetadata("src/posts");
  const headers = {
    "cache-control": "max-age=0, s-maxage=3600",
    "content-type": "application/xml; charset=utf-8",
  };
  return new Response(xml(posts, tag), { headers });
}
export const prerender = true;
