import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'
import child_process from 'child_process'

function readingTime(post, metadata) {
  const WORDS_PER_MINUTE = 200
  //Matches words
  //See
  //https://regex101.com/r/q2Kqjg/6
  const regex = /\w+/g
  const wordCount = (post || "").match(regex).length
  metadata.readingTime = Math.ceil(wordCount / WORDS_PER_MINUTE)
}

async function fromDir(startPath, filter) {
  const slugs = {}
  const files = fs.readdirSync(startPath)
  for (let i = 0; i < files.length; i++) {
    const filename = path.join(startPath, files[i])
    const stat = fs.lstatSync(filename)
    if (stat.isDirectory()) {
      continue
    } else if (filename.indexOf(filter) >= 0) {
      const doc = await fs.promises.readFile(filename, 'utf8')
      const { data: metadata, content } = matter(doc)
      const commit = child_process
        .spawnSync('git', ['log', '-n', '1', '--pretty=format:%H', '--', `${filename}`])
        .stdout.toString()
      metadata.source = `https://github.com/kdheepak/blog/blob/${commit}/${filename}`
      metadata.path = filename
      metadata.htmltags = metadata.tags === undefined ? '' : metadata.tags
      metadata.htmltags = metadata.htmltags.split(',').map(s => s.trim().toLowerCase()).filter(s => s !== undefined && s !== '')
      readingTime(content, metadata)
      if (metadata.slug) {
        slugs[metadata.slug] = { metadata, content }
      } else {
        slugs[
          metadata.title
            .toString()
            .toLowerCase()
            .replace(/<code>/, '')
            .replace(/<\/code>/g, '')
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-')
        ] = { metadata, content }
      }
    }
  }
  return slugs
}

export async function get({ params }) {
  const { slug } = params
  const slugs = await fromDir('src/posts/', '.md')
  const s = slug.replace(path.parse(slug).ext, '')
  if (slugs[s] !== undefined) {
    const { metadata } = slugs[s]
    return {
      body: { metadata },
    }
  }
}
