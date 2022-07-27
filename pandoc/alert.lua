function Div(el)
  if el.classes:includes("exercise") then
    local inlines = pandoc.List:new({})
    inlines[1] = pandoc.Str("🥋")
    inlines[2] = pandoc.Space()
    for j = 1, #el.c[1].c do
      inlines[j + 2] = el.c[1].c[j]
    end
    return pandoc.Div(pandoc.Para(inlines), el.attr)
  end
  if el.classes:includes("note") then
    local inlines = pandoc.List:new({})
    inlines[1] = pandoc.Str("📝")
    inlines[2] = pandoc.Space()
    for j = 1, #el.c[1].c do
      inlines[j + 2] = el.c[1].c[j]
    end
    return pandoc.Div(pandoc.Para(inlines), el.attr)
  end
  if el.classes:includes("tip") then
    local inlines = pandoc.List:new({})
    inlines[1] = pandoc.Str("💡")
    inlines[2] = pandoc.Space()
    for j = 1, #el.c[1].c do
      inlines[j + 2] = el.c[1].c[j]
    end
    return pandoc.Div(pandoc.Para(inlines), el.attr)
  end
  if el.classes:includes("todo") then
    local inlines = pandoc.List:new({})
    inlines[1] = pandoc.Str("🚧")
    inlines[2] = pandoc.Space()
    for j = 1, #el.c[1].c do
      inlines[j + 2] = el.c[1].c[j]
    end
    return pandoc.Div(pandoc.Para(inlines), el.attr)
  end
  if el.classes:includes("info") then
    local inlines = pandoc.List:new({})
    inlines[1] = pandoc.Str("ℹ")
    inlines[2] = pandoc.Space()
    for j = 1, #el.c[1].c do
      inlines[j + 2] = el.c[1].c[j]
    end
    return pandoc.Div(pandoc.Para(inlines), el.attr)
  end
  if el.classes:includes("error") then
    local inlines = pandoc.List:new({})
    inlines[1] = pandoc.Str("❗")
    inlines[2] = pandoc.Space()
    for j = 1, #el.c[1].c do
      inlines[j + 2] = el.c[1].c[j]
    end
    return pandoc.Div(pandoc.Para(inlines), el.attr)
  end
  if el.classes:includes("success") then
    local inlines = pandoc.List:new({})
    inlines[1] = pandoc.Str("✓")
    inlines[2] = pandoc.Space()
    for j = 1, #el.c[1].c do
      inlines[j + 2] = el.c[1].c[j]
    end
    return pandoc.Div(pandoc.Para(inlines), el.attr)
  end
  if el.classes:includes("hint") then
    local inlines = pandoc.List:new({})
    inlines[1] = pandoc.Str("🔎")
    inlines[2] = pandoc.Space()
    for j = 1, #el.c[1].c do
      inlines[j + 2] = el.c[1].c[j]
    end
    return pandoc.Div(pandoc.Para(inlines), el.attr)
  end
  if el.classes:includes("warning") then
    local inlines = pandoc.List:new({})
    inlines[1] = pandoc.Str("❓")
    inlines[2] = pandoc.Space()
    for j = 1, #el.c[1].c do
      inlines[j + 2] = el.c[1].c[j]
    end
    return pandoc.Div(pandoc.Para(inlines), el.attr)
  end
end
