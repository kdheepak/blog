---
title: Sveltekit tailwind starter
date: 2022-02-18T22:03:31-06:00
tags: svelte
keywords: svelte, sveltekit, tailwind, fontawesome, layercake, starter
summary: Minimal starter using sveltekit tailwind and fontawesome
---

The following is minimal instructions for getting started with the SvelteKit skeleton app, with tailwind and font awesome support.
Run the following and follow prompts:

```bash
npm init svelte@next
npx svelte-add@latest tailwindcss
npx svelte-add@latest scss
npx svelte-add@latest postcss
```

Install all the following packages:

```bash
npm install
npm install -D @tailwindcss/forms
npm install -D tailwindcss/typography
npm install -D svelte-icons
npm install -D @fortawesome/free-solid-svg-icons@5.15.4
npm install -D @fortawesome/free-regular-svg-icons@5.15.4
npm install -D @fortawesome/free-brands-svg-icons@5.15.4
npm install -D @sveltejs/adapter-static@next
npm install layercake
npm install tw-elements
npm install d3
```

Add the following to `.prettierrc`:

```json
{
  "useTabs": false,
  "quoteProps": "preserve",
  "singleQuote": false,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "bracketSameLine": false,
  "bracketSpacing": true
}
```

And run the following to format all files:

```bash
prettier . --write --ignore-path .gitignore
```

### `tailwind-elements`

If you want to add `tailwind-elements`, change `tailwind.config.js` to the following:

```javascript
const config = {
  content: ["./src/**/*.{html,js,svelte,ts}", "./node_modules/tw-elements/dist/js/**/*.js"],

  theme: {
    extend: {},
  },

  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("tw-elements/dist/plugin"),
  ],
};

module.exports = config;
```

And update `__layout.svelte` to include the following:

```svelte
<script lang="ts">
  import "../app.css";
  import { browser } from "$app/env";
  import { onMount } from "svelte";
  onMount(async () => {
    if (browser) {
      await import("tw-elements");
    }
  });
</script>
```
