#!/usr/bin/env python
# -*- coding: UTF-8 -*-
from __future__ import print_function

import os
import sys
from pandocfilters import toJSONFilter, Str, Para, Div
import subprocess
from subprocess import check_output
from subprocess import Popen, PIPE
import json

def convert_notebook_to_html(file_name):
    out = check_output(["jupyter-nbconvert", "content/notebooks/{}".format(file_name), "--to", "html"])

def convert_html_to_json(file_name):
    out = check_output(["pandoc", "{}".format(file_name), "-t", "json"])
    return out

def notebook_convert(key, value, format, meta):

    if key == 'Para' and value[0]['c'][0:2] == '{%' and value[-1]['c'][-2:] == '%}' and value[2]['c']=='notebook' :
        convert_notebook_to_html(value[4]['c'])
        convert_html_to_json(value[4]['c'].replace('.ipynb', '.html'))
        tuple_notebook = tuple(json.loads(convert_html_to_json(value[4]['c'].replace('.ipynb', '.html')))[1][0]['c']) # Remove unMeta
        sys.stderr.write("Converting notebook {}\n".format(value[4]['c']))
        return Div(*tuple_notebook)
    
if __name__ == "__main__":
    toJSONFilter(notebook_convert)

