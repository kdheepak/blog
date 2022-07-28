-- local inspect = require("scripts.inspect")
local stringify = (require("pandoc.utils")).stringify
local utils = require("pandoc.utils")

local function startswith(text, prefix)
  return text:find(prefix, 1, true) == 1
end

local function endswith(text, suffix)
  return suffix == "" or text:sub(-#suffix) == suffix
end

local function readFile(name)
  -- Purely in case one wanted to inline the svgs
  local f = io.open(name, "r")
  if f ~= nil then
    return f:read("*all")
  else
    return nil
  end
end

function Image(elem)
  if startswith(elem.src, "images/") then
    elem.src = "./" .. elem.src
  end
  if startswith(elem.src, "videos/") then
    elem.src = "./" .. elem.src
  end

  -- if endswith(elem.src, ".svg") then
  --   local svg_inline = readFile("./src/posts/" .. elem.src)
  --   return pandoc.RawInline("html", svg_inline)
  -- end

  return elem
end
