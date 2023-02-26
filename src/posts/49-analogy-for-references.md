---
title: A bookshelf analogy to understand "pass by sharing" in Julia
summary: In this tutorial, you'll explore the concept of references and learn how it relates to Julia
date: 2023-02-25T21:14:15-0500
draft: true
---

I wanted to present an discuss an analogy that I like to use when thinking about code in the Julia language.
The Julia manual mentions that all arguments in a function are ["passed by sharing"](https://docs.julialang.org/en/v1/manual/arrays/).

Imagine there exists a bookshelf in a library, maintained by a strict librarian.
You, a curious mind, are interested in access some of the knowledge in these books, as well as putting your own thoughts into appropriate sections of this bookshelf.
However, you can only interact with the librarian, who can then process your instructions to access the bookshelf.

The bookshelf has various slots that contain books of a certain number of pages.
These books are numbered by the order in which they are placed in the bookshelf, and hence every book has a unique address.
You can hand over a label to the librarian that contains the location of a book, as well as an instruction associated with that label (e.g. "retrieve it", "destroy it", etc).

In this mental model, the librarian is the CPU of a computer, the language in which you communicate with the librarian is the Julia programming language, the series of instructions you provide would be a program, and a bookshelf would represent the memory that a program has access to.
A label that contains the unique address to a book would be a variable.

Let's look at some code examples:

```julia
julia> x = [0.0, 0.0, 0.0];

julia> y = x;

julia> x[1] = 2.0;

julia> x
3-element Vector{Float64}:
 2.0
 0.0
 0.0

julia> y
3-element Vector{Float64}:
 2.0
 0.0
 0.0
```
