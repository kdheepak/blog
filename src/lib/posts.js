import fs from "fs";
import matter from "gray-matter";
import path from "path";
import { encode } from "html-entities";
import child_process from "child_process";

import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";
import rehypeMathjaxSvg from "rehype-mathjax";

import { h, s } from "hastscript";
import { visit } from "unist-util-visit";

import { findAndReplace } from "hast-util-find-and-replace";

import { getHighlighter, BUNDLED_LANGUAGES } from "shiki";

export function formatDate(dateString) {
  const options = { year: "numeric", month: "short", day: "numeric", weekday: "short" };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

export function readingTime(post, metadata) {
  const WORDS_PER_MINUTE = 200;
  const regex = /\w+/g;
  const wordCount = (post || "").match(regex).length;
  metadata.readingTime = Math.ceil(wordCount / WORDS_PER_MINUTE);
}

export function getPostsMetadata(startPath, filter = ".md", ignore_drafts = false) {
  let posts = [];
  let metadatas = {};
  let tags = [];
  const files = fs.readdirSync(startPath);
  for (let i = 0; i < files.length; i++) {
    const filename = path.join(startPath, files[i]);
    const stat = fs.lstatSync(filename);
    if (stat.isDirectory()) {
      continue;
    } else if (filename.indexOf(filter) >= 0) {
      const doc = fs.readFileSync(filename, "utf8");
      const { data: metadata, content } = matter(doc);
      if (ignore_drafts && metadata.draft) {
        continue
      }
      const commit = child_process
        .spawnSync("git", ["log", "-n", "1", "--pretty=format:%H", "--", `${filename}`])
        .stdout.toString();
      readingTime(content, metadata);
      metadata.source = `https://github.com/kdheepak/blog/blob/${commit}/${filename}`;
      metadata.htmltags = metadata.tags === undefined ? "" : metadata.tags;
      metadata.htmltags = metadata.htmltags
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter((s) => s !== undefined || s !== "");
      if (!metadata.slug) {
        metadata.slug = metadata.title
          .toString()
          .toLowerCase()
          .replace(/<code>/, "")
          .replace(/<\/code>/g, "")
          .replace(/[^\w ]+/g, "")
          .replace(/ +/g, "-");
      }
      metadata.slug = encode(metadata.slug);
      metadata.path = filename;
      if (metadata.date) {
        metadata.humanDate = formatDate(metadata.date);
        metadata.date = formatDate(metadata.date);
        posts.push(metadata);
        metadatas[metadata.slug] = { metadata, content };
      }
      for (const tag of metadata.htmltags
        .map((s) => s.trim().toLowerCase())
        .filter((s) => s !== undefined && s !== "")) {
        tags.push(tag);
      }
    }
  }
  tags = [...new Set(tags)];
  tags.sort();
  tags = tags.filter((tag) => tag !== undefined && tag !== "");
  posts = posts
    .sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    })
    .reverse();
  return { metadatas, posts, tags };
}

function addCopyToClipboard() {
  return function transformer(tree) {
    visit(tree, "element", function (node) {
      modify(node, "code");
    });
  };

  function modify(node, prop) {
    const notYetProcessed =
      !node.properties.className || node.properties.className.indexOf("canCopyCode") === -1; // prevent infinite loop
    if (node.tagName === "pre" && notYetProcessed) {
      // Docu: https://github.com/syntax-tree/hastscript#use
      const newNodeData = h(
        `div.copyCodeContainer${node.properties["data-hide"] ? ".copyCodeContainerHide" : ""}`,
        [
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
          h(`pre.canCopyCode`, node.children),
        ],
      );
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
    visit(tree, "element", function (node) {
      if (components.map((c) => c.toLowerCase()).includes(node.tagName)) {
        const i = components.map((c) => c.toLowerCase()).indexOf(node.tagName);
        node.tagName = components[i];
      }
    });
  };
}

function fullWidthFigures() {
  return function transformer(tree) {
    visit(tree, "element", function (node) {
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
    visit(tree, "element", function (node) {
      if (node.tagName === "video") {
        node.children = [];
      }
    });
  };
}

function internalLinkMap() {
  return function transformer(tree) {
    visit(tree, "element", function (node) {
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
  return function (tree) {
    visit(tree, "element", function (node) {
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
    "-f",
    "markdown-literate_haskell",
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
    "./pandoc/foldcode.lua",
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

function rehypePrettyCode(options = {}) {
  const {
    theme,
    tokensMap = {},
    onVisitLine = () => { },
    onVisitHighlightedLine = () => { },
    getHighlighter = getHighlighter,
  } = options;

  // Cache highlighters per unified processor
  const highlighterCache = new Map();

  function toFragment({ node, trees, lang, title, inline = false, hide = false }) {
    node.tagName = inline ? "span" : "div";
    // User can replace this with a real Fragment at runtime
    node.properties = { "data-rehype-pretty-code-fragment": "" };
    node.children = Object.entries(trees)
      .map(([mode, tree]) => {
        const pre = tree.children[0];
        // Remove class="shiki" and the background-color
        pre.properties = {};
        pre.properties["data-language"] = lang;
        pre.properties["data-theme"] = mode;
        pre.properties["data-hide"] = hide;

        const code = pre.children[0];
        code.properties["data-language"] = lang;
        code.properties["data-theme"] = mode;
        code.properties["data-hide"] = hide;
        if (code.children.length > 1) {
          // TODO: Only show line numbers if defined in markdown
          code.properties["data-line-numbers"] = "";
        }

        if (inline) {
          return code;
        }

        if (title) {
          return [
            {
              type: "element",
              tagName: "div",
              properties: {
                "data-rehype-pretty-code-title": "",
                "data-language": lang,
                "data-theme": mode,
                "data-hide": hide,
              },
              children: [{ type: "text", value: title }],
            },
            pre,
          ];
        }

        return pre;
      })
      .flatMap((c) => c);
  }

  return async (tree) => {
    for (const [mode, value] of Object.entries(theme)) {
      if (!highlighterCache.has(mode)) {
        highlighterCache.set(mode, getHighlighter({ theme: value }));
      }
    }

    const hastParser = unified().use(rehypeParse, { fragment: true });

    const highlighters = new Map();
    for (const [mode, loadHighlighter] of highlighterCache.entries()) {
      highlighters.set(mode, await loadHighlighter);
    }

    visit(tree, "element", (node, index, parent) => {
      // Inline code
      if ((node.tagName === "code" && parent.tagName !== "pre") || node.tagName === "inlineCode") {
        const value = node.children[0].value;

        if (!value) {
          return;
        }

        // TODO: allow escape characters to break out of highlighting
        const stippedValue = value.replace(/{:[a-zA-Z.-]+}/, "");
        const meta = value.match(/{:([a-zA-Z.-]+)}$/)?.[1];

        if (!meta) {
          return;
        }

        const isLang = meta[0] !== ".";

        const trees = {};
        for (const [mode, highlighter] of highlighters.entries()) {
          if (!isLang) {
            const color =
              highlighter
                .getTheme()
                .settings.find(({ scope }) =>
                  scope?.includes(tokensMap[meta.slice(1)] ?? meta.slice(1)),
                )?.settings.foreground ?? "inherit";

            trees[mode] = hastParser.parse(
              `<pre><code><span style="color:${color}">${stippedValue}</span></code></pre>`,
            );
          } else {
            trees[mode] = hastParser.parse(highlighter.codeToHtml(stippedValue, meta));
          }
        }

        toFragment({ node, trees, lang: isLang ? meta : ".token", inline: true });
      }

      if (
        // Block code
        // Check from https://github.com/leafac/rehype-shiki
        node.tagName === "pre" &&
        Array.isArray(node.children) &&
        node.children.length === 1 &&
        node.children[0].tagName === "code" &&
        typeof node.children[0].properties === "object" &&
        Array.isArray(node.children[0].properties.className) &&
        typeof node.children[0].properties.className[0] === "string" &&
        node.children[0].properties.className[0].startsWith("language-")
      ) {
        const codeNode = node.children[0].children[0];
        const lang = node.children[0].properties.className[0].replace("language-", "");
        const title = null;
        const hide = node.properties.className
          ? node.properties.className.indexOf("hide") !== -1
          : false;

        const trees = {};
        for (const [mode, highlighter] of highlighters.entries()) {
          try {
            trees[mode] = hastParser.parse(
              highlighter.codeToHtml(codeNode.value.replace(/\n$/, ""), lang),
            );
          } catch (e) {
            // Fallback to plain text if a language has not been registered
            trees[mode] = hastParser.parse(
              highlighter.codeToHtml(codeNode.value.replace(/\n$/, ""), "txt"),
            );
          }
        }

        Object.entries(trees).forEach(([mode, tree]) => {
          visit(tree, "element", (node) => {
            if (node.properties.className?.[0] === "line") {
              onVisitLine(node);
              onVisitHighlightedLine(node);
            }
          });
        });

        toFragment({ node, trees, lang, title, hide });
      }
    });
  };
}

export async function pandocRemarkPreprocess(filename) {
  if (!path.extname(filename).startsWith(".md")) {
    return;
  }
  const content = fs.readFileSync(filename, "utf8");
  let c = pandoc(content);
  // console.log(c);
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
  // console.log(html);
  return {
    component: `${html}`,
    map: "",
  };
}

function debugPreprocess(message) {
  return {
    markup: async ({ content }) => {
      if (message) {
        console.log(message);
      }
      console.log(content);
      return {
        component: content,
        map: "",
      };
    },
  };
}