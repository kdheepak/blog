import adapter from '@sveltejs/adapter-static'
import preprocess from 'svelte-preprocess'
import child_process from 'child_process'
import path from 'path'

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
    // console.error(option, input, err)
  }
  if (pandoc.stderr && pandoc.stderr.length) {
    // console.log(option, input, Error(pandoc.output[2].toString()))
  }
  var content = pandoc.stdout.toString()

  input = Buffer.from(input)
  try {
    pandoc = child_process.spawnSync('pandoc', ['--template', './scripts/meta-json.tpl'], {
      input,
      timeout: 20000,
    })
  } catch (err) {
    // console.error(option, input, err)
  }
  if (pandoc.stderr && pandoc.stderr.length) {
    // console.log(option, input, Error(pandoc.output[2].toString()))
  }
  var metadata = pandoc.stdout.toString()
  content = `${content}

    <script context="module">
        export function getMetadata() {
            return ${metadata}
        }
    </script>`
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
  },
}

export default config
