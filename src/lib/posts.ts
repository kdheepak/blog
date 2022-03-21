import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'
import { encode } from 'html-entities'

export function getPostsMetadata(startPath: string) {
  const posts = []
  const files = fs.readdirSync(startPath)
  for (let i = 0; i < files.length; i++) {
    const filename = path.join(startPath, files[i])
    const stat = fs.lstatSync(filename)
    if (stat.isDirectory()) {
      continue
    } else if (filename.indexOf('.md') >= 0) {
      const doc = fs.readFileSync(filename, 'utf8')
      const { data: metadata } = matter(doc)
      if (!metadata.slug) {
        metadata.slug = metadata.title
          .toString()
          .toLowerCase()
          .replace(/<code>/, '')
          .replace(/<\/code>/g, '')
          .replace(/[^\w ]+/g, '')
          .replace(/ +/g, '-')
      }
      metadata.slug = encode(metadata.slug)
      metadata.title = encode(metadata.title)
      if (metadata.date) {
        posts.push(metadata)
      }
    }
  }
  return posts
    .sort((a, b) => {
      return new Date(a.date) - new Date(b.date)
    })
    .reverse()
}
