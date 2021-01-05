#!/usr/bin/env nimcr
import os
import strutils
import sequtils
import strformat
import osproc
import json
import re
import streams
import times
import algorithm

var static_tcss: seq[string] = @[]
var site_root = "https://blog.kdheepak.com"

type
  TOCElement = tuple[title: string, url: string]

type
  PandocIOError* = object of IOError

var toc: seq[TOCElement] = @[]

proc existsExe(exe: string): bool =
  let (s, _) = when defined(windows):
    execCmdEx(&"where {exe}")
  else:
    execCmdEx(&"which {exe}")
  return if s.len > 0: true else: false

var filters = ""

for exe in @["pandoc-eqnos", "pandoc-fignos", "pandoc-tablenos", "pandoc-citeproc"]:
  if existsExe(exe):
    filters = &"{filters} --filter={exe}"

proc generate_sitemap(posts: seq[JsonNode]) =
    var
      seq_post : seq[string]
      p, post_dt: string

    for key, post in posts:
      if post{"status"}.getStr == "draft":
        continue
      var ds = post{"date"}.getStr
      ds = if ds != "": ds else: "1970-01-01T00:00:00-00:00"
      var dt: DateTime = parse(ds, "yyyy-MM-dd\'T\'HH:mm:sszzz")
      post_dt = format(dt, "yyyy-MM-dd\'T\'HH:mm:sszzz")
      p = """
<url>
  <loc>$3/$1</loc>
  <lastmod>$2</lastmod>
  <priority>1.00</priority>
</url>
    """ % [
          post["slug"].getStr,
          post_dt,
          site_root,
          ]
      seq_post.add p

    var index_post = seq_post.join("\n")

    var content = &"""
<?xml version="1.0" encoding="UTF-8"?>
<urlset
xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
      http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
{index_post}
</urlset>
"""
    writeFile("build/" & "sitemap.xml", content)

proc render(file: string): JsonNode =
  var (dir, filename, ext) = file.splitFile()
  if "drafts" in dir:
    return
  let output_dir = "build"
  createDir output_dir
  let thtml = absolutePath(joinPath("templates", "template.html"))
  let tcss = @[absolutePath(joinPath("templates", "template.css"))]

  let tmd = joinPath(getTempDir(), "metadata.html")
  writeFile(tmd, "$meta-json$")
  let outjson = execProcess(&"pandoc {filename}{ext} --template={tmd}", workingDir = absolutePath(dir), options = {poUsePath, poEvalCommand})
  let post = parseJson(outjson)

  var args = ""

  if fileExists(thtml):
    args = &"{args} --template {thtml}"

  args = &"{args} --standalone"
  for c in static_tcss:
    args = &"{args} --css /{c}"
  if not post{"css"}.isNil:
    for css in post{"css"}:
      static_tcss.add(css.getStr())

  for c in tcss:
    if not fileExists(c):
      continue
    let asset_css_dir = "css"
    createDir(joinPath("build", asset_css_dir))
    let (_, cname, cext) = c.splitFile
    let ocss = if cname == "template":
      joinPath(asset_css_dir, &"custom{cext}")
    else:
      joinPath(asset_css_dir, &"{cname}{cext}")
    copyFile(c, joinPath("build", ocss))
    args = &"{args} --css /{ocss}"

  var ofilename = filename

  if post.hasKey("slug"):
    ofilename = $(post["slug"])
    ofilename = ofilename.strip(chars = {'"', '\''})
  elif post.hasKey("title"):
    ofilename = $(post["title"])
    ofilename = ofilename.replace("<code>", "").replace("</code>", "")
    ofilename = ofilename.strip(chars = {'"', '\''})
    ofilename = ofilename.toLowerAscii().replace("-", " ")
    ofilename = ofilename.split().join(" ").replace(" ", "-").replace("_", "-")
    for c in @[
      ';', '/', '?', ':', '@', '&', '=', '+', '$', ',', '\'', '<', '>', '#', '%', '`', '\'', '"', '\\'
      ]:
      ofilename = ofilename.replace($c, "")

  if post{"table-of-contents"}.getStr == "true":
    args = &"{args} --toc"

  if post.hasKey("filters"):
    for f in post["filters"]:
      args = &"{args} -F {f}"

  if ofilename != "index" and ofilename != "404":
    args = &"{args} -V comments"

  let _ = absolutePath(joinPath("scripts", "vim.xml"))

  let ds = post{"date"}.getStr
  if ds != "":
    let dt: DateTime = parse(ds, "yyyy-MM-dd\'T\'HH:mm:sszzz")
    let d = format(dt, "ddd, MMM dd, yyyy")
    args = &"{args} --metadata date=\"{d}\""

  args = &"{args} --email-obfuscation javascript --shift-heading-level=0"
  args = &"{args} --katex --mathjax=https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_CHTML --section-divs"
  let js = absolutePath(joinPath("templates", "template.js"))
  args = &"{args} --include-after-body={js}"

  if ofilename != "index":
    let commit = execProcess(&"git log -n 1 --pretty=format:%H -- {filename}{ext}", workingDir = dir).strip()
    let source = &"https://github.com/kdheepak/blog/blob/{commit}/content/{filename}{ext}"
    args = &"{args} --metadata source=\"{source}\""
  else:
    args = &"{args} --metadata source=\"https://github.com/kdheepak/blog/\""

  args = &"{args} {filters}"

  let sidenote_filter = absolutePath(joinPath("scripts", "sidenote.lua"))
  args = &"{args} --lua-filter={sidenote_filter}"

  let render_filter = absolutePath(joinPath("scripts", "render.lua"))
  args = &"{args} --lua-filter={render_filter}"

  let inlinesvg_filter = absolutePath(joinPath("scripts", "inline-svg.lua"))
  args = &"{args} --lua-filter={inlinesvg_filter}"

  let linkstargetblank_filter = absolutePath(joinPath("scripts", "links-targets-blank.lua"))
  args = &"{args} --lua-filter={linkstargetblank_filter}"

  let csl = absolutePath(joinPath("templates", "csl.csl"))
  if post{"csl"}.getStr == "" and fileExists(csl):
    let ref_section_level_filter = absolutePath(joinPath("scripts", "ref-section-level.lua"))
    args = &"{args} --csl {csl} --metadata link-citations=true --metadata notes-after-punctuation=false --metadata reference-section-title=\"References\" --lua-filter={ref_section_level_filter}"

  let section_prefix_filter = absolutePath(joinPath("scripts", "section-prefix.lua"))
  args = &"{args} --lua-filter={section_prefix_filter}"

  post["slug"] = %* &"{ofilename}.html"
  args = &"{args} --metadata slug={ofilename}"

  let ofile = absolutePath(joinPath(output_dir, &"{ofilename}.html"))
  # markdown+escaped_line_breaks+all_symbols_escapable+strikeout+superscript+subscript+tex_math_dollars+link_attributes+footnotes+inline_notes
  if ofilename == "index":
    args = &"{args} --variable root=https://kdheepak.com"
  else:
    args = &"{args} --variable root=https://kdheepak.com --variable blogroot=/"

  let cmd = &"pandoc --from=markdown+gfm_auto_identifiers+emoji --to=html5+smart {args} {filename}{ext} -o {ofile}"
  let p = startProcess(cmd, workingDir = dir, options = {poUsePath, poEvalCommand, poEchoCmd, poStdErrToStdOut})
  echo p.outputStream().readAll().strip()
  doAssert waitForExit(p) == 0
  p.close()
  # successful render
  if ofilename != "index":
    var title = $(post["title"])
    title = title.strip(chars = {'"', '\''})
    toc.add((title, &"{ofilename}.html"))

  result = post


proc copy_file(file: string) =
  let (dir, name, ext) = file.splitFile
  let output_dir = joinPath("build", dir.replace("content", ""))
  createDir output_dir
  let ofile = joinPath(output_dir, &"{name}{ext}")
  copyFile(file, ofile)
  if ext == ".css":
      static_tcss.add(normalizedPath(ofile.replace("build", "./")))

proc generate_rssfeed(posts: seq[JsonNode]) =

  var
    seq_post : seq[string]
    julia_seq_post : seq[string]
    p, post_dt: string

  for key, post in posts:
    if post{"status"}.getStr == "draft" or post{"slug"}.getStr == "index.html" or post{"slug"}.getStr == "404.html":
      continue
    var ds = post{"date"}.getStr
    ds = if ds != "": ds else: "1970-01-01T00:00:00-00:00"
    var dt: DateTime = parse(ds, "yyyy-MM-dd\'T\'HH:mm:sszzz")
    post_dt = format(dt, "ddd, dd MMM yyyy HH:mm:ss \'GMT\'")
    p = """
<item>
  <title>$1</title>
  <link>$5/$2</link>
  <guid isPermaLink="true">$5/$2</guid>
  <atom:link href="$5/$2" rel="self"></atom:link>
  <pubDate>$4</pubDate>
  <description>$3</description>
</item>
  """ % [
        post["title"].getStr().replace("<code>", "").replace("</code>", ""),
        post["slug"].getStr,
        post["summary"].getStr().replace("<code>", "").replace("</code>", ""),
        post_dt,
        site_root,
        ]
    seq_post.add p
    if "julia" in post{"tags"}.getStr().split(",").mapIt(it.strip()):
      julia_seq_post.add p

  var index_post = seq_post.join("\n")
  let time_now = format(now(), "ddd, dd MMM yyyy HH:mm:ss \'GMT\'")

  var content = &"""
<?xml version="1.0"?>
<?xml-stylesheet type="text/xsl" media="screen" href="/styles/rss.xsl"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Dheepak Krishnamurthy's Blog</title>
    <description>My thoughts, notes and blogs</description>
    <link>https://blog.kdheepak.com/</link>
    <lastBuildDate>{time_now}</lastBuildDate>
    <pubDate>{time_now}</pubDate>
    <language>en-us</language>
    <copyright>Copyright 2020, Dheepak Krishnamurthy</copyright>
    <atom:link href="https://blog.kdheepak.com/rss.xml" rel="self" type="application/rss+xml"></atom:link>
    <generator>website</generator>

{index_post}
  </channel>
</rss>
  """
  writeFile("build/" & "rss.xml", content)

  var julia_index_post = julia_seq_post.join("\n")
  var julia_content = &"""
<?xml version="1.0"?>
<?xml-stylesheet type="text/xsl" media="screen" href="/styles/rss.xsl"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>blogs tagged with `julia`</title>
    <description>My thoughts, notes and blogs</description>
    <link>https://blog.kdheepak.com/</link>
    <lastBuildDate>{time_now}</lastBuildDate>
    <pubDate>{time_now}</pubDate>
    <language>en-us</language>
    <copyright>Copyright 2020, Dheepak Krishnamurthy</copyright>
    <atom:link href="https://blog.kdheepak.com/tags/julia/rss.xml" rel="self" type="application/rss+xml"></atom:link>
    <generator>website</generator>

{julia_index_post}
  </channel>
</rss>
  """
  createDir("build/tags/julia/")
  writeFile("build/tags/julia/rss.xml", julia_content)

proc main() =
  # copy all non markdown files
  for file in walkDirRec "./content":
      if file.match re".*\.md":
          continue
      echo &"Copying {file}"
      copy_file(file)

  var filesToRender: seq[string] = @[]
  # render all markdown files as html
  for file in walkDirRec("./content"):
      if file.match re".*\.md":
          filesToRender.add(file)

  var posts: seq[JsonNode] = @[]
  for file in filesToRender.sorted(system.cmp, order = SortOrder.Descending):
    var p = render(file)
    if not p.isNil: posts.add p

  let tindex = joinPath(getTempDir(), "index.md")
  var oindex = open(tindex, fmWrite)

  let _ = format(now(), "yyyy-MM-dd\'T\'HH:mm:sszzz")
  write(oindex, &"""
---
title-prefix: Dheepak Krishnamurthy
title: blog
category: blog
summary: My thoughts, notes and blogs
slug: index
date: {now()}
---
  """)

  proc my_cmp(x, y: JsonNode): int =
    if x{"date"}.getStr == "": return -1
    if y{"date"}.getStr == "": return 1
    if parse(x{"date"}.getStr, "yyyy-MM-dd\'T\'HH:mm:sszzz") > parse(y{"date"}.getStr, "yyyy-MM-dd\'T\'HH:mm:sszzz"): 1 else: -1

  sort(posts, my_cmp, SortOrder.Descending)
  write(oindex, "<div class=\"tocwrapper\">")
  for i, post in posts:
    if post["title"].getStr == "404" or post{"status"}.getStr == "draft":
        continue
    var t = post["title"].getStr
    var s = post["slug"].getStr
    var dt: DateTime = parse(post{"date"}.getStr, "yyyy-MM-dd\'T\'HH:mm:sszzz")
    var d = format(dt, "MMM, yyyy")
    var line = &"[{t}]({s})"
    write(oindex, &"<span class=\"toclink\">{line}</span><span class=\"tocdate\">{d}</span>")
    write(oindex, "\n\n")
  write(oindex, "</div>")
  oindex.close()

  var p = render(tindex)
  if not p.isNil: posts.add p

  generate_sitemap(posts)
  generate_rssfeed(posts)

when isMainModule:
    main()
