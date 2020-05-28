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

var static_tcss: seq[string] = @[]
type
  TOCElement = tuple[title: string, url: string]

var toc: seq[TOCElement] = @[]

proc render(file: string) =
    var (dir, name, ext) = file.splitFile()
    if "drafts" in dir:
        return
    let output_dir = "build"
    createDir output_dir
    let thtml = joinPath("templates", "template.html")
    let tcss = @[joinPath("templates", "template.css")]

    # TODO: make option
    let self_contained = false # produce standalone

    var args = ""

    if fileExists(thtml):
        args = &"{args} --template {thtml}"

    if self_contained:
        args = &"{args} --self-contained"
        for c in tcss:
            args = &"{args} --css {c}"
    else:
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
    let (outjson, _) = execCmdEx(&"pandoc {file} --template {tmd}", {poUsePath})
    let md = parseJson(outjson)
    if md.hasKey("status") and $(md["status"]) == "draft":
        echo "Draft found."
        return
    if name == "index":
        let title = "Blog"
        args = &"{args} -M title={title}"
    elif md.hasKey("slug"):
        name = $(md["slug"])
        name = name.strip(chars = {'"', '\''})
    elif md.hasKey("title"):
        name = $(md["title"])
        name = name.strip(chars = {'"', '\''})
        name = name.toLowerAscii().replace("-", " ")
        name = name.split().join(" ").replace(" ", "-").replace("_", "-")
        for c in @[
            ';', '/', '?', ':', '@', '&', '=',
            '+', '$', ',', '\'', '<', '>', '#',
            '%', '"', '\\'
            ]:
            name = name.replace($c, "")

    if md.hasKey("toc"):
        let toc_depth = try:
            parseInt($md["toc"])
        except:
            1
        args = &"{args} --table-of-contents --toc-depth {toc_depth}"

    if md.hasKey("filters"):
        for f in md["filters"]:
            args = &"{args} -F {f}"

    if md.hasKey("bibliography"):
        let bib = joinPath(dir, $(md["bibliography"]))
        args = &"{args} --bibliography {bib}"

    if name != "index" and name != "404":
        args = &"{args} -V comments"

    args = &"{args} --filter=pandoc-sidenote --filter=pandoc-eqnos --filter=pandoc-fignos --filter=pandoc-tablenos --filter pandoc-citeproc"

    if fileExists("./templates/csl.csl"):
        args = &"{args} --csl ./templates/csl.csl"

    args = &"{args} --metadata link-citations=true"

    args = &"{args} --email-obfuscation javascript --base-header-level=2"

    let ofile = joinPath(output_dir, &"{name}.html")
    # markdown+escaped_line_breaks+all_symbols_escapable+strikeout+superscript+subscript+tex_math_dollars+link_attributes+footnotes+inline_notes
    let cmd = &"pandoc --katex --mathjax --section-divs --from=markdown+emoji --to=html5+smart {args} {file} -o {ofile}"
    echo cmd
    let (outp, errC) = execCmdEx cmd
    if errC != 0:
        echo outp
    else:
        # successful render
        if name != "index":
            var title = $(md["title"])
            title = title.strip(chars = {'"', '\''})
            toc.add((title, &"{name}.html"))

proc copy_file(file: string) =
    let (dir, name, ext) = file.splitFile
    let output_dir = joinPath("build", dir.replace("content", ""))
    createDir output_dir
    let ofile = joinPath(output_dir, &"{name}{ext}")
    copyFile(file, ofile)
    if ext == ".css":
        static_tcss.add(normalizedPath(ofile.replace("build", "./")))

proc generate() =
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

    for file in filesToRender.sorted(system.cmp, order = SortOrder.Descending):
        render(file)

    let tindex = joinPath(getTempDir(), "index.md")
    var oindex = open(tindex, fmWrite)

    for i, element in toc:
        if element.title == "404":
            continue
        write(oindex, &"[{element.title}]({element.url})")
        write(oindex, "\n\n")
    oindex.close()

    render(tindex)


when isMainModule:
    generate()
