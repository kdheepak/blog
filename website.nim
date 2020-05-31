#!/usr/bin/env nimcr
import os
import strutils
import strformat
import osproc
import json
import re
import ospaths
import streams
import times
import algorithm
import tables

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

  var args = ""

  if fileExists(thtml):
    args = &"{args} --template {thtml}"

  args = &"{args} --standalone"
  for c in static_tcss:
    args = &"{args} --css {c}"

  for c in tcss:
    if not fileExists(c):
      continue
    let asset_css_dir = "css"
    createDir(joinPath("build", asset_css_dir))
    let (cdir, cname, cext) = c.splitFile
    let ocss = joinPath(asset_css_dir, &"{cname}{cext}")
    copyFile(c, joinPath("build", ocss))
    args = &"{args} --css {ocss}"

  let tmd = joinPath(getTempDir(), "metadata.html")
  writeFile(tmd, "$meta-json$")
  let outjson = execProcess(&"pandoc {filename}{ext} --template={tmd}", workingDir = absolutePath(dir), options = {poUsePath, poEvalCommand})
  let post = parseJson(outjson)
  if post.hasKey("status") and $(post["status"]) == "draft":
    echo "Draft found."
    return
  var ofilename = filename

  if post.hasKey("slug"):
    ofilename = $(post["slug"])
    ofilename = ofilename.strip(chars = {'"', '\''})
  elif post.hasKey("title"):
    ofilename = $(post["title"])
    ofilename = ofilename.strip(chars = {'"', '\''})
    ofilename = ofilename.toLowerAscii().replace("-", " ")
    ofilename = ofilename.split().join(" ").replace(" ", "-").replace("_", "-")
    for c in @[
      ';', '/', '?', ':', '@', '&', '=',
      '+', '$', ',', '\'', '<', '>', '#',
      '%', '"', '\\'
      ]:
      ofilename = ofilename.replace($c, "")

  if post.hasKey("toc"):
    let toc_depth = try:
      parseInt($post["toc"])
    except:
      1
    args = &"{args} --table-of-contents --toc-depth {toc_depth}"

  if post.hasKey("filters"):
    for f in post["filters"]:
      args = &"{args} -F {f}"

  if ofilename != "index" and ofilename != "404":
    args = &"{args} -V comments"

  let sidenote_filter = absolutePath(joinPath("scripts", "sidenote.lua"))
  args = &"{args} --lua-filter={sidenote_filter} {filters}"

  let csl = absolutePath(joinPath("templates", "csl.csl"))
  if post{"csl"}.getStr == "" and fileExists(csl):
    let ref_section_level_filter = absolutePath(joinPath("scripts", "ref-section-level.lua"))
    args = &"{args} --csl {csl} --metadata link-citations=true --metadata notes-after-punctuation=false --metadata reference-section-title=\"References\"  --lua-filter={ref_section_level_filter}"

  let ds = post{"date"}.getStr
  if ds != "":
    let dt: DateTime = parse(ds, "yyyy-MM-dd\'T\'HH:mm:sszzz")
    let d = format(dt, "ddd, MMM dd, yyyy")
    args = &"{args} --metadata date=\"{d}\""

  args = &"{args} --email-obfuscation javascript --base-header-level=2"
  args = &"{args} --katex --mathjax=https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_CHTML --section-divs"
  let js = absolutePath(joinPath("templates", "template.js"))

  post["slug"] = %* &"{ofilename}.html"
  let ofile = absolutePath(joinPath(output_dir, &"{ofilename}.html"))
  # markdown+escaped_line_breaks+all_symbols_escapable+strikeout+superscript+subscript+tex_math_dollars+link_attributes+footnotes+inline_notes
  let cmd = &"pandoc --from=markdown+emoji --to=html5+smart {args} {filename}{ext} -o {ofile}"
  let outp = execProcess(cmd, workingDir = dir, options = {poUsePath, poEvalCommand, poEchoCmd, poStdErrToStdOut})
  echo outp
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

  let current_time = format(now(), "yyyy-MM-dd\'T\'HH:mm:sszzz")
  write(oindex, &"""
---
title-prefix: Dheepak Krishnamurthy
title: Blog
category: blog
summary: My thoughts, notes and blogs
slug: index
---
  """)

  proc my_cmp(x, y: JsonNode): int =
    if x{"date"}.getStr == "": return -1
    if y{"date"}.getStr == "": return 1
    if parse(x{"date"}.getStr, "yyyy-MM-dd\'T\'HH:mm:sszzz") > parse(y{"date"}.getStr, "yyyy-MM-dd\'T\'HH:mm:sszzz"): 1 else: -1

  sort(posts, my_cmp, SortOrder.Descending)
  for i, post in posts:
    if post["title"].getStr == "404":
        continue
    var t = post["title"].getStr
    var s = post["slug"].getStr
    var dt: DateTime = parse(post{"date"}.getStr, "yyyy-MM-dd\'T\'HH:mm:sszzz")
    var d = format(dt, "MMM, yyyy")
    var line = &"[{t}]({s})"
    write(oindex, &"{d}: {line}")
    write(oindex, "\n\n")
  oindex.close()

  var p = render(tindex)
  if not p.isNil: posts.add p

  generate_sitemap(posts)

when isMainModule:
    main()
