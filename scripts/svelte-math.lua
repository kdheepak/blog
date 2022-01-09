local inspect = require("scripts.inspect")
local stringify = (require("pandoc.utils")).stringify
local utils = require("pandoc.utils")

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

return {
	{ Code = Code },
	{ CodeBlock = CodeBlock },
	{ Math = Math },
}
