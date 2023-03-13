-- local inspect = require("pandoc/inspect")
local stringify = (require("pandoc.utils")).stringify
local utils = require("pandoc.utils")

IGNORE = false

function startswith(text, prefix)
  return text:find(prefix, 1, true) == 1
end

function endswith(text, suffix)
  return text:sub(-string.len(suffix)) == suffix
end

function RawBlock(elem)
  if startswith(elem.text, "<script>") then
    IGNORE = true
    return pandoc.Null()
  end
  if startswith(elem.text, "</script>") or endswith(elem.text, "</script>") then
    IGNORE = false
    return pandoc.Null()
  end
  if IGNORE then
    return pandoc.Null()
  end
  return elem
end

return {
  { RawBlock = RawBlock },
}
