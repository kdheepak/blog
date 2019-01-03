clean:
	-rm -rf ./build

publish:
	../magic-night-panda/mnp

deploy: clean publish
	-git branch -D gh-pages
	-git push origin --delete gh-pages
	ghp-import -n -c "blog.kdheepak.com" -m "Publishing blog" -p -f build
