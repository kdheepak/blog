import fs from 'fs'
import mi from 'markdown-it'
import prism from 'markdown-it-prism'
import matter from 'gray-matter'
import path from 'path';
import child_process from 'child_process'

function buffer2string(bufferString) {
  const hex = bufferString.match(/\s[0-9a-fA-F]+/g).map((x) => x.trim())
  return Buffer.from(hex.join(''), 'hex').toString()
}

function pandoc(input, ...args) {
  const option = [
    '-t',
    'html',
    '--lua-filter',
    './scripts/svelte-math.lua',
    '--filter',
    'pandoc-eqnos',
    '--filter',
    'pandoc-fignos',
    '--filter',
    'pandoc-tablenos',
    '--citeproc',
  ].concat(args)
  let pandoc
  input = Buffer.from(input)
  try {
    pandoc = child_process.spawnSync('pandoc', option, { input, timeout: 20000 })
  } catch (err) {
  }
  if (pandoc.stderr && pandoc.stderr.length) {
  }
  var content = pandoc.stdout.toString()

  input = Buffer.from(input)
  try {
    pandoc = child_process.spawnSync('pandoc', ['--template', './scripts/meta-json.tpl'], {
      input,
      timeout: 20000,
    })
  } catch (err) {
  }
  if (pandoc.stderr && pandoc.stderr.length) {
  }
  var metadata = JSON.parse(pandoc.stdout.toString())
  return { content, metadata }
}

async function fromDir(startPath, filter) {
  const slugs = {};
  var files=fs.readdirSync(startPath);
  for(var i=0;i<files.length;i++){
      var filename=path.join(startPath,files[i]);
      var stat = fs.lstatSync(filename);
      if (stat.isDirectory()){
        continue
      }
      else if (filename.indexOf(filter)>=0) {
        // markdown file
        const doc = await fs.promises.readFile(filename, 'utf8')
        const { data: metadata, content } = matter(doc)
        const commit = child_process.spawnSync('git', ['log', '-n', '1', '--pretty=format:%H' ,'--', `${filename}`]).stdout.toString()
        metadata.source = `https://github.com/kdheepak/blog/blob/${commit}/${filename}`
        if (metadata.slug) {
          slugs[metadata.slug] = { metadata, content }
        } else {
          slugs[metadata.title.toString()
                .toLowerCase()
                .replace(/<code>/, '')
                .replace(/<\/code>/g, '')
                .replace(/[^\w ]+/g, '')
                .replace(/ +/g, '-')] =  { metadata, content }
        }
      };
  };
  return slugs
};

const md = mi({
  html: true,
  linkify: true,
  typographer: true
})

// Remember old renderer, if overridden, or proxy to default renderer
const defaultRender =
  md.renderer.rules.link_open ||
  function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options)
  }

md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  // If you are sure other plugins can't add `target` - drop check below
  // const aIndex = tokens[idx].attrIndex('target')
  // if (aIndex < 0) {
  // 	tokens[idx].attrPush(['target', '_blank']) // add new attribute
  // } else {
  // 	tokens[idx].attrs[aIndex][1] = '_blank' // replace value of existing attr
  // }

  // const relIndex = tokens[idx].attrIndex('rel')
  // if (relIndex < 0) {
  // 	tokens[idx].attrPush(['rel', 'noopener noreferrer'])
  // } else {
  // 	tokens[idx].attrs[relIndex][1] = 'noopener noreferrer'
  // }

  // console.log(tokens[idx])
  const href = tokens[idx].attrs[tokens[idx].attrIndex('href')][1]
  // console.log(href)

  if (href.startsWith('http')) {
    tokens[idx].attrPush(['rel', 'noopener noreferrer'])
    tokens[idx].attrPush(['target', '_blank'])
    tokens[idx].attrPush(['class', 'external-link'])
  }

  // pass token to default renderer.
  return defaultRender(tokens, idx, options, env, self)
}

md.use(prism, {})

export async function get({ params }) {
  const { slug } = params
  const slugs = await fromDir('src/posts/','.md');
  const s = slug.replace(path.parse(slug).ext, "")
  if (slugs[s] !== undefined) {
    const {metadata, content} = slugs[s]
    const html = md.render(content)

    return {
      body: JSON.stringify({ html, metadata })
    }
  }
}
