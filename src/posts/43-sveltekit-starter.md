---
title: Sveltekit tailwind starter
date: 2022-02-18T22:03:31-06:00
tags: svelte
keywords: svelte, sveltekit, tailwind, fontawesome, layercake, starter
summary: Minimal starter using sveltekit tailwind and fontawesome
---

The following is minimal instructions for getting started with the SvelteKit skeleton app, with tailwind and font awesome support:

```bash
npm init svelte@next
npx svelte-add@latest tailwindcss
npm install
npm install -D @tailwindcss/forms
npm install -D tailwindcss/typography
npm install -D svelte-fa
npm install -D svelte-icons
npm install -D @fortawesome/free-solid-svg-icons@5.15.4
npm install -D @fortawesome/free-regular-svg-icons@5.15.4
npm install -D @fortawesome/free-brands-svg-icons@5.15.4
npm install -D @sveltejs/adapter-static@next
npm install layercake
npm install tw-elements
npm uninstall @sveltejs/adapter-auto
```

Change `tailwind.config.js` to the following:

```javascript
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/tw-elements/dist/js/**/*.js'],
  plugins: [
    require('tw-elements/dist/plugin'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

Update `__layout.svelte` to include the following:

```svelte
<script lang="ts">
  import '../app.css'
  import { browser } from '$app/env'
  import { onMount } from 'svelte'
  onMount(async () => {
    if (browser) {
      await import('tw-elements')
    }
  })
</script>
```
