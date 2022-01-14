import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'
import { encode } from 'html-entities'

export async function getPostsMetadata(startPath: string) {
  const posts = []
  var files = fs.readdirSync(startPath)
  for (var i = 0; i < files.length; i++) {
    var filename = path.join(startPath, files[i])
    var stat = fs.lstatSync(filename)
    if (stat.isDirectory()) {
      continue
    } else if (filename.indexOf('.md') >= 0) {
      const doc = await fs.promises.readFile(filename, 'utf8')
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
      metadata.summary = encode(metadata.summary)
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
