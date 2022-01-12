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
import rehypeKatex from 'rehype-katex'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypePrism from '@mapbox/rehype-prism'
import rehypePresetMinify from 'rehype-preset-minify'
import inlineSVG from '@jsdevtools/rehype-inline-svg'

import julia from 'highlight.js/lib/languages/julia'
import juliaRepl from 'highlight.js/lib/languages/julia-repl'
import vim from 'highlight.js/lib/languages/vim'
import diff from 'highlight.js/lib/languages/diff'
import latex from 'highlight.js/lib/languages/latex'
import wasm from 'highlight.js/lib/languages/wasm'
import llvm from 'highlight.js/lib/languages/llvm'
import dockerfile from 'highlight.js/lib/languages/dockerfile'
import nim from 'highlight.js/lib/languages/nim'
import matlab from 'highlight.js/lib/languages/matlab'
import cmake from 'highlight.js/lib/languages/cmake'
import gams from 'highlight.js/lib/languages/gams'

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
          .use(rehypeKatex)
          .use(rehypePrism)
          // .use(rehypeHighlight, {
          //   languages: {
          //     julia,
          //     matlab,
          //     cmake,
          //     gams,
          //     nim,
          //     wasm,
          //     vim,
          //     diff,
          //     latex,
          //     dockerfile,
          //     llvm,
          //     'julia-repl': juliaRepl
          //   }
          // })
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
