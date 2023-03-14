# Setup RSS

const srcFilePath = "./_site/index-julia.xml"
const dstFilePath = "./_site/tags/julia/rss.xml"
mkpath(dirname(dstFilePath))
cp(srcFilePath, dstFilePath, force=true)

# Setup downloads

cp("./_quarto/downloads", "./_site/downloads", force=true)

# Setup CNAME

cp("./_quarto/CNAME", "./_site/CNAME", force=true)

# RSS style

cp("./_quarto/index.xsl", "./_site/index.xsl", force=true)
lines = readlines("./_site/index.xml")
insert!(lines, 2, raw"""<?xml-stylesheet type="text/xsl" media="screen" href="/index.xsl"?>""")
open("./_site/index.xml", "w") do f
  write(f, join(lines, "\n"))
end

cp("./_quarto/styles.css", "./_site/styles.css", force=true)
cp("./_quarto/favicon.svg", "./_site/favicon.svg", force=true)
