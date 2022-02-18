local pandoc = require("pandoc")
local mmdc = os.getenv("MMDC") or pandoc.system.get_working_directory() .. "/node_modules/.bin/mmdc"
local filetype = "svg"

local tikz_doc_template = [[
\documentclass{standalone}
\usepackage{xcolor}
\usepackage{tikz}
\begin{document}
\nopagecolor
%s
\end{document}
]]

local renderer = {
	render_dot = function(text, attrs)
		if attrs[1] then
			attrs = attrs[1][2]
		end
		local params = { "-Tsvg" }
		for w in attrs:gmatch("%S+") do
			table.insert(params, w)
		end
		local cmd = { "dot", params, text }
		local data = pandoc.pipe(cmd[1], cmd[2], cmd[3])
		return data
	end,
	render_tikz = function(text, attributes)
		local data
		pandoc.system.with_temporary_directory("tikz2image", function(tmpdir)
			pandoc.system.with_working_directory(tmpdir, function()
				local f = io.open("tikz.tex", "w")
				f:write(tikz_doc_template:format(text))
				f:close()
				os.execute("pdflatex tikz.tex")
				local outputfile = "tikz." .. filetype
				os.execute("pdf2svg tikz.pdf " .. outputfile)
				local r = io.open(outputfile, "rb")
				data = r:read("*all")
			end)
		end)
		return data
	end,
	render_mermaid = function(code, attributes)
		local file = code
		local data
		local width = 1000
		if attributes.file then
			_, file = pandoc.mediabag.fetch(attributes.file)
		end
		if attributes.width then
			width = attributes.width
		end
		pandoc.system.with_temporary_directory("mermaid-tmp", function(tmpdir)
			pandoc.system.with_working_directory(tmpdir, function()
				local mmconf = io.open("mermaid-config.json", "w")
				mmconf:write([[{"securityLevel": "loose"}]])
				mmconf:close()
				local f = io.open("dsl.dsl", "w")
				f:write(file)
				f:close()
				local outputfile = "mermaid." .. filetype
				pandoc.pipe(mmdc, {
					"-i",
					"dsl.dsl",
					"-o",
					outputfile,
					"-c",
					"mermaid-config.json",
					"-b",
					"var(--code-bkg-color)",
					"-w",
					width,
				}, "")
				local r = io.open(outputfile, "rb")
				data = r:read("*all"):gsub("<br>", "<br/>")
				r:close()
			end)
		end)
		return data
	end,
	render_svgbob = function(text)
		-- io.stderr:write("svgbob found: " .. text .. "\n")
		local params = { "--background", "var(--code-bkg-color)" }
		local cmd = { "svgbob_cli", params, text }
		local data = pandoc.pipe(cmd[1], cmd[2], cmd[3])
		return data
	end,
}

local get_render_lang = function(inputstr)
	local sep = "_"
	local t = {}
	for str in string.gmatch(inputstr, "([^" .. sep .. "]+)") do
		table.insert(t, str)
	end
	return t[#t]
end

function Render(elem)
	for format, render_cmd in pairs(renderer) do
		if elem.classes[1] == format or elem.classes[1] == get_render_lang(format) then
			local data = render_cmd(elem.text, elem.attributes or {})
			return data
		end
	end
	return nil
end

function RenderCodeBlock(elem)
	local data = Render(elem)
	if data ~= nil then
		return pandoc.Para({ pandoc.RawInline("html", data) })
	else
		return nil
	end
end

function RenderCode(elem)
	elem.text = elem.text:gsub("\\n.", "\n")
	local data = Render(elem)
	if data ~= nil then
		return pandoc.RawInline("html", data)
	else
		return nil
	end
end

return { { CodeBlock = RenderCodeBlock, Code = RenderCode } }
