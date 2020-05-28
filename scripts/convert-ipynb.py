#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from __future__ import print_function

import os
import sys
from pandocfilters import toJSONFilter, Str, Para, Div, Header
import subprocess
from subprocess import check_output
from subprocess import Popen, PIPE
import json


def convert_notebook_to_html(file_name):
    out = check_output(
        ["jupyter-nbconvert", "content/notebooks/{}".format(file_name), "--to", "html"]
    )


def convert_html_to_json(file_name):
    out = check_output(
        [
            "pandoc",
            "content/notebooks/{}".format(file_name),
            "-f",
            "html+tex_math_dollars+tex_math_single_backslash",
            "-t",
            "json",
        ]
    )
    return out


def remove_html(file_name):
    try:
        os.remove("content/notebooks/{}".format(file_name).replace("ipynb", "html"))
    except:
        pass
    try:
        os.remove("{}".format(file_name).replace("ipynb", "html"))
    except:
        pass


def notebook_convert(key, value, format, meta):

    if (
        key == "Para"
        and value[0]["c"][0:2] == "{%"
        and value[-1]["c"][-2:] == "%}"
        and value[2]["c"] == "notebook"
    ):
        convert_notebook_to_html(value[4]["c"])
        # sys.stderr.write("{}".format(type(json.loads(convert_html_to_json(value[4]['c'].replace('.ipynb', '.html')))["blocks"][0]['c'][1][0]['c'])))
        tuple_notebook = tuple(
            json.loads(convert_html_to_json(value[4]["c"].replace(".ipynb", ".html")))[
                "blocks"
            ][0]["c"][1][0]["c"]
        )  # Remove unMeta
        sys.stderr.write("Converting notebook {}\n".format(value[4]["c"]))

        remove_html(value[4]["c"])

        return Div(*tuple_notebook)

    if key == "Header":
        # Increment headers by 1
        value[0] += 1
        # Remove anchor links
        value[-1] = value[-1][:-1]
        return Header(*value)
        # return []


if __name__ == "__main__":
    toJSONFilter(notebook_convert)
