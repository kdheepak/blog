---
title: Pelican Margin Notes with Pandoc
date: Sun Oct  9 17:42:12 MDT 2016
tags: pelican, pandoc, python
summary: Notes on getting margin notes to work
keywords: python, pelican, pandoc, margin notes, side notes
slug: pelican-margin-notes-with-pandoc
category: blog
alias: /blog/pelican-margin-notes-with-pandoc
---

# Introduction

I've been inspired by a few other blogs to consider adding margin notes to this theme.
This theme is called [Pelican-Smoothie](https://github.com/kdheepak/pelican-smoothie) and is freely available on Github.
You may have guessed from the name — this is a theme for [Pelican](https://github.com/getpelican/pelican), a static site generator powered by Python.
Pelican allows you to write posts in Markdown or RestructuredText, and convert them to beautiful looking structured websites.
There are a few advantages of using a static site generator instead of a Content Management System (CMS) like WordPress,
and I have covered it briefly in [this post](/how-to-set-up-a-pelican-blog-with-github-pages.html).
Also, since Pelican is an open source project, it is also inherently more customization.
I can almost guarantee if you think of a feature that you'd like, you'll be able to search for a plugin that does
exactly that. There is in fact a collection of [pelican-plugins](https://github.com/getpelican/pelican-plugins). Their maintainer __@justinmayer__ is also very responsive to feature requests and pull requests.

And, on the rare occasion that you can't find a plugin that does exactly what you want it to, you'll be able (with a little bit of research) to create a plugin to do exactly just that. Their documenation is pretty good too.
If you are looking at a creating a blog I highly recommend checking out Pelican^[__aside__ :
Pelican is only one of the few static site generators in Python. There are others such as [Nikola](https://github.com/getnikola/nikola),
[Lektor](https://github.com/lektor/lektor), [Cactus](https://github.com/eudicots/Cactus),
[Hyde](https://github.com/hyde/hyde) and [many more](https://www.fullstackpython.com/static-site-generator.html).
The main reason I chose Pelican was because it had a wide selection of [themes](https://github.com/getpelican/pelican-themes). There are also
other popular ones in different languages, but I haven't researched them well enough to have an opinion on them.].

That's probably not why you are reading this post though. You are probably interested in getting margin notes working on your blog too.
I'll have to caveat the following post by saying that this is a proof of concept and by no means a final stable version that you can deploy on your site.
This approach worked for me, and the reason I went down this path was because I was curious to see how far I could push my static site generation workflow.

# Setup

Firstly, I'm not using Pelican's built in reader for Markdown files, but instead am using Pandoc. I wrote a pretty long post on using
[Pandoc for academic writing](/writing-papers-with-markdown.html); I think it's safe to say that I'm a fan of Pandoc.
Pelican has better built-in support for RestructuredText, and plugins allow you to do pretty much everything you want with Markdown as your post format.
However the number of plugins required to get everything you want working quickly adds up^[__aside__ : Not that's a bad thing,
the way Pelican signals works I believe will only activate a plugin if it has to, so it doesn't slow down your deployment process.].
And as I mentioned earlier, I was curious to see how far I could push this workflow. So if you are not using Pandoc in Pelican, you will not be
able to use this theme with margin notes straight away^[You will still be able to use this theme, either with Pandoc or Pelican's default readers,
however as you might see later in the post, I use `aside` tag elements for side notes or margin notes and I haven't been able to find a plugin
that does just that]. So, the short version is that this implementation of margin notes employs Pandoc and my theme.

# Inspiration

List of blogs, posts, websites, web books that have inspired this implementation to be updated.
