<script context="module">
  export const prerender = true
  const allPosts = import.meta.globEager(`../posts/*.md`)

  const posts = []
  for (let path in allPosts) {
    let post = allPosts[path]
    let { getMetadata } = allPosts[path]
    let metadata = getMetadata()
    if (metadata.slug) {
      let slug = metadata.slug
      posts.push({ post, slug })
    } else {
      let title = metadata.title
      var slug = title
        .toLowerCase()
        .replace(/<code>/, '')
        .replace(/<\/code>/g, '')
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-')
      posts.push({ post, slug })
    }
  }

  export function load({ params }) {
    const { slug } = params
    // Find the post with the slug
    const filteredPost = posts.find((p) => {
      return (
        p.slug.toLowerCase() === slug.toLowerCase() ||
        p.slug.toLowerCase() === slug.toLowerCase() + '.html' ||
        p.slug.toLowerCase() + '.html' === slug.toLowerCase()
      )
    })
    return {
      props: {
        page: filteredPost.post.default,
      },
    }
  }
</script>

<script>
  export let page
</script>

<svelte:component this={page} />
