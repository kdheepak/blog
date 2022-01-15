-- local inspect = require("scripts.inspect")
local stringify = (require("pandoc.utils")).stringify
local utils = require("pandoc.utils")

function startswith(text, prefix)
	return text:find(prefix, 1, true) == 1
end

function Image(elem)
	if startswith(elem.src, "images/") then
		elem.src = "./" .. elem.src
	end
	if startswith(elem.src, "videos/") then
		elem.src = "./" .. elem.src
	end
	return elem
end

return {
	{ Image = Image },
}
