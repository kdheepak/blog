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
We know that if we have 2 eggs, we can check $\frac{x \times (1 + x)}{2}$ with $x$ drops.

So if we have 3 eggs, we want to ensure that, if the first egg breaks on the first drop, we can check $\frac{(x - 1) \times x}{2}$ floors using $x - 1$ drops of the remaining eggs.
That means we should drop the first egg from floor number:

$$1 + \frac{(x - 1) \times x}{2}$$

For the second drop, we want to start from floor number:

$$\left(1 + \frac{(x - 1) \times x}{2}\right) + 1 + \frac{(x - 2) \times (x - 1)}{2}$$

For the third drop, we want to start from floor number:

$$\left(\left(1 + \frac{(x - 1) \times x}{2}\right) + 1 + \frac{(x - 2) \times (x - 1)}{2}\right) + 1 + \frac{(x - 3) \times (x - 2)}{2}$$

This can be generalized to the following:

$$\sum_{k=1}^{x} \left( 1 + \sum_{j=1}^{k-1} j \right) >= N$$

$$\frac{x \times (x^2 + 3 x + 8)}{6} >= N$$
