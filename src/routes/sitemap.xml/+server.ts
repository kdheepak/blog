import { getPostsMetadata } from "$lib/posts";

function xml(posts) {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${posts
      .map((m) => {
        return `<url>
            <loc>https://blog.kdheepak.com/${m.slug}</loc>
          </url>`;
      })
      .join("\n")}
    <url>
      <loc>https://blog.kdheepak.com/</loc>
    </url>
    <url>
      <loc>https://blog.kdheepak.com/404.html</loc>
    </url>
    <url>
      <loc>https://blog.kdheepak.com/rss.xml</loc>
    </url>
  </urlset>`;
}

export async function GET() {
  const { posts } = await getPostsMetadata("src/posts");
  const headers = {
    "cache-control": "max-age=0, s-maxage=3600",
    "content-type": "application/xml; charset=utf-8",
  };
  return new Response(xml(posts), { headers });
}
