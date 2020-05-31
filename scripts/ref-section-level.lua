function Header(elem)
    -- io.stderr:write(elem.t, "\n")
    -- elem.t = "Span"
    -- io.stderr:write(elem.t, "\n")
    -- return pandoc.Span(elem.c[1].c, {id = '', class = 'sidenote'})
    if elem.identifier == "bibliography" then
        elem.level = 1
    end
    return elem
end

