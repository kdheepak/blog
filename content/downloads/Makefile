## Put this Makefile in your project directory---i.e., the directory
## containing the paper you are writing. Assuming you are using the
## rest of the toolchain here, you can use it to create .html, .tex,
## and .pdf output files (complete with bibliography, if present) from
## your markdown file. 
## -	Change the paths at the top of the file as needed.
## -	Using `make` without arguments will generate html, tex, and pdf 
## 	output files from all of the files with the designated markdown
##	extension. The default is `.md` but you can change this. 
## -	You can specify an output format with `make tex`, `make pdf` or 
## - 	`make html`. 
## -	Doing `make clean` will remove all the .tex, .html, and .pdf files 
## 	in your working directory. Make sure you do not have files in these
##	formats that you want to keep!

## Location of your working bibliography file
BIB = ./research.bib

## CSL stylesheet (located in the csl folder of the PREFIX directory).
CSL = ./styles/ieee.csl

PAPER = ./../../../pandoc-paper

SCRIPTS = ./../../scripts

MARKDOWN = ./../23-technical_writing

MARKDOWNFOLDER = ./..

OUTPUT = .

OUTPUTFILE = writing-papers-with-markdown

all: ieeepdf ieeedocx ieeehtml pdf docx html slidespdf

ieeepdf:
	pandoc -r markdown+table_captions+yaml_metadata_block -s -S --latex-engine=pdflatex --template=$(PAPER)/templates/ieee.template --filter pandoc-fignos --filter pandoc-eqnos --filter pandoc-tablenos --filter pandoc-citeproc --csl=$(PAPER)/styles/ieee.csl --bibliography=$(MARKDOWNFOLDER)/blog.bib -o $(OUTPUT)/$(OUTPUTFILE).ieee.pdf $(MARKDOWN).md --filter $(SCRIPTS)/comments.py --meta link-citations=true

ieeetex:
	pandoc -r markdown+table_captions+yaml_metadata_block -s -S --latex-engine=pdflatex --template=$(PAPER)/templates/ieee.template --filter pandoc-fignos --filter pandoc-eqnos --filter pandoc-tablenos --filter pandoc-citeproc --csl=$(PAPER)/styles/ieee.csl --bibliography=$(MARKDOWNFOLDER)/blog.bib -o $(OUTPUT)/$(OUTPUTFILE).ieee.tex $(MARKDOWN).md --filter $(SCRIPTS)/comments.py --meta link-citations=true


ieeedocx:
	pandoc --mathjax -r markdown+table_captions+yaml_metadata_block -s -S --filter pandoc-fignos --filter pandoc-eqnos --filter pandoc-tablenos --filter pandoc-citeproc --csl=$(PAPER)/styles/ieee.csl --bibliography=$(MARKDOWNFOLDER)/blog.bib -o $(OUTPUT)/$(OUTPUTFILE).ieee.docx $(MARKDOWN).md --reference-docx=$(PAPER)/templates/trans_jour.docx --filter $(SCRIPTS)/fix-latex-symbol.py --filter $(SCRIPTS)/comments.py --meta link-citations=true

ieeehtml:
	pandoc --mathjax -r markdown+table_captions+yaml_metadata_block -w html -s -S --template=$(PAPER)/templates/html.template --filter pandoc-fignos --filter pandoc-eqnos --filter pandoc-tablenos --filter pandoc-citeproc --csl=$(PAPER)/styles/ieee.csl --bibliography=$(MARKDOWNFOLDER)/blog.bib -o $(OUTPUT)/$(OUTPUTFILE).ieee.html $(MARKDOWN).md --filter $(SCRIPTS)/fix-latex-symbol.py --filter $(SCRIPTS)/comments.py --meta link-citations=true --filter $(SCRIPTS)/remove_ieeekeywords.py -c https://cdn.rawgit.com/thomaspark/pubcss/549f945ffeff64f1929011785adf1c8e75264058/formats/acm-sig/css/pub.css

pdf:
	pandoc -r markdown+table_captions+yaml_metadata_block -s -S --latex-engine=pdflatex --filter pandoc-fignos --filter pandoc-eqnos --filter pandoc-tablenos --filter pandoc-citeproc --csl=$(PAPER)/styles/ieee.csl --bibliography=$(MARKDOWNFOLDER)/blog.bib -o $(OUTPUT)/$(OUTPUTFILE).pdf $(MARKDOWN).md --filter $(SCRIPTS)/comments.py --meta link-citations=true --filter $(SCRIPTS)/remove_ieeekeywords.py

docx:
	pandoc --mathjax -r markdown+table_captions+yaml_metadata_block -s -S --filter pandoc-fignos --filter pandoc-eqnos --filter pandoc-tablenos --filter pandoc-citeproc --csl=$(PAPER)/styles/ieee.csl --bibliography=$(MARKDOWNFOLDER)/blog.bib -o $(OUTPUT)/$(OUTPUTFILE).docx $(MARKDOWN).md --filter $(SCRIPTS)/fix-latex-symbol.py --filter $(SCRIPTS)/comments.py --meta link-citations=true

html:
	pandoc --mathjax -r markdown+table_captions+yaml_metadata_block -w html -s -S --template=$(PAPER)/templates/html.template --filter pandoc-fignos --filter pandoc-eqnos --filter pandoc-tablenos --filter pandoc-citeproc --csl=$(PAPER)/styles/ieee.csl --bibliography=$(MARKDOWNFOLDER)/blog.bib -o $(OUTPUT)/$(OUTPUTFILE).html $(MARKDOWN).md --filter $(SCRIPTS)/fix-latex-symbol.py --filter $(SCRIPTS)/comments.py --meta link-citations=true --filter $(SCRIPTS)/remove_ieeekeywords.py -c https://cdn.rawgit.com/claymcleod/pandoc-academic-publication/ce07fa7a20af53cab8c8a50c5bad5ad15d726bba/assets/css/academic-pub.css

slidespdf:
	pandoc -r markdown+table_captions+yaml_metadata_block -s -S --latex-engine=pdflatex --filter $(SCRIPTS)/slides.py --filter $(SCRIPTS)/remove_ieeekeywords.py --filter pandoc-eqnos --filter pandoc-tablenos --filter pandoc-citeproc --csl=$(PAPER)/styles/ieee.csl --bibliography=$(MARKDOWNFOLDER)/blog.bib $< -t beamer -o $(OUTPUT)/$(OUTPUTFILE).slides.pdf $(MARKDOWN).md --meta link-citations=true

slideshtml:
	pandoc -t html5 --template=default.revealjs \
	--mathjax -r markdown+table_captions+yaml_metadata_block -S \
	--filter pandoc-citeproc --filter $(SCRIPTS)/remove_ieeekeywords.py \
	--csl=$(PAPER)/styles/ieee.csl --bibliography=$(MARKDOWNFOLDER)/blog.bib \
	--standalone --section-divs \
	--variable reveal-url=/../reveal.js \
	--variable theme="white" \
	--variable transition="linear" $(MARKDOWN).md -o $(OUTPUT)/$(OUTPUTFILE).slides.html

clean:
	rm -f *.html *.pdf *.tex *.aux *.log *.dvi *.docx *.out
