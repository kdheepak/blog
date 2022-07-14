--- standard-code: ouput code blocks with class="language-*" attributes
-- © 2020 Aman Verma. Distributed under the MIT license.

local languages = {
	abap = true,
	["actionscript-3"] = true,
	ada = true,
	apache = true,
	apex = true,
	apl = true,
	applescript = true,
	asm = true,
	astro = true,
	awk = true,
	ballerina = true,
	bat = true,
	bash = true,
	zsh = true,
	berry = true,
	bibtex = true,
	bicep = true,
	c = true,
	clojure = true,
	cobol = true,
	codeql = true,
	coffee = true,
	["cpp-macro"] = true,
	cpp = true,
	crystal = true,
	csharp = true,
	css = true,
	cue = true,
	d = true,
	dart = true,
	diff = true,
	docker = true,
	["dream-maker"] = true,
	elixir = true,
	elm = true,
	erb = true,
	erlang = true,
	fish = true,
	fsharp = true,
	gherkin = true,
	["git-commit"] = true,
	["git-rebase"] = true,
	gnuplot = true,
	go = true,
	graphql = true,
	groovy = true,
	hack = true,
	haml = true,
	handlebars = true,
	haskell = true,
	hcl = true,
	hlsl = true,
	html = true,
	ini = true,
	java = true,
	javascript = true,
	["jinja-html"] = true,
	jinja = true,
	json = true,
	jsonc = true,
	jsonnet = true,
	jssm = true,
	jsx = true,
	julia = true,
	jupyter = true,
	kotlin = true,
	latex = true,
	less = true,
	lisp = true,
	logo = true,
	lua = true,
	make = true,
	markdown = true,
	matlab = true,
	mdx = true,
	nginx = true,
	nim = true,
	nix = true,
	["objective-c"] = true,
	["objective-cpp"] = true,
	ocaml = true,
	pascal = true,
	perl = true,
	["php-html"] = true,
	php = true,
	plsql = true,
	postcss = true,
	powershell = true,
	prisma = true,
	prolog = true,
	pug = true,
	puppet = true,
	purescript = true,
	python = true,
	r = true,
	raku = true,
	razor = true,
	rel = true,
	riscv = true,
	ruby = true,
	rust = true,
	sas = true,
	sass = true,
	scala = true,
	scheme = true,
	scss = true,
	shaderlab = true,
	shellscript = true,
	smalltalk = true,
	solidity = true,
	sparql = true,
	sql = true,
	["ssh-config"] = true,
	stata = true,
	stylus = true,
	svelte = true,
	swift = true,
	["system-verilog"] = true,
	tasl = true,
	tcl = true,
	tex = true,
	toml = true,
	tsx = true,
	turtle = true,
	twig = true,
	typescript = true,
	vb = true,
	verilog = true,
	vhdl = true,
	viml = true,
	vim = true,
	["vue-html"] = true,
	vue = true,
	wasm = true,
	wenyan = true,
	xml = true,
	xsl = true,
	yaml = true,
}

local function escape(s)
	-- Escape according to HTML 5 rules
	return s:gsub([=[[<>&"']]=], function(x)
		if x == "<" then
			return "&lt;"
		elseif x == ">" then
			return "&gt;"
		elseif x == "&" then
			return "&amp;"
		elseif x == '"' then
			return "&quot;"
		elseif x == "'" then
			return "&#39;"
		else
			return x
		end
	end)
end

function startswith(text, prefix)
	return text:find(prefix, 1, true) == 1
end

local function getCodeClass(classes)
	-- Check if the first element of classes (pandoc.CodeBlock.classes) matches a
	-- programming language name. If it does, it gets removed from classes and a valid
	-- HTML class attribute string (with space at beginning) is returned.
	if classes[1] and languages[classes[1]] then
		local cls = table.remove(classes, 1)
		if cls == "zsh" or cls == "bash" then
			cls = "fish"
		end
		if cls == "vim" then
			cls = "viml"
		end
		return ' class="language-' .. cls .. '"'
	else
		return " "
	end
end

local function makeIdentifier(ident)
	-- Returns a valid HTML id attribute (with space at beginning) OR empty string.

	if #ident ~= 0 then
		return ' id="' .. ident .. '"'
	else
		return ""
	end
end

local function makeClasses(classes)
	-- Returns a valid HTML class attribute with classes separated by spaces (with a space
	-- at the beginning) OR empty string.

	if #classes ~= 0 then
		return ' class="' .. table.concat(classes, " ") .. '"'
	else
		return ""
	end
end

return {
	{
		CodeBlock = function(elem)
			if FORMAT ~= "html" then
				return nil
			end

			id = makeIdentifier(elem.identifier)
			classLang = getCodeClass(elem.classes)
			classReg = makeClasses(elem.classes)

			local preCode = string.format(
				"<pre%s%s><code%s>%s</code></pre>",
				id,
				classReg,
				classLang,
				escape(elem.text)
			)
			return pandoc.RawBlock("html", preCode, "RawBlock")
		end,
	},
}
