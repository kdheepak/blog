---
title: Do developers alliterate package and language names?
tags: analysis
keywords: python, julia, rust
summary: I was curious how package names were chosen in various language ecosystems.
date: 2022-07-29T01:47:12-0600
---

I'm interested in understanding if there was a trend in choosing package names in various programming ecosystems.
Specifically, I wanted to know if package authors choose package names that are alliterated with the name of the programming language.

We can "bucket" the package names by their starting letter and count the number of packages in each bucket, also known as a frequency plot.

First let's install a couple of useful packages.

```bash
python -m pip install requests beautifulsoup4 pandas matplotlib
```

The following is the code I'm using:

```{.python .collapse}
%matplotlib inline
import matplotlib.pyplot as plt

plt.rc("font", size = 12)

from collections import defaultdict

def frequency_plot(items, lang, kind="packages"):
    bucket = defaultdict(lambda: 0)
    colors = defaultdict(lambda: "grey")
    for i in items:
        i = i.strip()
        bucket[i[0].lower()] += 1
    if kind=="packages":
        colors[lang[0].lower()] = "orange"
    keys = [k for k in sorted(list(bucket.keys())) if k.isalpha()]

    fig, axs = plt.subplots(1,1,figsize=(16,10))
    ax = axs
    ax.bar(keys, [bucket[k] for k in keys], color=[colors[k] for k in keys])
    total = sum(bucket[k] for k in keys)
    rects = ax.patches
    for rect, k in zip(rects, keys):
        height = rect.get_height()
        ax.text(
            rect.get_x() + rect.get_width() / 2, height + 5, f"{round(bucket[k] / total * 100, 1)}%", ha="center", va="bottom"
        )

    ax.set_title(f"Total {kind} in {lang}: {total}")
    ax.set_ylabel("Count")
    ax.set_xlabel("First Letter")
    return ax
```

## English

For a reference case, let's plot the distribution of words in the English, per the list in `/usr/share/dict/words` on my MacOS 12.5.

```python
with open("/usr/share/dict/words") as f:
    words = set(f.read().split())

frequency_plot(words, "/usr/share/dict/words", kind="words")
```

```{.python .hide}
plt.savefig("./images/word-names.png", dpi=300, transparent=True);
```

![](./images/word-names.png)

## Python

```python
import requests
r = requests.get("https://pypi.org/simple")
text = r.text
from bs4 import BeautifulSoup
soup = BeautifulSoup(text, 'html.parser')
packages = set()
for link in soup.find_all("a", href=True):
    packages.add(link.contents[0])

frequency_plot(packages, "Python")
```

```{.python .hide}
plt.savefig("./images/python-package-names.png", dpi=300, transparent=True);
```

![](./images/python-package-names.png)

## Julia

```python
import os
packages = set()
for root, folders, files in os.walk(os.path.expanduser("~/.julia/registries/General/")):
    for folder in folders:
        if len(folder) > 1:
            packages.add(folder)

frequency_plot(packages, "Julia")
```

```{.python .hide}
plt.savefig("./images/julia-package-names.png", dpi=300, transparent=True);
```

![](./images/julia-package-names.png)

## Rust

```python
import pandas as pd
packages = set(pd.read_csv("~/Downloads/2022-07-29-020018/data/crates.csv")["name"].dropna())

frequency_plot(packages, "Rust")
```

```{.python .hide}
plt.savefig("./images/rust-package-names.png", dpi=300, transparent=True);
```

![](./images/rust-package-names.png)
