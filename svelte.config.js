import adapter from '@sveltejs/adapter-static'
import preprocess from 'svelte-preprocess'
import child_process from 'child_process'
import path from 'path'

function pandoc(input, ...args) {
  const option = [
    '-t',
    'html',
    '--mathml',
    '--filter',
    'pandoc-eqnos',
    '--filter',
    'pandoc-fignos',
    '--filter',
    'pandoc-tablenos',
    '--citeproc',
    '--lua-filter',
    './scripts/fix-image-links.lua',
  ].concat(args)
  let pandoc
  input = Buffer.from(input)
  try {
    pandoc = child_process.spawnSync('pandoc', option, { input, timeout: 20000 })
  } catch (err) {
    console.error(option, input, err)
  }
  if (pandoc.stderr && pandoc.stderr.length) {
    // console.log(option, input, Error(pandoc.output[2].toString()))
  }
  var content = pandoc.stdout
    .toString()
    .replace(/\{/g, '&lbrace;')
    .replace(/\}/g, '&rbrace;')
    .replace(/\$/g, '&dollar;')
  return content
}

function pandoc2svelte() {
  return {
    markup({ content, filename }) {
      if (!path.extname(filename).startsWith('.md')) return
      let c = pandoc(content)
      return { code: c }
    },
  }
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.md'],

  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [pandoc2svelte(), preprocess({ preserve: ['module'] })],

  kit: {
    adapter: adapter(),
    // hydrate the <div id="svelte"> element in src/app.html
    target: '#svelte',
    vite: {},
  },
}

export default config
