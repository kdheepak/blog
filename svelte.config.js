import preprocess from "svelte-preprocess";
import child_process from "child_process";
import path from "path";
import fs from "fs";
import matter from "gray-matter";

import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";
import rehypeMathjaxSvg from "rehype-mathjax";
import importAssets from "svelte-preprocess-import-assets";

import { h, s } from "hastscript";
import { visit } from "unist-util-visit";

import adapterStatic from "@sveltejs/adapter-static";
import { findAndReplace } from "hast-util-find-and-replace";

import { getHighlighter, BUNDLED_LANGUAGES } from "shiki";
import rehypePrettyCode from "rehype-pretty-code";

function adapter(options) {
  const baseStatic = adapterStatic(options);
  return {
    name: "svelte-adapter-static",
    async adapt(builder) {
      await baseStatic.adapt(builder);
    },
  };
}

function addCopyToClipboard() {
  return function transformer(tree) {
    visit(tree, "element", function(node) {
      modify(node, "code");
    });
  };

  function modify(node, prop) {
    const notYetProcessed =
      !node.properties.className || node.properties.className.indexOf("canCopyCode") === -1; // prevent infinite loop
    if (node.tagName === "pre" && notYetProcessed) {
      // Docu: https://github.com/syntax-tree/hastscript#use
      const newNodeData = h("div.copyCodeContainer", [
        h("a.copyCode", { onclick: "copyCode(event, this)" }, [
          h("div", [
            s(
              "svg.copyCodeImg",
              {
                xmlns: "http://www.w3.org/2000/svg",
                width: "14",
                height: "17",
                viewBox: "0 0 14 17",
              },
              [
                s(
                  "g",
                  {
                    fill: "none",
                    "fill-rule": "nonzero",
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                  },
                  [
                    s("path", { d: "M.84 5.2h7.84v11.2H.84z" }),
                    s("path", { d: "M5.32 2.49V.72h7.84v11.2h-1.71" }),
                  ],
                ),
              ],
            ),
          ]),
        ]),
        h("pre.canCopyCode", node.children),
      ]);
      Object.assign(node, newNodeData);
    }
  }
}

function getCustomComponents() {
  const components = [];
  const files = fs.readdirSync("./src/lib/components/");
  for (const file of files) {
    const filename = path.join("./src/lib/components/", file);
    const stat = fs.lstatSync(filename);
    if (stat.isDirectory()) {
      continue;
    } else if (filename.indexOf(".svelte") >= 0) {
      components.push(file.replace(".svelte", ""));
    }
  }
  return components;
}

function customComponent() {
  const components = getCustomComponents();
  return function transformer(tree) {
    visit(tree, "element", function(node) {
      if (components.map((c) => c.toLowerCase()).includes(node.tagName)) {
        const i = components.map((c) => c.toLowerCase()).indexOf(node.tagName);
        node.tagName = components[i];
      }
    });
  };
}

function fullWidthFigures() {
  return function transformer(tree) {
    visit(tree, "element", function(node) {
      if (node.tagName === "figure") {
        for (const child of node.children) {
          if (child.tagName === "img") {
            if (child.properties["className"] !== undefined) {
              node.properties["className"] = child.properties["className"];
            }
          }
        }
      }
    });
  };
}

function videoStripLink() {
  return function transformer(tree) {
    visit(tree, "element", function(node) {
      if (node.tagName === "video") {
        node.children = [];
      }
    });
  };
}

function internalLinkMap() {
  return function transformer(tree) {
    visit(tree, "element", function(node) {
      if (node.tagName == "a" && node.properties.href.endsWith(".md")) {
        const doc = fs.readFileSync("./src/posts/" + node.properties.href, "utf8");
        const { data: metadata } = matter(doc);
        if (!metadata.slug) {
          metadata.slug = metadata.title
            .toString()
            .toLowerCase()
            .replace(/<code>/, "")
            .replace(/<\/code>/g, "")
            .replace(/[^\w ]+/g, "")
            .replace(/ +/g, "-");
        }
        node.properties.href = "/" + metadata.slug;
      }
    });
  };
}

function mathJaxSetup() {
  return (tree) => {
    visit(tree, "element", (node) => {
      if (
        node.tagName == "span" &&
        node.properties["className"] !== undefined &&
        node.properties["className"].includes("math")
      ) {
        if (node.properties["className"].includes("display")) {
          node.properties["className"].push("math-display");
          for (const child of node.children) {
            child.value = child.value.replace("\\[", "").replace("\\]", "");
          }
        }
        if (node.properties["className"].includes("inline")) {
          node.properties["className"].push("math-inline");
          for (const child of node.children) {
            child.value = child.value.replace("\\(", "").replace("\\)", "");
          }
        }
      }
    });
  };
}

function escapeCurlies() {
  return function(tree) {
    visit(tree, "element", function(node) {
      if (
        node.tagName === "code" ||
        node.tagName === "math" ||
        (node.tagName == "span" &&
          node.properties["className"] !== undefined &&
          node.properties["className"].includes("math"))
      ) {
        findAndReplace(
          node,
          {
            "&": "&#38;",
            "{": "&#123;",
            "}": "&#125;",
            '"': "&#34;",
            "'": "&#39;",
            "<": "&#60;",
            ">": "&#62;",
            "`": "&#96;",
          },
          {
            ignore: ["title", "script", "style"],
          },
        );
      }
    });
  };
}

function pandoc(input, ...args) {
  const option = [
    "-t",
    "html",
    "--email-obfuscation",
    "references",
    "--shift-heading-level=0",
    "--no-highlight",
    "--section-divs",
    "--mathjax",
    "--filter",
    "pandoc-secnos",
    "--filter",
    "pandoc-eqnos",
    "--filter",
    "pandoc-fignos",
    "--filter",
    "pandoc-tablenos",
    "--citeproc",
    "--csl",
    "./pandoc/csl.csl",
    "--metadata",
    "link-citations=true",
    "--bibliography=./pandoc/blog.bib",
    "--metadata",
    "notes-after-punctuation=false",
    "--metadata",
    "reference-section-title=References",
    "--lua-filter",
    "./pandoc/render.lua",
    "--lua-filter",
    "./pandoc/ref-section-level.lua",
    "--lua-filter",
    "./pandoc/links-target-blank.lua",
    "--lua-filter",
    "./pandoc/section-prefix.lua",
    "--lua-filter",
    "./pandoc/sidenote.lua",
    "--lua-filter",
    "./pandoc/standard-code.lua",
    "--lua-filter",
    "./pandoc/alert.lua",
    "--lua-filter",
    "./pandoc/fix-image-links.lua",
  ].concat(args);
  let pandoc;
  input = Buffer.from(input);
  try {
    pandoc = child_process.spawnSync("pandoc", option, { input, timeout: 20000 });
  } catch (err) {
    console.error(option, input, err);
  }
  if (pandoc.stderr && pandoc.stderr.length) {
    console.log(option, input, Error(pandoc.output[2].toString()));
  }
  var content = pandoc.stdout.toString();
  return content;
}

const rehypePrettyCodeOptions = {
  theme: {
    light: "github-light",
    dark: "github-dark",
  },
  onVisitHighlightedLine(node) {
    node.properties.className.push("highlighted");
  },
  getHighlighter: (options) =>
    getHighlighter({
      ...options,
      langs: [...BUNDLED_LANGUAGES],
    }),
};

function pandocRemarkPreprocess() {
  return {
    markup: async ({ content, filename }) => {
      if (!path.extname(filename).startsWith(".md")) {
        return;
      }
      let c = pandoc(content);
      c = c.replaceAll(/<!--separator-->/g, " ");
      const markdown2svelte = unified()
        .use(rehypeParse, { fragment: true, emitParseErrors: true })
        .use(mathJaxSetup)
        .use(rehypeMathjaxSvg)
        .use(rehypePrettyCode, rehypePrettyCodeOptions)
        .use(fullWidthFigures)
        .use(videoStripLink)
        .use(internalLinkMap)
        .use(escapeCurlies)
        .use(customComponent)
        .use(addCopyToClipboard)
        .use(rehypeStringify, { allowDangerousHtml: false });
      const result = await markdown2svelte().process(c);
      const html = result
        .toString()
        .replace(/&#x26;#34;/g, "&#34;")
        .replace(/&#x26;#38;/g, "&#38;")
        .replace(/&#x26;#123;/g, "&#123;")
        .replace(/&#x26;#125;/g, "&#125;")
        .replace(/&#x26;#34;/g, "&#34;")
        .replace(/&#x26;#39;/g, "&#39;")
        .replace(/&#x26;#60;/g, "&#60;")
        .replace(/&#x26;#62;/g, "&#62;")
        .replace(/&#x26;#96;/g, "&#96;");
      return {
        code: `${html}`,
        map: "",
      };
    },
  };
}

function fromDir(startPath, filter) {
  const slugs = [];
  let tags = [];
  var files = fs.readdirSync(startPath);
  const metadatas = [];
  for (var i = 0; i < files.length; i++) {
    var filename = path.join(startPath, files[i]);
    var stat = fs.lstatSync(filename);
    if (stat.isDirectory()) {
      continue;
    } else if (filename.indexOf(filter) >= 0) {
      const doc = fs.readFileSync(filename, "utf8");
      const { data: metadata } = matter(doc);
      metadata.path = filename;
      metadata.htmltags = metadata.tags === undefined ? "" : metadata.tags;
      metadata.htmltags = metadata.htmltags
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter((s) => s !== undefined || s !== "");
      for (const tag of metadata.htmltags
        .map((s) => s.trim().toLowerCase())
        .filter((s) => s !== undefined && s !== "")) {
        tags.push(tag);
      }
      if (metadata.slug) {
        slugs.push(metadata.slug);
      } else {
        metadata.slug = metadata.title
          .toString()
          .toLowerCase()
          .replace(/<code>/, "")
          .replace(/<\/code>/g, "")
          .replace(/[^\w ]+/g, "")
          .replace(/ +/g, "-");
        slugs.push(metadata.slug);
      }
      metadatas.push(metadata);
    }
  }
  tags = [...new Set(tags)];
  tags.sort();
  tags = tags.filter((tag) => tag !== undefined && tag !== "");

  return { slugs, tags, metadatas };
}

function debugPreprocess(message) {
  return {
    markup: async ({ content }) => {
      if (message) {
        console.log(message);
      }
      console.log(content);
      return {
        code: content,
        map: "",
      };
    },
  };
}

function getPages() {
  let pages = ["*"];
  const { slugs } = fromDir("src/posts/", ".md");
  for (const p of slugs) {
    pages.push(`/${p}`);
  }
  return pages;
}

function buildSearchIndex() {
  let config = `
[input]
base_directory = "."
url_prefix = "https://blog.kdheepak.com/"
files = [\n`;

  const { metadatas } = fromDir("src/posts/", ".md");
  for (const metadata of metadatas) {
    config +=
      ` { path = "${metadata.path}",` +
      ` filetype = "Markdown",` +
      ` url = "${metadata.slug}",` +
      ` title = "${metadata.title}" },\n`;
  }

  config += `\n]\n`;
  fs.writeFileSync(path.join(process.cwd(), "static", "assets", "stork", "search.toml"), config);
}

buildSearchIndex();

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: [".svelte", ".md"],
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [pandocRemarkPreprocess(), preprocess(), importAssets()],

  kit: {
    adapter: adapter(),
    prerender: {
      default: true,
      concurrency: 4,
      crawl: true,
      entries: getPages(),
    },
  },
};

export default config;
