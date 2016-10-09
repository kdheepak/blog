from bs4 import BeautifulSoup, Tag


def process_content(content, font_awesome=False):

    content = wrap_tag('h1', content, font_awesome)
    content = wrap_tag('h2', content, font_awesome)
    content = wrap_tag('h3', content, font_awesome)
    content = wrap_tag('h4', content, font_awesome)
    content = wrap_tag('h5', content, font_awesome)
    content = wrap_tag('h6', content, font_awesome)

    return content


def wrap_tag(tag, content, font_awesome=False):
    soup = BeautifulSoup(content, 'html.parser')
    header_tags = soup.findAll(tag)
    for header in header_tags:
        if header.has_attr('id'):
            h = Tag(soup, name=tag, attrs=header.attrs)
            a = Tag(soup, name='a', attrs={'href': '#{}'.format(header.attrs['id'])})
            a.contents = header.contents
            header.replaceWith(h)
            h.insert(0, a)
            if font_awesome:
                icon = BeautifulSoup("""<i class="fa fa-hashtag" aria-hidden="true"></i>""", 'html.parser')
                h.insert(0, icon)
    content = unicode(soup)
    return content

