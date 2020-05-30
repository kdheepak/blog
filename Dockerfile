FROM ubuntu:20.10

ARG PANDOC_VERSION=2.9.2.1
ADD https://github.com/jgm/pandoc/releases/download/${PANDOC_VERSION}/pandoc-${PANDOC_VERSION}-linux-amd64.tar.gz pandoc.tar.gz
RUN tar -zxvf pandoc.tar.gz
RUN mv pandoc-${PANDOC_VERSION}/bin/pandoc /usr/local/bin/pandoc
RUN mv pandoc-${PANDOC_VERSION}/bin/pandoc-citeproc /usr/local/bin/pandoc-citeproc

ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update && \
    apt-get install -y git \
                       vim \
                       wget \
                       curl \
                       zip \
                       unzip \
                       xz-utils \
                       make \
                       pandoc-sidenote \
                       python3 \
                       python3-pip \
                       nim \
                       gcc \
                       g++

ARG PANDOC_SIDENOTE_VERSION=0.20.0
ADD https://github.com/jez/pandoc-sidenote/releases/download/${PANDOC_SIDENOTE_VERSION}/pandoc-sidenote-${PANDOC_SIDENOTE_VERSION}.zip pandoc-sidenote.zip
RUN unzip pandoc-sidenote.zip
RUN mv pandoc-sidenote /usr/local/bin/pandoc-sidenote

RUN pip3 install setuptools --upgrade && \
  pip3 install pandocfilters && \
  pip3 install pandoc-fignos && \
  pip3 install pandoc-eqnos && \
  pip3 install pandoc-tablenos

COPY ./website.nim /nim/website.nim
WORKDIR /nim

RUN nim c website.nim

RUN nim --version
RUN python3 --version
RUN pandoc --version
RUN pandoc-citeproc --version

ENTRYPOINT /nim/website
