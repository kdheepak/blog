---
title: Better git workflows using pre-commit hooks
category: blog
date: 2020-07-27T10:58:11-06:00
tags: git, python
keywords: git, python, pre-commit, pre-commit hooks
summary: In this post, I will summarize through how to automate git workflows with pre-commit hooks
references:
- id: ljvmiranda921
  title: "Automate Python workflow using pre-commits: black and flake8"
  URL: https://ljvmiranda921.github.io/notebook/2018/06/21/precommits-using-black-and-flake8/
nocite: |
  @ljvmiranda921
---

## Using `pre-commit`

Using [`pre-commit`](https://pre-commit.com/) requires adding a `.pre-commit-hooks.yaml` file to the git repository, and running `pre-commit install`.

1) Add a file called `.pre-commit-hooks.yaml` to your git repository.
2) Add the hooks you want in that file:
   ```yaml
   # cat /path/to/gitrepos/reponame/.pre-commit-hooks.yaml
   repos:
   - repo: https://github.com/pre-commit/pre-commit-hooks
     rev: v3.1.0
     hooks:
         - id: trailing-whitespace
         - id: check-executables-have-shebangs
         - id: check-json
         - id: check-case-conflict
         - id: check-toml
         - id: check-merge-conflict
         - id: check-xml
         - id: check-yaml
         - id: end-of-file-fixer
         - id: check-symlinks
         - id: fix-encoding-pragma
         - id: mixed-line-ending
         - id: pretty-format-json
           args: [--autofix]
   - repo: https://gitlab.com/pycqa/flake8
     rev: 3.8.3
     hooks:
         - id: flake8
   - repo: https://github.com/ambv/black
     rev: 19.10b0
     hooks:
         - id: black
           args: [--line-length=150, --safe]
   ```
3) Install `pre-commit`.
   ```bash
   pip install pre-commit
   ```
4) Run `pre-commit install` inside the `.git` directory.

## Using `setup.py` to install `pre-commit` hooks

Add a `PostDevelopCommand` hook to run `pre-commit install` when setting up a python package using `setup.py`.

```python
import os
import logging
from codecs import open
from setuptools import setup, find_packages
from setuptools.command.develop import develop
from subprocess import check_call
import shlex

# Create post develop command class for hooking into the python setup process
# This command will run after dependencies are installed
class PostDevelopCommand(develop):
    def run(self):
        try:
            check_call(shlex.split("pre-commit install"))
        except Exception as e:
            logger.warning("Unable to run 'pre-commit install'")
        develop.run(self)

install_requires = ["networkx"] # alternatively, read from `requirements.txt`
extra_requires = ["pandas"]     # optional dependencies
test_requires = ["pytest"]      # test dependencies
dev_requires = ["pre-commit"]   # dev dependencies

setup(
    name="packagename",
    version="v0.1.0",
    install_requires=install_requires,
    extras_require={
        "test": test_requires,
        "extra": extra_requires,
        "dev": test_requires + extra_requires + dev_requires,
    },
    cmdclass={"develop": PostDevelopCommand},
)
```

Then run the following the first time you want to start working on the project:

```bash
pip install -e ".[dev]"
```

This will install `install_requires`, `test_requires`, `extra_requires` and `dev_requires`.
This will also run `pre-commit install` in the git repository, which will add the hooks from the `.pre-commit-hooks.yaml` file.

If you don't want to automatically run `pre-commit install`, remove the `cmdclass={"develop": PostDevelopCommand}` line in the `setup(...)` function arguments.

## Using `pre-commit-hooks` for all git repositories on your machine

If you want to use `pre-commit-hooks` for all git repositories on your machine, you can set up a `git-templates` folder that is used as a `templatedir` when you run `git init`.

Add the following to your `~/.gitconfig` file [^gitconfig].

[^gitconfig]:
    On Windows, the file is located at `C:\Users\USERNAME\.gitconfig`.
    Also, `git` will not create this file unless you ask for it.
    You can create it by running `git config --global --edit`.

```gitconfig
[init]
  templatedir = ~/gitrepos/git-templates
```

You will also need to create a `~/gitrepos/dotfiles/git-templates` folder with a single folder inside it called `hooks`, and with a single executable file inside the `hooks` folder called `pre-commit`.

```bash
$ tree git-templates
git-templates
└── hooks
   └── pre-commit*
```

The `pre-commit` file must be an executable shell script.
You can create a text file and make it executable by running `chmod +x pre-commit`.
In that file, you can run `pre-commit` and point it to the `.pre-commit-config.yaml` that you wish to use.

Here is what my `git-templates/hooks/pre-commit` file looks like:

```bash
#!/bin/sh

pre-commit run --config ~/gitrepos/dotfiles/.pre-commit-config.yaml
```

You can place the `.pre-commit-config.yaml` anywhere. I have mine in my `dotfiles` repository.
If you have done all this and set it up correctly, then the next time you run `git init`, this pre-commit hook will automatically be added to your git repository.

## `git commit --no-verify`

Finally, if you want to bypass the `pre-commit` hooks occasionally in special circumstances, you can add the `--no-verify` flag to your `git commit` command.

```bash
git commit --no-verify
```

This will run `git commit` without any `pre-commit` hooks.
