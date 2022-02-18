local mmdc = os.getenv("MMDC") or pandoc.system.get_working_directory() .. "/node_modules/.bin/mmdc"
if FORMAT == "docx" then
	filetype = "png"
else
	filetype = "svg"
end

local function savetmp(code, tmpfilename)
	local f = io.open(tmpfilename, "w")
	f:write(code)
	f:close()
	return tmpfilename
end

local function readtmp(filename)
	local img_data
	local r = io.open(filename, "rb")
	if r then
		img_data = r:read("*all")
		r:close()
	else
		-- TODO: print warning
	end
	return img_data
end

local function mermaid(code, attributes)
	local file = code
	local img_data, mt
	local width = 1000
	if attributes.file then
		mt, file = pandoc.mediabag.fetch(attributes.file)
	end

	if attributes.width then
		width = attributes.width
	end
	pandoc.system.with_temporary_directory("mermaid-tmp", function(tmpdir)
		pandoc.system.with_working_directory(tmpdir, function()
			local mmconf = io.open("mermaid-config.json", "w")
			mmconf:write('{"securityLevel": "loose"}')
			mmconf:close()

			local f = io.open("dsl.dsl", "w")
			f:write(file)
			f:close()
			local outputfile = "mermaid." .. filetype

			local final = pandoc.pipe(
				mmdc,
				{ "-i", "dsl.dsl", "-o", outputfile, "-c", "mermaid-config.json", "-b", "transparent", "-w", width },
				""
			)
			local r = io.open(outputfile, "rb")
			img_data = r:read("*all"):gsub("<br>", "<br/>")
			r:close()
		end)
	end)
	return img_data
end

function CodeBlock(block)
	-- table with all known generators :
	local converters = {
		mermaid = mermaid,
	}

	-- Check if a converter exists for this block. If not, return the block
	-- unchanged.
	local img_converter = converters[block.classes[1]]
	if not img_converter then
		return nil
	end

	-- Call the correct converter which belongs to the used class:
	local success, img = pcall(img_converter, block.text, block.attributes)
	-- Was ok?
	if success and img then
		-- Hash the figure name and content:
		fname = pandoc.system.get_working_directory() .. "/src/posts/images/" .. pandoc.sha1(img) .. "." .. filetype

		local f = io.open(fname, "w")
		f:write(img)
		f:close()
	else
		-- an error occured; img contains the error message
		io.stderr:write(tostring(img))
		io.stderr:write("\n")
		error("Image conversion failed. Aborting.")
	end

	-- Case: This code block was an image , etc.:
	if fname then
		-- Define the default caption:
		local caption = {}

		local identifier = block.identifier

		-- If the user defines a caption, use it:
		if block.attributes["caption"] then
			caption = pandoc.read(block.attributes.caption).blocks[1].content

			-- This is pandoc's current hack to enforce a caption:
			if identifier == nil then
				identifier = "fig:"
			end
		end

		-- Create a new image for the document's structure. Attach the user's
		-- caption. Also use a hack (fig:) to enforce pandoc to create a
		-- figure i.e. attach a caption to the image.
		local imgObj = pandoc.Image(caption, fname, identifier)

		-- Now, transfer the attribute "name" from the code block to the new
		-- image block. It might gets used by the figure numbering lua filter.
		-- If the figure numbering gets not used, this additional attribute
		-- gets ignored as well.
		if block.attributes["name"] then
			imgObj.attributes["name"] = block.attributes["name"]
		end

		if block.identifier then
			imgObj.identifier = block.identifier
		end

		-- Finally, put the image inside an empty paragraph. By returning the
		-- resulting paragraph object, the source code block gets replaced by
		-- the image:
		return pandoc.Para({ imgObj })
	end
end
