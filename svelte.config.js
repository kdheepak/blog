import adapter from '@sveltejs/adapter-static'
import preprocess from 'svelte-preprocess'
import child_process from 'child_process'
import path from 'path'

import svelteMd from "vite-plugin-svelte-md";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.md'],

  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [preprocess({ preserve: ['module'] })],

  kit: {
    adapter: adapter(),
    // hydrate the <div id="svelte"> element in src/app.html
    target: '#svelte',
    vite: {
      plugins: [
        svelteMd(),
      ],
    }
  },
}

export default config
