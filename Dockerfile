ARG base_tag="edge"
FROM pandoc/ubuntu:${base_tag}

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
                       gcc \
                       g++

RUN pip3 install setuptools --upgrade && \
  pip3 install pandocfilters && \
  pip3 install pandoc-fignos && \
  pip3 install pandoc-eqnos && \
  pip3 install pandoc-tablenos

RUN CHOOSENIM_CHOOSE_VERSION="1.2.0" curl https://nim-lang.org/choosenim/init.sh -sSf | bash -s -- "-y"
ENV PATH=/root/.nimble/bin:$PATH

ADD . /nim
WORKDIR /nim

RUN nim c website.nim

RUN nim --version
RUN pandoc --version
RUN python3 --version

ENTRYPOINT /nim/website
