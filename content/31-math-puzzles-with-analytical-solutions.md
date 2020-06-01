---
title: Solution to the two egg tower puzzle using Julia
category: blog
date: 2020-05-31T20:29:26-0600
tags: math, puzzle, julia
keywords: math, puzzle, julia
summary: This is a mathematical analytical solution to the two egg tower problem
status: draft
---

Here is a fun puzzle:

> You are given two eggs, and access to a 100-storey building. Both eggs are identical. The aim is to find out the highest floor from which an egg will not break when dropped out of a window from that floor. If an egg is dropped and does not break, it is undamaged and can be dropped again. However, once an egg is broken, that’s it for that egg.
>
> If an egg breaks when dropped from floor n, then it would also have broken from any floor above that. If an egg survives a fall, then it will survive any fall shorter than that.
>
> The question is: What strategy should you adopt to minimize the number egg drops it takes to find the solution?. (And what is the worst case for the number of drops it will take?)

If you have not seen or solved this problem before I urge you to give it a go. I'm going to post the solution to this below, so this is your spoiler warning.

# Solution

 This problem is posed with two eggs and a 100 storey building, but interesting this problem can be solved analytically.

I wanted to share this solution as well as showcase some features in the Julia programming language.

```julia
println(VERSION)
```
