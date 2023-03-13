const srcFilePath = "./_site/index-julia.xml"
const dstFilePath = "./_site/tags/julia/rss.xml"
mkpath(dirname(dstFilePath))
cp(srcFilePath, dstFilePath, force=true)
