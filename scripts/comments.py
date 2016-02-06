#!/usr/bin/env python
from __future__ import print_function
from pandocfilters import toJSONFilter
import re
import sys

"""
Pandoc filter that causes everything between
'<!-- BEGIN COMMENT -->' and '<!-- END COMMENT -->'
to be ignored.  The comment lines must appear on
lines by themselves, with blank lines surrounding
them.
"""

incomment = False


def comment(k, v, fmt, meta):
    global incomment

    if k == 'RawBlock':
        fmt, s = v
        if re.search("<!-- BEGIN ABSTRACTCOMMENT -->", s):
            incomment = True
        elif re.search("<!-- END ABSTRACTCOMMENT -->", s):
            incomment = False
    if incomment:
        return []  # suppress anything in a comment

if __name__ == "__main__":
    toJSONFilter(comment)
