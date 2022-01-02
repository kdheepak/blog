local inspect = require("scripts.inspect")
local stringify = (require("pandoc.utils")).stringify
local utils = require("pandoc.utils")

local meta = {}

with_temporary_directory = pandoc.system.with_temporary_directory

--- Collection of all cites in the document
local citations = {}
--- Document meta value
local doc_meta = pandoc.Meta({})

-- Character escaping
local function escape(s)
	s = s:gsub("{", "&lbrace;")
	s = s:gsub("}", "&rbrace;")
	return s
end

function Math(elem)
	elem.text = escape(elem.text)
	return elem
end

function CodeBlock(elem)
	elem.text = escape(elem.text)
	return elem
end

function Code(elem)
	elem.text = escape(elem.text)
	return elem
end

local function starts_with(start, str)
	return str:sub(1, #start) == start
end

function readAll(file)
	local f = assert(io.open(file, "rb"))
	local content = f:read("*all")
	f:close()
	return content
end

return {
	{
		-- Collect all citations and the doc's Meta value for other filters.
		Cite = function(c)
			citations[#citations + 1] = c
		end,
		Meta = function(m)
			doc_meta = m
		end,
	},
	{ Code = Code },
	{ CodeBlock = CodeBlock },
	{ Math = Math },
}
