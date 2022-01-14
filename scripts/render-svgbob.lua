local outputdir = io.open("src/posts/rendered", "r")
if outputdir ~= nil then
	io.close(outputdir)
else
	os.execute("mkdir src/posts/rendered")
end

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
		return { "svgbob", params, text }, "svg"
	end,
}

images = {}

function Cleanup(doc)
	local pfile = io.popen("ls -a src/posts/rendered/*.png src/posts/rendered/*.svg 2> /dev/null")
	for fname in pfile:lines() do
		if not images[fname] then
			os.remove(fname)
		end
	end
	pfile:close()
	return nil
end

function Render(elem, attr)
	for format, render_cmd in pairs(renderer) do
		if elem.classes[1] == format then
			local cmd, filetype = render_cmd(elem.text, elem.attributes or {})
			local mimetype = "image/" .. filetype
			local fname = "rendered/"
				.. format
				.. "-"
				.. pandoc.sha1(cmd[1] .. table.concat(cmd[2], " ") .. cmd[3])
				.. "."
				.. filetype
			local fpath = "src/posts/rendered/"
				.. format
				.. "-"
				.. pandoc.sha1(cmd[1] .. table.concat(cmd[2], " ") .. cmd[3])
				.. "."
				.. filetype
			local data = nil

			local f = io.open(fpath, "rb")
			if f ~= nil then
				-- io.stderr:write("cached " .. format .. " found\n")
				data = f:read("*all")
				f:close()
			else
				-- io.stderr:write("call " .. format .. "\n")
				data = pandoc.pipe(cmd[1], cmd[2], cmd[3])
				local f = io.open(fpath, "wb")
				f:write(data)
				f:close()
			end
			images[fpath] = true
			pandoc.mediabag.insert(fpath, mimetype, data)
			return fname
		end
	end
	return nil
end

function RenderCodeBlock(elem, attr)
	local fname = Render(elem, attr)
	if fname ~= nil then
		return pandoc.Para({ pandoc.Image({ pandoc.Str("") }, fname) })
	else
		return nil
	end
end

function RenderCode(elem, attr)
	elem.text = elem.text:gsub("\\n.", "\n")
	local fname = Render(elem, attr)
	if fname ~= nil then
		return pandoc.Image({ pandoc.Str("") }, fname)
	else
		return nil
	end
end

function ModifyCode(elem, attr)
	if elem.classes[1] == "render_mermaid" then
		io.stderr:write("mermaid found\n")
		new_elem = pandoc.Div({ pandoc.Plain({ pandoc.Str(elem.text) }) })
		table.insert(new_elem.classes, "mermaid")
		return new_elem
	end
	return nil
end

return { { CodeBlock = RenderCodeBlock, Code = RenderCode }, { CodeBlock = ModifyCode }, { Pandoc = Cleanup } }
