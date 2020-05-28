ARG pandoc_version

FROM pandoc/latex:2.9.2.1

# get crossref
RUN wget -O- "https://github.com/lierdakil/pandoc-crossref/releases/download/v0.3.6.3/pandoc-crossref-Linux-2.9.2.1.tar.xz" | tar zx -C/usr/bin/ ./pandoc-crossref

# install python
RUN apk add make \
    python3 \
    py3-psutil \
    && python3 -m pip install --upgrade pip \
    && pip3 install \
    pandoc-eqnos \
    pandoc-fignos \
    pandoc-secnos \
    pandoc-tablenos
