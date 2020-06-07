#!/usr/bin/env python
# -*- coding: utf-8 -*-
from __future__ import print_function
from pandocfilters import toJSONFilter, Header
import re
import sys

newframe = False
incomment = False


def slides(k, v, fmt, meta):
    global incomment
    global newframe

    if k == "RawBlock":
        fmt, s = v
        if re.search("<!-- BEGIN SLIDESNOHEADER -->", s):
            incomment = False
            newframe = False
        elif re.search("<!-- BEGIN SLIDES -->", s):
            incomment = False
            newframe = True
        elif re.search("<!-- END SLIDES -->", s):
            incomment = True

    if newframe:
        newframe = False
        # print("Creating new frame", file=sys.stderr)
        return Header(1, ["section", [], []], [])

    if incomment:
        return []


if __name__ == "__main__":
    toJSONFilter(slides)
