#!/usr/bin/env python
# -*- coding: utf-8 -*-
from __future__ import print_function

import os
import sys
from pandocfilters import toJSONFilter, Math, Plain, Str
import json


def fix_latex_symbol(key, value, format, meta):

    if key == "Math":
        if value[1] == "\\LaTeX" or value[1] == "\\LaTeX\\ " or value[1] == "\\LaTeX\\":
            return Str("\\LaTeX")


if __name__ == "__main__":
    toJSONFilter(fix_latex_symbol)
