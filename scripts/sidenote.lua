i = 1
j = 1

function getMarginNote(elem)
    table.remove(elem.c[1].c,1)
    table.remove(elem.c[1].c,1)
    table.remove(elem.c[1].c,1)
    content = {
        pandoc.RawInline('html', '<label for="mn-' .. j .. '" class="margin-toggle">&#8853;</label>'),
        pandoc.RawInline('html', '<input type="checkbox" id="mn-' .. j .. '" class="margin-toggle"/>'),
        pandoc.Span(elem.c[1].c, {id = '', class = 'marginnote'}),
    }
    j = j + 1
    return pandoc.Span(content, {})
end

function getSideNote(elem)
    content = {
        pandoc.RawInline('html', '<label for="sn-' .. i .. '" class="sidenote-number margin-toggle"></label>'),
        pandoc.RawInline('html', '<input type="checkbox" id="sn-' .. i .. '" class="margin-toggle"/>'),
        pandoc.Span(elem.c[1].c, {id = '', class = 'sidenote'}),
    }
    i = i + 1
    return pandoc.Span(content, {})
end

function Note(elem)
    if elem.c[1].t == "Para" then
        p = elem.c[1]
        if p.c[1].t == "Emph" and p.c[1].c[1].t == "Str" and p.c[1].c[1].c == "aside" and p.c[2].t == "Str" and p.c[2].c == ":" and p.c[3].t == "Space" then
            return getMarginNote(elem)
        else
            return getSideNote(elem)
        end
    else
        return getSideNote(elem)
    end
end
