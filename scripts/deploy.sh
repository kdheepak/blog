#!/usr/bin/env sh
# abort on errors
set -e
NODE_ENV=production npm run build
cd build
git init
git add -A
git commit -m 'deploy' -n
git push -f git@github.com:kdheepak/blog.git main:gh-pages
cd -
