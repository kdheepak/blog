---
title: Jupyter Notebook, Reveal.js and Github Pages
category: blog
date: Sat Dec 5 13:03:54 MST 2015
tags: reveal.js, github pages
keywords: ipython, ipython notebook, jupyter, jupyter notebook, reveal.js, github pages, presentations
slug: jupyter-notebook-reveal-js-and-github-pages
---

Jupyter Notebook has the ability to convert an notebook `ipynb` to markdown, rst, html and interestingly slides.
And these Reveal.js powered slides can be hosted on GitHub pages, like any other html page.
The following steps works well for me to generate a static set of slides from a notebook that can be used as a presentation

* Save the ipython notebook as index.ipynb.
* Fork reveal.js to your GitHub account.
* Push the `master` branch into the `gh-pages` branch. This is necessary because we want to use a single reveal.js repository to link to from the GitHub pages slideshow. Alternatively, you can clone reveal.js into your repository where the slideshow / presentation exists.
* Use the following script to convert the notebook to `index.slides.html`
```bash
ipython nbconvert index.ipynb --to slides --reveal-prefix ../reveal.js
```
If you did not Fork reveal.js and force update master to origin/gh-pages, and instead cloned `reveal.js` to this folder, you can add it as a submodule and use the following instead
```bash
ipython nbconvert index.ipynb --to slides --reveal-prefix reveal.js
```
* Rename `index.slides.html` to `index.html`
* Push your changes to a repository

You can find an example [here](https://kdheepak.com/jupyter-notebook) and the original notebook [here](https://github.com/kdheepak/jupyter-notebook).

