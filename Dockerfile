FROM ubuntu:20.10

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update && \
    apt-get install -y git \
                       vim \
                       wget \
                       curl \
                       zip \
                       unzip \
                       make \
                       pandoc \
                       pandoc-citeproc \
                       pandoc-sidenote \
                       python3 \
                       python3-pip

RUN pip install setuptools --upgrade && \
  pip install pandoc-fignos && \
  pip install pandoc-eqnos && \
  pip install pandoc-tablenos

RUN apt-get -y install xz-utils make
RUN CHOOSENIM_CHOOSE_VERSION="1.2.0" curl https://nim-lang.org/choosenim/init.sh -sSf | bash -s -- "-y"
