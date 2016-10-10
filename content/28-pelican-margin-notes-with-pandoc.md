---
title: Pelican Margin Notes with Pandoc
date: Sun Oct  9 17:42:12 MDT 2016
tags: pelican, pandoc, python
summary: Notes on getting margin notes to work
keywords: python, pelican, pandoc, margin notes, side notes
slug: pelican-margin-notes-with-pandoc
category: blog
alias: /blog/pelican-margin-notes-with-pandoc
references:
- id: johnjameson
  author:
  - family: Jameson
    given: J.
  title: Responsive Sidenotes
  URL: https://johndjameson.com/blog/responsive-sidenotes/
- id: jgruber
  author:
  - family: Gruber
    given: J.
  title: Notes on notes
  URL: http://daringfireball.net/2005/08/notes_on_notes
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
exactly that. There is in fact a collection of [pelican-plugins](https://github.com/getpelican/pelican-plugins). Their maintainer `@justinmayer` is also very responsive to feature requests and pull requests.

And, on the rare occasion that you can't find a plugin that does exactly what you want it to, you'll be able (with a little bit of research) to create a plugin to do exactly just that. Their documentation is pretty good too.
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
that does just that]. So, the short version is that this implementation of margin notes employs Pandoc, filters with Pandoc using the [`pandocfilters` package](https://github.com/jgm/pandocfilters) and this theme.

# Inspiration

A list of blogs, posts, websites, web books have inspired this implementation. Most notably, [tuftle-css](https://edwardtufte.github.io/tufte-css/) and [this article](https://medium.com/@owenblacker/marginal-notes-on-medium-268b3f727e6d#.97mvo08w5) published on Medium about Medium sidenotes speak to some length on how margin notes can be used to improve the experience for a reader, especially on the web.
[Butterick’s Practical Typography](http://practicaltypography.com/)^[__aside__: I highly recommend reading the web book freely available at Practical Typography. It's challenged me to think critically about every aspect of a presentation. I also encourage buying his book or his fonts to aid Butterick in maintaining this content and/or producing more.] also is a great example of effective use of margin notes.
There are a few other articles [@johnjameson;@jgruber] that talk about this and I've added citations to these articles below in case you are interested.
The CSS for this page and the CSS for the margin notes have been heavily inspired by [gameprogrammingpatterns.com](http://gameprogrammingpatterns.com/).

# Implementation

At the time of writing this article, Pandoc does not support creating margin notes for HTML documents.
Pandoc does however support [footnotes](http://pandoc.org/MANUAL.html#footnotes) in the form of footnotes and inline notes.
Inline notes are different for traditional footnotes in the source document. The following is an example of footnotes in Pandoc Markdown.

```markdown

Here is a footnote reference,[^1] and another.[^longnote]

[^1]: Here is the footnote.

[^longnote]: Here's one with multiple blocks.

    Subsequent paragraphs are indented to show that they
belong to the previous footnote.

        { some.code }

    The whole paragraph can be indented, or just the first
    line.  In this way, multi-paragraph footnotes work like
    multi-paragraph list items.

This paragraph won't be part of the note, because it
isn't indented.

```

The following is an example of inline footnotes in Pandoc Markdown

```markdown
Here is an inline note.^[Inlines notes are easier to write, since
you don't have to pick an identifier and move down to type the
note.]
```

As described in the example, inline notes are easier to write.
Pandoc also conveniently also supports filters.
They allow for additional functionality to be added by walking through the Abstract Syntax Tree, and parsing or modifying information.
I chose the following syntax for implementing a `aside` tag when converting from a Markdown file to a HTML document.

```markdown
This is an example for the syntax^[__aside__: This is a note that will appear in a tag] in Markdown.
```

When run through the filter, the above will be rendered as the following html.

```html
<p>This is an example for the syntax<span id='aside-0'></span> in Markdown.</p>
<div id='div-aside-0'>
    <aside id='aside-0'>This is a note that will appear in a tag</aside>
</div>
```

The location of the footnote is replaced with a `<span>` tag, and an `<aside>` tag wrapped in a `<div>` tag is added to the end of the paragraph.
This filter will also assign `id` to the `<span>`, `<aside>` and `<div>` tags sequentially.
Additional functionally can be added here, but for now this seems to work for my purposes.

With the HTML generated with `<aside>` tags, it is now a question of assigning the right css.
This turned out to be more tricky than I originally anticipated.
The current theme uses bootstrap and the following layout to display content.

```html
<div class='row'>
    <div class='col-sm-8'></div> <div class='col-sm-4'></div>
</div>
```

Because of the way Pelican and Jinja work, and because of how Pandoc returns the content to Pelican, the entire article content
is stored in the first `<div>` element of width 8 units.
Ideally, each paragraph would be wrapped in `<div>` elements of one class, with `<aside>` elements wrapped in a neighboring div class.
With the current structure of Pelican, the only way I could do that is by injecting `<div>` elements all over the place using something like
[beautifulsoup](https://www.crummy.com/software/BeautifulSoup/).
However I decided against it for now, and am using CSS to move the `<aside>` elements outside the element they are currently positioned in.
Since the `<aside>` elements are located below the actual paragraph, I added javascript to move them up by their height.
A better implementation could use the location of the `<span>` elements to fix the position of the notes.

I'm sure there are definitely better ways to do the same thing, but this is what worked for now.
If you have thoughts on how this could be done better or would like to ask questions in general, I'm open to chatting about this.

# References
