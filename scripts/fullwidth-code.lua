function inspect(o)
   if type(o) == 'table' then
      local s = '{ '
      for k,v in pairs(o) do
         if type(k) ~= 'number' then k = '"'..k..'"' end
         s = s .. '['..k..'] = ' .. inspect(v) .. ','
      end
      return s .. '} '
   else
      return tostring(o)
   end
end

function CodeBlock(elem)
    -- blocks = {}
    -- table.insert(blocks, pandoc.RawBlock("html", '<figure class="fullwidth">'))
    -- table.insert(blocks, elem)
    -- table.insert(blocks, pandoc.RawBlock("html", '</figure>'))
    -- return blocks
end
