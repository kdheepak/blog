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
npm install -D @tailwindcss/forms
npm install -D svelte-fa
npm install -D @fortawesome/free-solid-svg-icons@5.15.4 @fortawesome/free-regular-svg-icons@5.15.4 @fortawesome/free-brands-svg-icons@5.15.4
npm install layercake
npm uninstall @sveltejs/adapter-auto
npm install @sveltejs/adapter-static@next -D
npm install tw-elements
```
