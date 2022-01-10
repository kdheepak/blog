local function add_target_blank(link)
	if string.match(link.target, "^http") and (not string.match(link.target, "blog.kdheepak.com")) then
		link.attributes.target = "_blank"
	end
	return link
end

return {
	{ Link = add_target_blank },
}
