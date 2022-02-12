local renderer = {
	render_dot = function(text, attrs)
		if attrs[1] then
			attrs = attrs[1][2]
		end
		params = { "-Tsvg" }
		for w in attrs:gmatch("%S+") do
			table.insert(params, w)
		end
		return { "dot", params, text }, "svg"
	end,
	render_qr = function(text, attrs)
		if attrs[1] then
			attrs = attrs[1][2]
		end
		params = { "-o", "-" }
		for w in attrs:gmatch("%S+") do
			table.insert(params, w)
		end
		return { "qrencode", params, text }, "png"
	end,
	render_svgbob = function(text, attrs)
		-- io.stderr:write("svgbob found: " .. text .. "\n")
		params = { "--background", "transparent" }
		return { "svgbob_cli", params, text }, "svg"
	end,
}

function Render(elem, attr)
	for format, render_cmd in pairs(renderer) do
		if elem.classes[1] == format then
			local cmd, _ = render_cmd(elem.text, elem.attributes or {})
			local data = pandoc.pipe(cmd[1], cmd[2], cmd[3])
			return data
		end
	end
	return nil
end

function RenderCodeBlock(elem, attr)
	local data = Render(elem, attr)
	if data ~= nil then
		return pandoc.Para({ pandoc.RawInline("html", data) })
	else
		return nil
	end
end

function RenderCode(elem, attr)
	elem.text = elem.text:gsub("\\n.", "\n")
	local data = Render(elem, attr)
	if data ~= nil then
		return pandoc.RawInline("html", data)
	else
		return nil
	end
end

return { { CodeBlock = RenderCodeBlock, Code = RenderCode } }
