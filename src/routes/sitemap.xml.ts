import { getPostsMetadata } from '$lib/posts'

function xml(posts) {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${posts
      .map((m) => {
        return `<url>
          <loc>https://blog.kdheepak.com/${m.slug}</loc>
        </url>`
      })
      .join('\n')}
    <url>
      <loc>https://blog.kdheepak.com/</loc>
    </url>
    <url>
      <loc>https://blog.kdheepak.com/404.html</loc>
    </url>
    <url>
      <loc>https://blog.kdheepak.com/rss.xml</loc>
    </url>
    ${[...new Set(posts.flatMap((metadata) => metadata.htmltags))]
      .map((s) => {
        return `<url>
          <loc>https://blog.kdheepak.com/tags/${s}</loc>
        </url>`
      })
      .join('\n')}
  </urlset>`
}

export function get() {
  const posts = getPostsMetadata('src/posts')
  const headers = {
    'Cache-Control': 'max-age=0, s-maxage=3600',
    'Content-Type': 'application/xml',
  }
  return {
    headers,
    body: xml(posts),
  }
}
