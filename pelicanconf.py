#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

AUTHOR = u'Dheepak Krishnamurthy'
SITENAME = u'Blog'
SITEURL = ''

PATH = 'content'

TIMEZONE = 'America/Denver'

DEFAULT_LANG = u'en'

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

DEFAULT_PAGINATION = 10

LOAD_CONTENT_CACHE = False
CACHE_CONTENT = False

# Plugins and extensions
NOTEBOOK_DIR = 'notebooks'
MD_EXTENSIONS = ['codehilite(css_class=highlight, linenums=False)', 'extra', 'headerid',
                'toc(permalink=true)']

PLUGIN_PATHS = ['pelican-plugins']

PLUGINS = ['pelican_pandoc']

SITEMAP = {
    'format': 'xml',
    'priorities': {
        'articles': 0.5,
        'indexes': 0.5,
        'pages': 0.5
    },
    'changefreqs': {
        'articles': 'monthly',
        'indexes': 'daily',
        'pages': 'monthly'
    }
}


# Blog specific settings
STATIC_PATHS = ['blog', 'theme/images', 'images', 'downloads', 'extra/CNAME']
EXTRA_PATH_METADATA = {'extra/CNAME': {'path': 'CNAME'},}

ARTICLE_EXCLUDES = ['downloads', 'drafts', 'notebooks']


SITEMAP = {
    'format': 'xml',
    'priorities': {
        'articles': 0.5,
        'indexes': 0.5,
        'pages': 0.5
    },
    'changefreqs': {
        'articles': 'monthly',
        'indexes': 'daily',
        'pages': 'monthly'
    }
}

import os

# This header file is automatically generated by the notebook plugin
if not os.path.exists('_nb_header.html'):
    import warnings
    warnings.warn("_nb_header.html not found.  "
                  "Rerun make html to finalize build.")
else:
    EXTRA_HEADER = open('_nb_header.html').read().decode('utf-8')

# Appearance
TYPOGRIFY = False
DEFAULT_PAGINATION = False

# Defaults
DEFAULT_CATEGORY = 'Miscellaneous'
USE_FOLDER_AS_CATEGORY = False

# put articles (posts) in blog/
ARTICLE_URL = '{slug}.html'
ARTICLE_SAVE_AS = '{slug}.html'

PAGE_URL = '{category}/{slug}.html'
PAGE_SAVE_AS = '{category}/{slug}.html'

# Feeds
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None

############################################################################

# Pelican-Smoothie customization

THEME = 'pelican-themes/pelican-smoothie/'

# Disqus

DISQUS_SITENAME = "kdheepak89"

# COVER_IMG = "images/covers/red.png"
AVATAR_IMG = "images/avatarPicture.jpg"
SITE_TITLE_LABEL = "Dheepak Krishnamurthy"
SITE_SUBTITLE_LABEL = "Engineer & Tinkerer."
SUMMARY_MAX_LENGTH = 5

STATIC_PATHS = ['blog', 'theme/images', 'images', 'downloads', 'extra/CNAME']
EXTRA_PATH_METADATA = {'extra/CNAME': {'path': 'CNAME'},}

DIRECT_TEMPLATES = (('index', 'archives', 'search', '404'
    ))

BLOG_URL = 'blog/index.html'
BLOG_SAVE_AS = 'blog/index.html'

TAG_SAVE_AS = ''
AUTHOR_SAVE_AS = ''
CATEGORY_SAVE_AS = ''

# SMO
TWITTER_USERNAME = u'kdheepak89'

# Legal
SITE_LICENSE = u'<div xmlns:cc="https://creativecommons.org/ns#" xmlns:dct="https://purl.org/dc/terms/" about="https://kdheepak.com/"> All content by Dheepak Krishnamurthy on this page is licensed under a <a rel="license" href="https://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>.</div>'

# SEO
SITE_DESCRIPTION = u'My name is Dheepak Krishnamurthy. This is my personal blog.'

LANDING_PAGE_ABOUT = {'title': 'I’m an engineer.',
'details': """<div itemscope itemtype="https://schema.org/Person"><p>My name is <span itemprop="name">Dheepak Krishnamurthy</span>. I’ve dabbled with mobile application and web development, home automation and photography. I’m currently working towards a Master’s degree in Electrical Engineering.
</p><p>
<img src="images/coverPicture.jpg" alt="Alt text! And a picture of me!" style="width:100%">
</p><p>
My dream is that one day I’d have travelled to every country in the world (Four down, 192 to go!). I love watching movies and having discussions with friends about them. I’ve been on the seemingly never ending quest of completing IMDb’s top 250 movies of all time (An embarrassingly small 91 down, 159 to go). I love reading books and comic books.
 If you find anything interesting, feel absolutely free to get in touch with me.
</p></div>"""}

# Social
SOCIAL = { 'Twitter': 'https://twitter.com/kdheepak89',
        'Github': 'https://github.com/kdheepak',
        'Email': 'mailto:me@kdheepak.com',
        'GooglePlus': 'https://plus.google.com/+DheepakKrishnamurthy/posts'}

# Projects
PROJECTS = [{ 'link': 'https://kdheepak.com/psst', 'name' : 'PSST' },
            { 'link': 'https://kdheepak.com/think-git', 'name' : 'think-git' },
            { 'link': 'https://github.com/kdheepak/c3.py', 'name' : 'c3.py' },]


# Google and Mixpanel Analytics

GOOGLE_ANALYTICS = 'UA-47173621-1'
MIXPANEL_ANALYTICS = "e36b00b2053ec1228c81cca16622581f"

# Comments introduction
COMMENTS_INTRO = "Let me know what you think below."

PUBLICATIONS_SRC = 'content/blog.bib'

PANDOC_FILES = ['txt', 'md']
PANDOC_ARGS = [
  '--mathjax',
  '--smart',
  '--toc',
  '--toc-depth=2',
  '--template=pandoc-templates/default.html5',
  # '--section-divs',
  # '--number-sections',
  '--bibliography=content/blog.bib',
  '--filter=pandoc-eqnos',
  '--filter=pandoc-fignos',
  '--filter=pandoc-tablenos',
  '--filter=./fix-latex-symbol.py',
  '--filter=./remove_ieeekeywords.py',
  '--csl=ieee.csl',
  '--metadata',
  'link-citations=true',
]

PANDOC_EXTENSIONS = [
  #'+hard_line_breaks',
]
