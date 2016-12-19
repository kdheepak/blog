---
title: My Python 2 vs 3 problem
date: Fri Dec 16 15:31:07 MST 2016
tags: python
summary: Some of my thoughts on the current state of Python 2 vs 3
keywords: python, python2, python3
slug: my-python-2-vs-3-problem
category: blog
alias: /blog/my-python-2-vs-3-problem
---

This post is an account of my personal experience.
I'm interested in hearing other people's opinions and having an open discussion on best practices to develop in Python.
For the rest of this post, when I mention Python2 / Python3 please infer that I am referring to Python 2.7 / Python 3.5 respectively.

# My Python 2 vs 3 Problem

A lot of people talk about Python2 vs Python3, and having to make a choice between them.
Some beginners venturing to learn Python may be posed with this question themselves.
I've seen discussions claim that the main issue with picking Python3 is that most packages that were written for Python2 are not compatible with Python3.
and I've also seen the counter arguments that show that the number of Python2 packages that don't support Python3 is insignificant.
It is true that a large number of PyPi packages are now compatible with both Python2 and Python3.
If I had to list the biggest changes in Python3 from Python2 that made the jump between versions difficult, it would be
the core updates to the CPython API and the implementation of Unicode everywhere.
The changes to CPython API made it difficult to move packages across versions that heavily relied on C code.
This de-incentivised other tools that relied on packages to make the switch as well.
Several of the scientific python stack faced this issue.
Fortunately, thanks to the efforts of some incredibly smart and dedicated people, NumPy, SciPy, Pandas, Matplotlib now all support Python 3.5.
In arguably one of the more contentious decisions, Python3 also changed strings to handled as Unicode by default. 
This, as a result made thinking about unicode a more conscious decision^[__aside__: I highly recommend checking out [Ned Batchelder's talk](https://www.youtube.com/watch?v=sgHbC6udIqc) titled "Pragmatic Unicode, or, How do I stop the pain?" for an excellent summary on how to deal with unicode issues.]
Python3 makes dealing with unicode a lot easier, by providing error messages during compilation time instead of run time.
With this change however, packages that often dealt with bytes/text/strings required some serious retooling.
Many programs in the web stack in the Python world have taken time to move to the latest versions of Python.
There are multiple other changes in Python3, but these are most commonly attributed to as the reason for making the transistion difficult.
Overall, Python3 introduced a lot of niceties.
The latest version of Python3 even introduces a more memory efficient dictionary, and since dictionaries are everywhere you can be sure to expect some improvements in your programs.
In general, I sure I wouldn't be alone in recommending anyone to use Python3 for their projects.
Personally, I don't think I've ever experienced an issue where a package that I wanted was written for Python2 alone.

I have experienced another issue though.
Multiple times now I've tried to install packages that have been built for Python3 that are completely incompatible with Python2.
When I've experienced Python2 packages that are incompatible with Python3, it has been for reasons mentioned above.
CPython changes require someone with an understanding of the C Python API ( or the willingness and patience to undertake the task ) to rewrite a significant portion of the library.
Unicode issues are a little less demanding, and with a clear understanding of text interfaces one can update their code for Python3 compatibility.
However, when a Python3 package is not compatible with Python2 the changes aren't straightforward, and sometimes even impossible.
For example, the use of asyncio in a package make it immediately incompatible with Python2.
A more innocuous change is the use of keyword only arguments, introduced by PEP 3102.


```python
def compare(a, b, *ignore, key=None):
    ...
```

Personally, I like this feature a lot.
It makes inheritance in Python very clean.

```python
class Child(Parent):
    def __init__(self, *args, child_keyword=child_value, **kwargs):
        # do something here with child_keyword
        super().__init__(**kwargs)
```

Without keyword only arguments, i.e. in Python2, the above would look like this

```python
class Child(Parent):
    def __init__(self, *args, **kwargs):
        child_keyword = kwargs.pop('child_keyword')
        # do something here with child_keyword
        super().__init__(**kwargs)
```

However, this change, although syntactically cleaner and self documenting, is backward incompatibility.
More changes like this have been or are being introduced in Python3.
For example, in Python3 you can merge two dictionaries with the following syntax

```python
merged_dict = {**dict1, **dict2}
```

This is so much cleaner and readable code that the different ways one would do it in Python2, however this implementation immediately alienates a large Python2 user base.
The list of backward incompatible changes that Python3 introduced is a lot larger than this.
And although almost all of these changes can be backported by using the excellent `six` and `future` modules, not every change is currently backported.
The following is another really neat feature is that currently not available in Python2.

```python
value1, *ignore, value2 = function()
```

I've been a proponent of writing code that is cross compatible with Python2 and Python3, but I anticipate that I may not get much mileage out of that strategy, or at the very least not for too long.
Python 3.0 has been out for almost 10 years now and Python 2.7 has an end date attached to it (2020 will be last year for official support for Python2), which means it is definitely not going to believe any bugfixes or improvements in the future.
Maybe it is not unreasonable to expect Python3 packages to be incompatible with Python2.
However, many enterprise applications and solutions are still using Python2, which are currently not written to be Python3 compatible.
In my experience of using Python, I've not encountered a case with a package was only Python2 compatible but have encountered multiple packages where it is only Python3 compatible.
What are your thoughts on this subject?
If you are reading this and have best practices to share, I would be very keen to hearing from you.
Do you write packages that are only compatible with Python3, or strive to make them cross compatible?
Are there other changes you can think of that make Python3 code incompatible with Python2?
Do you have tips you recommend for writing cross version compatible code or do you think it is no longer worth the effort.
