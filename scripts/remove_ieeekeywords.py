#!/usr/bin/env python
# -*- coding: utf-8 -*-

from pandocfilters import toJSONFilter
import re
import sys


def ieeekeywords(k, v, fmt, meta):
    if k == "RawBlock":
        fmt, s = v
        if fmt == "tex" and "begin{IEEEkeywords}" in s:
            return []


if __name__ == "__main__":
    toJSONFilter(ieeekeywords)
