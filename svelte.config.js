import adapter from '@sveltejs/adapter-static'
import preprocess from 'svelte-preprocess'
import child_process from 'child_process'
import path from 'path'

import { unified } from 'unified'
import rehypeParse from 'rehype-parse'
import rehypeRaw from 'rehype-raw'
import rehypeRemark from 'rehype-remark'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import remarkMath from 'remark-math'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypePrism from 'rehype-prism-plus'

import { visit } from 'unist-util-visit'

import { parse as tokenizeWords } from 'space-separated-tokens'

import xtend from 'xtend'
import toHTML from '@starptech/prettyhtml-hast-to-html'
import { findAndReplace } from 'hast-util-find-and-replace'

function prettyHtmlStringify (config) {
  var settings = xtend(config, this.data('settings'))

  this.Compiler = compiler

  function compiler (tree) {
    return toHTML(tree, settings)
  }
}

function copyFrontmatter () {
  return function transformer (tree, file) {
    visit(tree, 'yaml', function (node) {
      file.data.frontmatter = node.data.parsedValue
    })
  }
}

function customComponent () {
  return function transformer (tree) {
    visit(tree, function (node) {
      if (node.type === 'element' && node.tagName === 'counter') {
        node.tagName = "Counter"
      }
    })
  }
}

const entites = [
  [/{/g, "{'{'}"],
  [/}/g, "{'}'}"],
];

const escape_entities = (node) => {
    for (let i = 0; i < entites.length; i += 1) {
        node.value = node.value.replace(entites[i][0], entites[i][1]);
    }
    console.log(node)
}

function escapeCurlies () {
  return function (tree) {
    visit(tree, function (node) {
      if (node.type === 'element' && (node.tagName === 'code' || node.tagName === 'math')) {
        console.log(node)
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
    '--mathjax',
    '--no-highlight',
    '--section-divs',
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
          .use(rehypePrism)
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
        console.log(html)
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
  preprocess: [ pandocRemarkPreprocess(), preprocess({ preserve: ['module'] })],

  kit: {
    adapter: adapter(),
    // hydrate the <div id="svelte"> element in src/app.html
    target: '#svelte',
    vite: {
      optimizeDeps: {
        include: ['highlight.js/lib/core'],
      },
    },
  },
}

export default config
