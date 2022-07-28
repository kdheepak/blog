local inspect = require("pandoc.inspect")

function CodeBlock(block)
  if block.classes:includes("collapse") then
    local summary = block.attributes["summary"]
    local fold = block.attributes["fold"]
    local blocks = pandoc.List()
    local open = ""
    if fold == "show" then
      open = " open"
    end
    local beginPara = pandoc.Plain({
      pandoc.RawInline("html", "<details" .. open .. ">\n<summary>"),
    })
    table.insert(beginPara.content, summary or "Show Code")
    beginPara.content:insert(pandoc.RawInline("html", "</summary>"))
    blocks:insert(beginPara)
    blocks:insert(block)
    blocks:insert(pandoc.RawBlock("html", "</details>"))
    return blocks
  else
    return block
  end
end
