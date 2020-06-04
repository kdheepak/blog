---
title: The egg tower puzzle
category: blog
date: 2020-05-31T20:29:26-06:00
tags: math, puzzle, julia
keywords: math, puzzle, julia
summary: This is a mathematical analytical solution to the two egg 100 storey tower problem
status: draft
---

Here is a fun puzzle:

> You are given two eggs, and access to a 100-storey tower. Both eggs are identical. The aim is to find out the highest floor from which an egg will not break when dropped out of a window from that floor. If an egg is dropped and does not break, it is undamaged and can be dropped again. However, once an egg is broken, that’s it for that egg.
>
> If an egg breaks when dropped from a floor, then it would also have broken from any floor above that. If an egg survives a fall, then it will survive any fall shorter than that.
>
> The question is: What strategy should you adopt to minimize the number egg drops it takes to find the solution? (And what is the worst case for the number of drops it will take?)

If you have not seen or solved this problem before I urge you to give it a go. I'm going to post the solution to this below, so this is your spoiler warning.

# Two eggs

This problem posed says we have 2 eggs to start with and a 100 storey tower to explore.

Let's consider what we would have to do if we had just one egg.
With just one egg, we could drop the egg from floor 1 and see what happens.
If it breaks, we stop and can claim definitively that the solution to the problem is floor 1.
If it doesn't break, we can proceed to floor 2 and repeat.

This means that if we have a tower with 10 floors we may need up to 10 drops to definitively say at which floor the egg would break, and if we have 100 floors we may need 100 drops.
The above strategy would guarantee that we find the solution to the problem with the _minimum_ number of drops.
Or in other words, we can search $N$ floors with $N$ drops.

If we have 2 eggs, what could we do?

With 2 eggs, in fact we can explore the search space more efficiently.
We can use the first egg to partition the total number of floors, and once the first egg breaks we can use the second egg to search floors in a partition.

As an example, you can decide to throw the first egg from every 10 floor.
If it doesn't break at floor 30 and breaks at floor 40, you can use the second egg to explore floors 21 - 29.

We can do even better.

Let's assume that the minimum number of drops to guarantee finding the floor when the eggs would break for a $N$ storey tower is $x$.
That means that if when we drop the first egg the egg breaks, we have $x - 1$ drops of the second egg to find the solution.
We already know that we can search at most $x - 1$ floors with the $1$ egg using $x - 1$ drops.
If our first drop was from a floor greater than $x$, we would not be able to guarantee finding the solution to this problem.
This means that if we have two eggs we would want to drop from first egg from floor $x$, where $x$ is the minimum number of drops that will guarantee finding the floor where the eggs break in a $N$ storey tower.

When we drop the first egg from floor $x$, if the egg breaks, we can use the second egg to find which floor from $1$ to $x - 1$ is the solution.
If the egg doesn't break, now we have used $1$ drop.
Let's assume that the first egg breaks on the second drop.
If the first egg breaks, we will use the second and last remaining egg to explore $x - 2$ floors with $x - 2$ drops find the floor where exactly the eggs would break.
With $x - 2$ drops, we can search from floor $x + 1$ to floor $x + (x - 2)$.
This means that when we drop the first egg the second time, we should start from $x + (x - 2) + 1$, i.e. $x + (x - 1)$, to allow for finding the exact floor should the first egg break on the second drop.

If the egg doesn't break on the second drop, we have now used $2$ drops.
If the egg is going to break on the third drop, we have to allow for searching $x - 3$ floors with the second egg.
This means we should drop the first egg on our third attempt from floor number $x + (x - 1) + (x - 3) + 1$, i.e. $x + (x - 1) + (x - 2)$.
With $3$ throws and $2$ eggs, we are guaranteed to find the floor if it is in $x + (x - 1) + (x - 2)$ floors.

Seeing the pattern here?

For a $N$ storey tower, we need to ensure that with $x$ throws we cover all the floors of the tower.

$$x + (x - 1) + (x - 2) + (x - 3) + \ldots + 1 >= N$$

$$\sum_{k=1}^{x} k >= N$$

$$\frac{x \times (1 + x)}{2} >= N$$

This tells us that 14 drops guarantees that we can check a tower with 105 floors, and is the answer to the puzzle if you have just two eggs.

# Three eggs

With 1 egg, we can check $x$ floors with $x$ drops.
We have already previously established that if we have 2 eggs, we can check $\frac{x \times (1 + x)}{2}$ floors with $x$ drops.

Let's say:

$$f_2(x) = \frac{x \times (1 + x)}{2}$$

where $f_2(x)$ is the number of floors that can be checked with $2$ eggs and $x$ remaining drops.

And we know that this can be written as,

$$f_2(x) = \sum_{k=1}^{x} k$$

So if we have 3 eggs, we want to ensure that we can check $f_2(x - 1)$ floors with the remaining $x - 1$ drops, if the first egg breaks on the first drop.
That means we should drop the first egg from floor number:

$$1 + f_2(x - 1)$$

For the second drop, we can start from floor number:

$$1 + f_2(x - 1) + 1 + f_2(x - 2)$$

For the third drop, we can start from floor number:

$$1 + f_2(x - 1) + 1 + f_2(x - 2) + 1 + f_2(x - 3)$$

This can be generalized to the following:

$$1 + \sum_{j=1}^{x-1} \left( 1 + \sum_{k=1}^{j} k \right) >= N$$

which results in:

$$\frac{x^3 + 5x}{6} >= N$$

# $N$ eggs

With $1$ egg and $x$ drops, we know we can check $x$ floors. Let's define this as $f(x, 1)$.

$$f(x, 1) = x$$

Let's say that $f(0, n) = 0$ and $f(x, 0) = 0$.

$$f(x, 1) = 1 + f(x-1, 1) + f(x-1, 0)$$

For $2$ eggs and $x$ drops, the number of floors we can check, i.e. $f(x, 2)$, is:

$$f(x, 2) = \sum_{k=1}^{x} k$$

$$f(x, 2) = 1 + \sum_{k=1}^{x-1} k + x - 1$$

$$f(x, 2) = 1 + f(x-1, 2) + f(x-1, 1)$$

And, for $3$ eggs and $x$ drops, the number of floors we can check, i.e. $f(x, 2)$, is:

$$f(x, 3) = 1 + \sum_{j=1}^{x-1} \left( 1 + \sum_{k=1}^{j} k \right)$$

$$f(x, 3) = x + \sum_{j=1}^{x-1}\sum_{k=1}^{j} k$$

$$f(x, 3) = x + \sum_{j=1}^{x-2}\sum_{k=1}^{j} k + \sum_{k=1}^{x-1} k$$

$$f(x, 3) = 1 + x - 1 + \sum_{j=1}^{x-2}\sum_{k=1}^{j} k + \sum_{k=1}^{x-1} k$$

$$f(x, 3) = 1 + f(x - 1, 3) + f(x - 1, 2)$$

We can see a pattern emerging here:

$$f(x, n) = 1 + f(x - 1, n) + f(x - 1, n - 1)$$
