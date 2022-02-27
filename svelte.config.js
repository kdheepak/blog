import preprocess from 'svelte-preprocess'
import child_process from 'child_process'
import path from 'path'
import fs from 'fs'
import matter from 'gray-matter'

import { unified } from 'unified'
import rehypeParse from 'rehype-parse'
import rehypeStringify from 'rehype-stringify'
import rehypeMathjaxSvg from 'rehype-mathjax'
import importAssets from 'svelte-preprocess-import-assets'

import adapterStatic from '@sveltejs/adapter-static'

function adapter(options) {
  const baseStatic = adapterStatic(options)
  return {
    name: 'svelte-adapter-static',
    async adapt(builder) {
      await baseStatic.adapt(builder)
    },
  }
}

const pathsBase = process.env.PATHS_BASE === undefined ? '' : process.env.PATHS_BASE

import { visit } from 'unist-util-visit'

import { findAndReplace } from 'hast-util-find-and-replace'

function getCustomComponents() {
  const components = []
  const files = fs.readdirSync('./src/lib/components/')
  for (const file of files) {
    const filename = path.join('./src/lib/components/', file)
    const stat = fs.lstatSync(filename)
    if (stat.isDirectory()) {
      continue
    } else if (filename.indexOf('.svelte') >= 0) {
      components.push(file.replace('.svelte', ''))
    }
  }
  return components
}
function customComponent() {
  const components = getCustomComponents()
  return function transformer(tree) {
    visit(tree, 'element', function (node) {
      if (components.map((c) => c.toLowerCase()).includes(node.tagName)) {
        const i = components.map((c) => c.toLowerCase()).indexOf(node.tagName)
        node.tagName = components[i]
      }
    })
  }
}

function fullWidthFigures() {
  return function transformer(tree) {
    visit(tree, 'element', function (node) {
      if (node.tagName === 'figure') {
        for (const child of node.children) {
          if (child.tagName === 'img') {
            if (child.properties['className'] !== undefined) {
              node.properties['className'] = child.properties['className']
            }
          }
        }
      }
    })
  }
}

function videoStripLink() {
  return function transformer(tree) {
    visit(tree, 'element', function (node) {
      if (node.tagName === 'video') {
        node.children = []
      }
    })
  }
}

function internalLinkMap() {
  return function transformer(tree) {
    visit(tree, 'element', function (node) {
      if (node.tagName == 'a' && node.properties.href.endsWith('.md')) {
        const doc = fs.readFileSync('./src/posts/' + node.properties.href, 'utf8')
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
        node.properties.href = '/' + metadata.slug
      }
    })
  }
}

function mathJaxSetup() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (
        node.tagName == 'span' &&
        node.properties['className'] !== undefined &&
        node.properties['className'].includes('math')
      ) {
        if (node.properties['className'].includes('display')) {
          node.properties['className'].push('math-display')
          for (const child of node.children) {
            child.value = child.value.replace('\\[', '').replace('\\]', '')
          }
        }
        if (node.properties['className'].includes('inline')) {
          node.properties['className'].push('math-inline')
          for (const child of node.children) {
            child.value = child.value.replace('\\(', '').replace('\\)', '')
          }
        }
      }
    })
  }
}

function escapeCurlies() {
  return function (tree) {
    visit(tree, 'element', function (node) {
      if (
        node.tagName === 'code' ||
        node.tagName === 'math' ||
        (node.tagName == 'span' &&
          node.properties['className'] !== undefined &&
          node.properties['className'].includes('math'))
      ) {
        findAndReplace(
          node,
          {
            '&': '&#38;',
            '{': '&#123;',
            '}': '&#125;',
            '"': '&#34;',
            "'": '&#39;',
            '<': '&#60;',
            '>': '&#62;',
            '`': '&#96;',
          },
          {
            ignore: ['title', 'script', 'style'],
          },
        )
      }
    })
  }
}

function pandoc(input, ...args) {
  const option = [
    '-t',
    'html',
    '--email-obfuscation',
    'javascript',
    '--shift-heading-level=0',
    '--no-highlight',
    '--section-divs',
    '--mathjax',
    '--filter',
    'pandoc-secnos',
    '--filter',
    'pandoc-eqnos',
    '--filter',
    'pandoc-fignos',
    '--filter',
    'pandoc-tablenos',
    '--citeproc',
    '--csl',
    './pandoc/csl.csl',
    '--metadata',
    'link-citations=true',
    '--bibliography=./pandoc/blog.bib',
    '--metadata',
    'notes-after-punctuation=false',
    '--metadata',
    'reference-section-title=References',
    '--lua-filter',
    './pandoc/render.lua',
    '--lua-filter',
    './pandoc/ref-section-level.lua',
    '--lua-filter',
    './pandoc/links-target-blank.lua',
    '--lua-filter',
    './pandoc/section-prefix.lua',
    '--lua-filter',
    './pandoc/sidenote.lua',
    '--lua-filter',
    './pandoc/standard-code.lua',
    '--lua-filter',
    './pandoc/fix-image-links.lua',
  ].concat(args)
  let pandoc
  input = Buffer.from(input)
  try {
    pandoc = child_process.spawnSync('pandoc', option, { input, timeout: 20000 })
  } catch (err) {
    console.error(option, input, err)
  }
  if (pandoc.stderr && pandoc.stderr.length) {
    console.log(option, input, Error(pandoc.output[2].toString()))
  }
  var content = pandoc.stdout.toString()
  return content
}

import { getHighlighter, BUNDLED_LANGUAGES } from 'shiki'
import rehypePrettyCode from 'rehype-pretty-code'

const options = {
  theme: {
    light: 'github-light',
    dark: 'github-dark',
  },
  getHighlighter: (options) =>
    getHighlighter({
      ...options,
      langs: [...BUNDLED_LANGUAGES],
    }),
}

function pandocRemarkPreprocess() {
  return {
    markup: async ({ content, filename }) => {
      if (!path.extname(filename).startsWith('.md')) {
        return
      }
      let c = pandoc(content)
      c = c.replaceAll(/<!--separator-->/g, ' ')
      const markdown2svelte = unified()
        .use(rehypeParse, { fragment: true, emitParseErrors: true })
        .use(mathJaxSetup)
        .use(rehypeMathjaxSvg)
        .use(rehypePrettyCode, options)
        .use(fullWidthFigures)
        .use(videoStripLink)
        .use(internalLinkMap)
        .use(escapeCurlies)
        .use(customComponent)
        .use(rehypeStringify, { allowDangerousHtml: false })
      const result = await markdown2svelte().process(c)
      const html = result
        .toString()
        .replace(/&#x26;#34;/g, '&#34;')
        .replace(/&#x26;#38;/g, '&#38;')
        .replace(/&#x26;#123;/g, '&#123;')
        .replace(/&#x26;#125;/g, '&#125;')
        .replace(/&#x26;#34;/g, '&#34;')
        .replace(/&#x26;#39;/g, '&#39;')
        .replace(/&#x26;#60;/g, '&#60;')
        .replace(/&#x26;#62;/g, '&#62;')
        .replace(/&#x26;#96;/g, '&#96;')
      return {
        code: `${html}`,
        map: '',
      }
    },
  }
}

function fromDir(startPath, filter) {
  const slugs = []
  let tags = []
  var files = fs.readdirSync(startPath)
  for (var i = 0; i < files.length; i++) {
    var filename = path.join(startPath, files[i])
    var stat = fs.lstatSync(filename)
    if (stat.isDirectory()) {
      continue
    } else if (filename.indexOf(filter) >= 0) {
      const doc = fs.readFileSync(filename, 'utf8')
      const { data: metadata } = matter(doc)
      metadata.path = filename
      metadata.htmltags = metadata.tags === undefined ? '' : metadata.tags
      metadata.htmltags = metadata.htmltags.split(',').map(s => s.trim().toLowerCase()).filter(s => s !== undefined || s !== '')
      for (const tag of metadata.htmltags.map(s => s.trim().toLowerCase()).filter(s => s !== undefined && s !== '')) {
        tags.push(tag)
      }
      if (metadata.slug) {
        slugs.push(metadata.slug)
      } else {
        slugs.push(
          metadata.title
            .toString()
            .toLowerCase()
            .replace(/<code>/, '')
            .replace(/<\/code>/g, '')
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-'),
        )
      }
    }
  }
  tags = [...new Set(tags)]
  tags.sort()
  tags = tags.filter((tag) => tag !== undefined && tag !== '')

  return {slugs, tags}
}

function debugPreprocess(message) {
  return {
    markup: async ({ content }) => {
      if (message) {
        console.log(message)
      }
      console.log(content)
      return {
        code: content,
        map: '',
      }
    },
  }
}

function getPages() {
  let pages = ['*']
  const { slugs, tags } = fromDir('src/posts/', '.md')
  for (const p of slugs) {
    pages.push(`/${p}`)
  }
  for (const t of tags) {
    pages.push(`/tags/${t}/rss.xml`)
  }
  return pages
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.md'],

  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [pandocRemarkPreprocess(), preprocess(), importAssets()],

  kit: {
    adapter: adapter(),
    paths: {
      base: pathsBase,
    },
    prerender: {
      concurrency: 4,
      crawl: true,
      entries: getPages(),
    },
  },
}

export default config
