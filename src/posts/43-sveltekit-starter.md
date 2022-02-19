---
title: Sveltekit tailwind starter
date: 2022-02-18T22:03:31-06:00
tags: svelte
keywords: svelte, sveltekit, tailwind, fontawesome, starter
summary: Minimal starter using sveltekit tailwind and fontawesome
---

The following is minimal instructions for getting started with the SvelteKit skeleton app, with tailwind and font awesome support

```bash
npm install -g pnpm # install pnpm
pnpm add -g pnpm    # upgrade pnpm

mkdir project && cd project

npm init svelte@next
npx svelte-add@latest tailwindcss
pnpm install
pnpm install -D @fortawesome/free-solid-svg-icons@5.15.4 @fortawesome/free-regular-svg-icons@5.15.4 @fortawesome/free-brands-svg-icons@5.15.4
```
