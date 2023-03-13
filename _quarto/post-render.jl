# Setup RSS

const srcFilePath = "./_site/index-julia.xml"
const dstFilePath = "./_site/tags/julia/rss.xml"
mkpath(dirname(dstFilePath))
cp(srcFilePath, dstFilePath, force=true)

# Setup downloads

cp("./_quarto/downloads", "./_site/downloads", force=true)

# Setup CNAME

cp("./_quarto/CNAME", "./_site/CNAME", force=true)
