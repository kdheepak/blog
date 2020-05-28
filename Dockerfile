FROM ubuntu:20.10

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
                       pandoc \
                       pandoc-citeproc \
                       pandoc-sidenote \
                       python3 \
                       python3-pip \
                       gcc \
                       g++

RUN pip install setuptools --upgrade && \
  pip install pandocfilters && \
  pip install pandoc-fignos && \
  pip install pandoc-eqnos && \
  pip install pandoc-tablenos

RUN CHOOSENIM_CHOOSE_VERSION="1.2.0" curl https://nim-lang.org/choosenim/init.sh -sSf | bash -s -- "-y"

ENV PATH=/root/.nimble/bin:$PATH

ADD . /nim
WORKDIR /nim

RUN nim c website.nim

RUN nim --version
RUN pandoc --version
RUN python --version

ENTRYPOINT /nim/website
