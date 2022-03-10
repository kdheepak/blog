---
title: Sveltekit tailwind starter
date: 2022-02-18T22:03:31-06:00
tags: svelte
keywords: svelte, sveltekit, tailwind, fontawesome, layercake, starter
summary: Minimal starter using sveltekit tailwind and fontawesome
---

The following is minimal instructions for getting started with the SvelteKit skeleton app, with tailwind and font awesome support

```bash
mkdir project && cd project

npm init svelte@next
npx svelte-add@latest tailwindcss
npm install
npm install -D @tailwindcss/forms svelte-fa @fortawesome/free-solid-svg-icons@5.15.4 @fortawesome/free-regular-svg-icons@5.15.4 @fortawesome/free-brands-svg-icons@5.15.4 @sveltejs/adapter-static@next
npm install layercake tw-elements
npm uninstall @sveltejs/adapter-auto
```

Change `tailwind.config.js` to the following:

```js
module.exports = {
  content: ['./src/**/*.{html,js}', './node_modules/tw-elements/dist/js/**/*.js'],
  plugins: [
    require('tw-elements/dist/plugin')
  ]
}
```

Update `__layout.svelte` to include the following:


```svelte
<script lang="ts">
  import '../app.css';
  import { browser } from '$app/env'
  import { onMount } from 'svelte'
  onMount(async () => {
    if (browser) {
      await import('tw-elements')
    }
  })
</script>
```
