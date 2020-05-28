ARG pandoc_version

FROM pandoc/latex:2.9.2.1

RUN apt-get update && \
    apt-get install -y pandoc \
                       pandoc-citeproc \
                       pandoc-sidenote

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
