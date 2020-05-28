FROM ubuntu:20.10

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
                       python3
