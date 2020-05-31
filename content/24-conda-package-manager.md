---
title: Using conda to manage packages
date: 2015-12-25T04:32:51-06:00
tags: python
summary: Use conda env to manage packages
keywords: python, acaconda, conda, environment, pip, conda vs pip
slug: using-conda-to-manage-packages
category: blog
alias: /blog/using-conda-to-manage-packages
bibliography: blog.bib
---

# Why use conda

The following quote is from Conda's github page [@noauthor_conda/conda_nodate]

> Conda is a cross-platform, Python-agnostic binary package manager. It is the package manager used by Anaconda installations, but it may be used for other systems as well. Conda makes environments first-class citizens, making it easy to create independent environments even for C libraries. Conda is written entirely in Python, and is BSD licensed open source.

The main advantage of using conda to manage your packages and environment is that it will work across platforms

![Slide deck [@noauthor_conda_nodate:] comparing package managers in different platforms](images/condacrossplatform.jpg)

conda also uses hard linking, so it is inexpensive to create multiple copies of the same package

# How to

One simple way to start is to first specify a `environment.yml` file

    # environment.yml
    name: psst-env
    dependencies:
    - python
    - nose
    - numpy
    - pandas
    - pip:
        - pyomo

The name of the environment can be changed. Activate the environment by using the following.

    source activate psst-env

Then you can create the environment by

    conda env create

You can update the environment after adding a package to `environment.yml` by using the following

    conda env update

Alternatively, you can create a new empty environment by using either one of the following

    conda create -n pelican-env python=2
    conda create --name pelican-env python=2

In this case, `pelican-env` is the name of the environment.
You can follow the name of the environment with all the packages you want separated by spaces.
You must have atleast one package to create a environment.

After the environment is created, you can source the environment :

    source activate pelican-env

You can install packages here using one of the following :

    conda install <PACKAGE-NAME>

When you have set up the environment and would like to share it, you can run the following to generate a .yml file

    conda env export

I like to update by `environment.yml` by running the following

    conda env export > environment.yml
