import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'
import child_process from 'child_process'

async function fromDir(startPath, filter) {
  const posts = []
  var files = fs.readdirSync(startPath)
  for (var i = 0; i < files.length; i++) {
    var filename = path.join(startPath, files[i])
    var stat = fs.lstatSync(filename)
    if (stat.isDirectory()) {
      continue
    } else if (filename.indexOf(filter) >= 0) {
      // markdown file
      const doc = await fs.promises.readFile(filename, 'utf8')
      const { data: metadata } = matter(doc)
      const commit = child_process
        .spawnSync('git', ['log', '-n', '1', '--pretty=format:%H', '--', `${filename}`])
        .stdout.toString()
      metadata.source = `https://github.com/kdheepak/blog/blob/${commit}/${filename}`
      if (!metadata.slug) {
        metadata.slug = metadata.title
          .toString()
          .toLowerCase()
          .replace(/<code>/, '')
          .replace(/<\/code>/g, '')
          .replace(/[^\w ]+/g, '')
          .replace(/ +/g, '-')
      }
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

const posts = await fromDir('src/posts/', '.md')

export async function get() {
  return {
    body: JSON.stringify({ posts }),
  }
}
