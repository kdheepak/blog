import adapter from '@sveltejs/adapter-static'
import preprocess from 'svelte-preprocess'
import child_process from 'child_process'
import path from 'path'

import { unified } from 'unified'
import rehypeParse from 'rehype-parse'
import rehypeStringify from 'rehype-stringify'
import rehypeMathjaxSvg from 'rehype-mathjax'
import rehypePrism from '@mapbox/rehype-prism'
import importAssets from 'svelte-preprocess-import-assets'

import { visit } from 'unist-util-visit'

import { findAndReplace } from 'hast-util-find-and-replace'

function customComponent () {
  return function transformer (tree) {
    visit(tree, 'element', function (node) {
      if (node.tagName === 'counter') {
        node.tagName = "Counter"
      }
    })
  }
}

function fullWidthFigures () {
  return function transformer (tree) {
    visit(tree, 'element', function (node) {
      if (node.tagName === 'figure') {
        for (const child of node.children) {
          if (child.tagName === 'img') {
            if (child.properties["className"] !== undefined) {
              node.properties["className"] = child.properties["className"]
            }
          }
        }
      }
    })
  }
}

function mathJaxSetup() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName == "span" && node.properties["className"] !== undefined && node.properties["className"].includes('math')) {
        if (node.properties["className"].includes("display")) {
          node.properties["className"].push("math-display")
          for (const child of node.children) {
            child.value = child.value.replace("\\[", "").replace("\\]", "")
          }
        }
        if (node.properties["className"].includes("inline")) {
          node.properties["className"].push("math-inline")
          for (const child of node.children) {
            child.value = child.value.replace("\\(", "").replace("\\)", "")
          }
        }
      }
    })
  }
}

function escapeCurlies () {
  return function (tree) {
    visit(tree, 'element', function (node) {
      if (node.tagName === 'code' || node.tagName === 'math' || (node.tagName == "span" && node.properties["className"] !== undefined && node.properties["className"].includes('math'))) {
        findAndReplace(node, {
          '&': '&#38;',
          '{': '&#123;',
          '}': '&#125;',
          '"': '&#34;',
          "'": '&#39;',
          '<': '&#60;',
          '>': '&#62;',
          '`': '&#96;'
        }, {
          ignore: ['title', 'script', 'style']
        })
      }
    })
  }
}

function pandoc(input, ...args) {
  const option = [
    '-t',
    'html',
    '--email-obfuscation', 'javascript', '--shift-heading-level=0',
    '--no-highlight',
    '--section-divs',
    '--mathjax',
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
    './scripts/fix-image-links.lua',
    '--lua-filter',
    './scripts/render-svgbob.lua',
    '--lua-filter',
    './scripts/ref-section-level.lua',
    '--lua-filter',
    './scripts/links-target-blank.lua',
    '--lua-filter',
    './scripts/section-prefix.lua',
    '--lua-filter',
    './scripts/sidenote.lua',
    '--lua-filter',
    './scripts/standard-code.lua',
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
  var content = pandoc.stdout
    .toString()
  return content
}

function pandocRemarkPreprocess() {
  return {
      markup: async ({ content, filename }) => {
        if (!path.extname(filename).startsWith('.md')) {
          return
        }
        let c = pandoc(content)
        const markdown2svelte = unified()
          .use(rehypeParse, {fragment: true, emitParseErrors: true})
          .use(mathJaxSetup)
          .use(rehypeMathjaxSvg)
          .use(rehypePrism, {ignoreMissing: true})
          .use(fullWidthFigures)
          .use(escapeCurlies)
          .use(customComponent)
          .use(rehypeStringify, {allowDangerousHtml: false})
        const result = await markdown2svelte()
          .process(c)
        const html = result.toString()
                      .replace(/&#x26;#34;/g,  '&#34;')
                      .replace(/&#x26;#38;/g,  '&#38;')
                      .replace(/&#x26;#123;/g, '&#123;')
                      .replace(/&#x26;#125;/g, '&#125;')
                      .replace(/&#x26;#34;/g,  '&#34;')
                      .replace(/&#x26;#39;/g,  '&#39;')
                      .replace(/&#x26;#60;/g,  '&#60;')
                      .replace(/&#x26;#62;/g,  '&#62;')
                      .replace(/&#x26;#96;/g,  '&#96;')
        return {
          code: `${html}`,
          map: ''
        }
      },
      script: () => {},
      style: () => {}
    }
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.md'],

  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [ pandocRemarkPreprocess(), preprocess() ],

  kit: {
    adapter: adapter(),
    // hydrate the <div id="svelte"> element in src/app.html
    target: '#svelte',
  },
}

export default config
