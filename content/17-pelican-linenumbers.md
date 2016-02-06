Title:How to add line numbers for code blocks in Pelican
Category:blog
Date: Aug 18 02:00:00 MDT 2015
Modified: Sun Sep 20 10:01:48 MDT 2015
Tags:pelican
Keywords:How to add line numbers for code blocks in Pelican
Summary:Brief tutorial on adding the right css for getting line numbering for code blocks in pelican ...
Alias:/blog/how-to-add-line-numbers-for-code-blocks-in-pelican/

Update : I've removed line numbers because it is selected along with the code if someone wants to copy. I'll post here if I find a better solution.

I've found that line numbering with word wrap could only be achieved in Pelican by a
certain set of steps. I've listed the CSS and the Plugin I've used to get that
to work.

Add the following lines in your theme.css


    /* For use with the code_line-number_word-wrap_switcher_jquery.js Pelican plugin */
    code {
        overflow: auto;
        /* This uses `white-space: pre-wrap` to get elements within <pre> tags to wrap. Python, for code chunks within three backticks (```), doesn't wordwrap code lines by default, because they're within <pre> tags, which don't wrap by default. See https://github.com/github/markup/issues/168 , which is specifically about this parsing issue, even though that link's discussion is talking about GitHub. */
        white-space: pre-wrap;       /* css-3 */
        white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
        white-space: -pre-wrap;      /* Opera 4-6 */
        white-space: -o-pre-wrap;    /* Opera 7 */
        word-wrap: break-word;       /* Internet Explorer 5.5+ */
    }

    /* Following http://bililite.com/blog/2012/08/05/line-numbering-in-pre-elements/, use CSS to add line numbers to all spans that have the class 'code-line' */

    .highlight pre {
        counter-reset: linecounter;
        padding-left: 2em;
    }
    .highlight pre span.code-line {
        counter-increment: linecounter;
        padding-left: 1em;
        text-indent: -1em;
        display: inline-block;
    }
    .highlight pre span.code-line:before {
        content: counter(linecounter);
        padding-right: 1em;
        display: inline-block;
        color: grey;
        text-align: right;
    }


Then, we turn off the default linenums in codehilite. Also add the following pelican-plugin.

    MD_EXTENSIONS = ['fenced_code', 'codehilite(css_class=highlight, linenums=False)', ]

    PLUGINS = ['better_codeblock_line_numbering']
