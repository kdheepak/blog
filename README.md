# blog

<https://blog.kdheepak.com>

## Install

```bash
npm install
pdm install
cargo install svgbob
cargo install stork-search --locked
```

Other requirements:

- pandoc
- latex
- svgbob

## Developing

Once you've created a project and installed dependencies with `npm install`, start a development server:

```bash
pdm run npm run dev

# or start the server and open the app in a new browser tab
pdm run npm run dev -- --open
```

## Building

To create a production version:

```bash
pdm run npm run build
```

You can preview the production build with `pdm run npm run preview`.

## Deploy

To deploy:

```bash
pdm run npm run deploy
```
