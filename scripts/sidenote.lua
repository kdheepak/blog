i = 1

function Note(elem)
    -- io.stderr:write(elem.t, "\n")
    -- elem.t = "Span"
    -- io.stderr:write(elem.t, "\n")
    -- return pandoc.Span(elem.c[1].c, {id = '', class = 'sidenote'})
    content = {
        pandoc.RawInline('html', '<label for="sn-' .. i .. '" class="sidenote-number margin-toggle"/>'),
        pandoc.RawInline('html', '<input type="checkbox" id="sn-' .. i .. '" class="margin-toggle"/>'),
        pandoc.Span(elem.c[1].c, {id = '', class = 'sidenote'}),
    }
    i = i + 1
    return pandoc.Span(content, {})
end
