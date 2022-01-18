import { getPostsMetadata } from '$lib/posts'

function xml(posts, tag) {
  return `<?xml version="1.0"?>
<?xml-stylesheet type="text/xsl" media="screen" href="/rss.xsl"?>
<rss xmlns:dc="https://purl.org/dc/elements/1.1/" xmlns:content="https://purl.org/rss/1.0/modules/content/" xmlns:atom="https://www.w3.org/2005/Atom" version="2.0">
  <channel>
    <title>Dheepak Krishnamurthy's Blog</title>
    <description>My thoughts, notes and blogs</description>
    <link>https://blog.kdheepak.com/</link>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <pubDate>${new Date().toUTCString()}</pubDate>
    <language>en-us</language>
    <copyright>Copyright 2020, Dheepak Krishnamurthy</copyright>
    <atom:link href="https://blog.kdheepak.com/tags/julia/rss.xml" rel="self" type="application/rss+xml"></atom:link>
    <generator>website</generator>
    ${posts.filter((post) => post.tags?.split(',').map((s) => s.trim()).includes(tag)).map(post => `
    <item>
      <title>${post.title}</title>
      <link>https://blog.kdheepak.com/${post.slug}</link>
      <guid isPermaLink="true">https://blog.kdheepak.com/${post.slug}</guid>
      <atom:link href="https://blog.kdheepak.com/${post.slug}" rel="self"></atom:link>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${post.summary}</description>
    </item>
    `)}
  </channel>
</rss>`
}

export async function get({ params }) {
  const { tag } = params;
  const posts = await getPostsMetadata("src/posts")
  const headers = {
    'Cache-Control': 'max-age=0, s-maxage=3600',
    'Content-Type': 'application/xml',
  }
  return {
    headers,
    body: xml(posts, tag),
  }
}
