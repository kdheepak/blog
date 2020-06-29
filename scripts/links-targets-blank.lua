-- Add target="_blank" attributes to all links in a Pandoc document

local function add_target_blank (link)
    if string.match(link.target, "^http") ~= true and string.match(link.target, "blog.kdheepak.com") == false then  -- here .target == href attribute
        link.attributes.target = '_blank'       -- here .target == target attribute
    end
    return link
end

-- remove lines 4 and 6 to add target="_blank" to all links, not just http(s)

return {
    { Link = add_target_blank }
}
