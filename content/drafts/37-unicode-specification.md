---
title: Unicode specification and state machines
category: blog
date: 2020-09-26T13:27:31-06:00
tags: programming, unicode, vim
keywords: julia, unicode
summary: Notes on the unicode specification and implementing a state machine
draft: true
references:
- id: unicodespec
  title: "Unicode Text Segmentation"
  URL: http://www.unicode.org/reports/tr29/#Grapheme_Cluster_Boundary_Rules
---

A boundary specification summarizes boundary property values used in that specification, then lists the rules for boundary determinations in terms of those property values.
The summary is provided as a list, where each element of the list is one of the following:

    A literal character
    A range of literal characters
    All characters satisfying a given condition, using properties defined in the Unicode Character Database [UCD]:
        Non-Boolean property values are given as <property> = <property value>, such as General_Category = Titlecase_Letter.
        Boolean properties are given as <property> = Yes, such as Uppercase = Yes.
        Other conditions are specified textually in terms of UCD properties.
    Boolean combinations of the above
    Two special identifiers, sot and eot, standing for start of text and end of text, respectively

For example, the following is such a list:
