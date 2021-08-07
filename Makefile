clean:
	-rm -rf ./build

build:
	nim c -r website

deploy: clean build
	-git branch -D gh-pages
	-git push origin --delete gh-pages
	ghp-import -n -c "blog.kdheepak.com" -m "Publishing blog" -p -f build
