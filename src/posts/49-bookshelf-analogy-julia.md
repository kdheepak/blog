---
title: "The Bookshelf Analogy: Understanding Variables and Mutability in Julia"
summary: In this blog post, I present a mental model for understanding the basics of variable assignment and mutability in Julia, using analogies to books and bookshelves to help illustrate the concepts.
date: 2023-02-25T21:14:15-0500
draft: true
---

It can be helpful to think of the program's memory as number of bookshelves in a library.

Imagine you are at a library full of books on bookshelves, but they are all over the place and you can't find what you want.
Also, you can't interact directly with the books or bookshelves.

Instead, you have to ask a very smart and helpful librarian, who knows where all the books are and can help you find what you need, to retrieve or modify the books for you.
But in order for them to help you, you are form a pact to speak in a very specific language with certain rules and decrees.

In this mental model, the librarian represents the Julia programming language (i.e. command line tool + LLVM compiler), and the text in the `.jl` files or the code you may enter in a REPL is the interface through which you communicate with the language.
To interact with the bookshelf (i.e., the program's memory), the Julia language lets you use functions and variables as part of its vocabulary.

Functions in Julia are like a set of instructions that you give to the librarian, telling them what actions you'd like to take with the books.
And variables in Julia are the labels the librarian gives you that are associated with specific books on the bookshelf, allowing you to refer to them later on.

The books on these bookshelves happen to be numbered by the order in which they are located, giving each book a unique address.
You can think of these addresses as the memory locations that your program has access to.

By thinking of code in this way, you can better understand how your program interacts with memory and how the different elements of your code work together.

# Assignment

Let's look at a code example:

```julia
julia> x = [0.0, 0.0, 0.0, 0.0];

julia> y = x;

julia> x
3-element Vector{Float64}:
 0.0
 0.0
 0.0
 0.0

julia> y
3-element Vector{Float64}:
 0.0
 0.0
 0.0
 0.0
```

If you see a `=` symbol and to the left of the `=` there is a simple name of a variable, that is an assignment.
When you ask to perform this action, `x = [0.0, 0.0, 0.0, 0.0]`, the `[0.0, 0.0, 0.0, 0.0]` object is created,
and label called `x` that is bound to said object.

When you assign `y = x`, you are essentially asking to create new label called `y` that is also bound to the same object as the `x` label.

So in our analogy, the `x` and `y` variables are two labels that both point to the same "book" on the "bookshelf" (i.e. the same object in memory).

Because `x` and `y` are bound to the same object, changes made to the object through `x` will also be visible through `y`.

```julia
julia> x
3-element Vector{Float64}:
 0.0
 0.0
 0.0
 0.0

julia> x[1] = 2.0;

julia> x
3-element Vector{Float64}:
 2.0
 0.0
 0.0
 0.0

julia> y
3-element Vector{Float64}:
 2.0
 0.0
 0.0
 0.0
```

When you modify `x[1] = 2.0`, you are telling the librarian to make a change to the book tagged to the `x` label, which in this case changes the first element of the vector to `2.0`.
And since `y` points to the same memory location as `x`, when you inspect the `y` variable, you will see that it also reflects the same changes made to the underlying memory location.
Because both `x` and `y` are just different labels pointing to the same memory location, any changes made through one of the labels will be visible when you look at the contents through the other label.

You can verify that this is the case by using the `pointer()` function:

```julia
julia> pointer(x)
Ptr{Float64} @0x0000000161c60d60

julia> pointer(y)
Ptr{Float64} @0x0000000161c60d60
```

When you call this `pointer` function, you are passing in a label called `x` and Julia returns the memory address of the object that was tagged to that label by the librarian.
You can see that `x` and `y` point to an object that has the same memory address.

So what if you did want to create a entirely new object instead? You can use the `deepcopy()` function:

```julia
julia> y = deepcopy(x)
4-element Vector{Float64}:
 2.0
 0.0
 0.0
 0.0

julia> pointer(x)
Ptr{Float64} @0x0000000161c60d60

julia> pointer(y)
Ptr{Float64} @0x0000000107e4c880
```

In the analogy of the bookshelf, using `deepcopy()` would be like asking the librarian to make a photocopy of a book and placing it at a new location on the shelf.
Then the librarian would take away the old `y` label that you were holding and give you a new `y` label associated with this new object.

The new object created is completely independent from the old, with its own unique address.
Any changes made to the original object will not affect the copy and vice versa.

Assignments in Julia always create new labels and may replace an existing label of yours.
Labels you receive from the librarian may or may not point to the same location as an existing label of yours, and that is for the librarian to decide.

# Mutability

In Julia, the `=` operator can be used to either assign values to a label or mutate existing values that can be accessed through a label.

For example, this is an assignment:

```julia
julia> x = [0.0, 0.0, 0.0, 0.0];
```

If the Left Hand Side (LHS) of a `=` is variable without any `[]` or `.` or `@` symbols, it means an assignment has happened.

However, if for example there's a `[]` in the LHS, like so:

```julia
julia> x[1] = 2.0;
```

then that is not an assignment anymore. That is mutating the first index of the object tagged by the `x` label.

Mutation can also occur when the `obj.field` syntax is in the LHS.

```julia
julia> mutable struct Book
         title::String
         price::Float64
       end

julia> book = Book("The Hitchhiker's Guide to the Galaxy", 9.99);

julia> book.price = 4.99;

julia> book
Book("The Hitchhiker's Guide to the Galaxy", 4.99)
```

Mutability is an important concept in Julia because it determines whether or not an object can be modified.
In general, mutable objects can be modified, and other objects cannot be modified.

In the analogy of the bookshelf, mutability would be like the ability to modify the contents of a book already on the bookshelf.
It's like erasing and re-writing some of the information on a page, without changing the location of the book on the shelf.

If a book is mutable, you can add or remove pages or modify existing pages, while if a book is not mutable, you cannot modify its contents and must create a new book with the desired changes.

Remember, mutations never create new labels.
They only modify labels that already exist.

In Julia, objects can be mutable or not.
You can check if a object is mutable by using the `ismutable()` function:

```julia
julia> ismutable(x)
true

julia> ismutable([])
true

julia> ismutable(Dict())
true

julia> ismutable((1,))
false

julia> ismutable(1)
false

julia> ismutable("hello world")
true
```

In Julia, there are a number of types that represent immutable objects. For example, `Int`s and `Float64`s are all immutable.

You can also have a `struct` that is `immutable` that contains an instance of a `mutable` type.

```julia
julia> struct Book
         title::String
         price::Float64
         meta::Dict{String, String}
       end

julia> book = Book("The Hitchhiker's Guide to the Galaxy", 9.99, Dict());

julia> book.price = 4.99;
ERROR: setfield!: immutable struct of type Book cannot be changed
Stacktrace:
 [1] setproperty!(x::Book, f::Symbol, v::Float64)
   @ Base ./Base.jl:39
 [2] top-level scope
   @ REPL[3]:1

```

In this code, we define a `Book` `struct` that has a `title` and `price` as before, and an additional `meta` dictionary.
All three fields, `title`, `price` and `meta` point to their respective objects, and once assigned they cannot be reassigned to a new object.
In Julia, for `immutable` `struct`s, if you want to update the data that corresponds to a immutable object, you'll essentially have to create a new instance of the struct.

```julia
julia> book = Book("The Hitchhiker's Guide to the Galaxy", 9.99, Dict());

julia> book = Book(book.title, 4.99, book.meta);

julia> book
Book("The Hitchhiker's Guide to the Galaxy", 4.99, Dict{String, String}())
```

The `meta` dictionary, however, happens to be a mutable object.
And that can be modified even though the `Book` instance itself is immutable.

```julia
julia> book.meta["id"] = "42";

julia> book
Book("The Hitchhiker's Guide to the Galaxy", 4.99, Dict("id" => "42"))
```

To use our analogy, the `meta` field is like a page inside the book that contains the address of another book on the bookshelf.
We cannot change the address on the page, but we can still modify the contents of the book at that address.

# Special cases

As a sidebar, I want to touch on some special syntax that you will come across when using Julia.

## Tuple unpacking

Julia supports syntax that is called "unpacking":

```julia
julia> (a, b) = (1, 2)
(1, 2)

julia> a
1

julia> b
2

julia> (a, b, remaining...) = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
10-element Vector{Int64}:
  1
  2
  3
  4
  5
  6
  7
  8
  9
 10

julia> a
1

julia> b
2

julia> remaining
8-element Vector{Int64}:
  3
  4
  5
  6
  7
  8
  9
 10
```

## Named Tuple unpacking

Julia also supports named tuple unpacking using the `(; )` syntax:

```julia
julia> (;a,b) = (a=1,b=2)
(a = 1, b = 2)

julia> a
1

julia> b
2
```

## Shorthand assignment

Sometimes you may see a character before the `=`, like `+=` or `-=`.

```julia
a += 1          # a = a + 1
b -= 2          # b = b - 1
```

With one exception, these are all just a short hand for the longer assignment form.

## Broadcasting

The exception is a special syntax called broadcasting, which instead of assignment does what mutability does.
When you see `.=`, it is "broadcasting" the `=` operation on all elements of the LHS.

```julia
julia> x = [0.0, 0.0, 0.0, 0.0];

julia> pointer(x)
Ptr{Float64} @0x000000012d1bd000

julia> x .= 5.0;

julia> pointer(x)
Ptr{Float64} @0x000000012d1bd000

julia> x
4-element Vector{Float64}:
 5.0
 5.0
 5.0
 5.0
```

In Julia, the following:

```julia
x .= 5.0
```

is equivalent to

```julia
for i in eachindex(x)
  x[i] = 5.0
end
```

This `.=` is called broadcasting and you can read more about it in the [Julia documentation](https://docs.julialang.org/en/v1/manual/arrays/#Broadcasting).

Julia also supports broadcasting over a subset of elements in an array:

```julia
julia> x[begin:2] .= 2.0;

julia> x[3:end] .= 4.0;

julia> x
4-element Vector{Float64}:
 2.0
 2.0
 4.0
 4.0
```

## Chained `=` operations

Julia also supports chained `=` operations which may do an assignment or mutation depending on what is on the LHS of that operation:

```julia
julia> c = x[1] = 2.0;
2.0

julia> x
4-element Vector{Float64}:
 2.0
 5.0
 5.0
 5.0

julia> c
2.0
```

This is because in Julia everything is an expression, even the `=` operation and this code:

```julia
c = x[1] = 2.0;
```

essentially does this:

```julia
c = (x[1] = 2.0);
```

### Strings

Although `String`s are mutable types, they cannot be modified using the array access.

```julia
julia> title = "The Hitchhiker's Guide to the Galaxy"
"The Hitchhiker's Guide to the Galaxy"

julia> typeof(title)
String

julia> ismutable(title)
true

julia> title[1] = 't'
ERROR: MethodError: no method matching setindex!(::String, ::Char, ::Int64)
Stacktrace:
 [1] top-level scope
   @ REPL[138]:1
```

It is easiest to just create a new `String`:

```julia
julia> title_author = title * " - Douglas Adams"
"The Hitchhiker's Guide to the Galaxy - Douglas Adams"

julia> pointer(title)
Ptr{UInt8} @0x0000000160f687f8

julia> pointer(title_author)
Ptr{UInt8} @0x0000000107ea82a0
```

# Pass by sharing

In Julia, arguments to functions are always ["passed by sharing"](https://en.wikipedia.org/wiki/Evaluation_strategy#Call_by_sharing).
This means that when a function is called with an argument, the function receives a reference to the object that the argument refers to, rather than a copy of the object.
The function can modify the object if it is mutable, but the modifications will also be visible to the caller.

```julia
julia> function add_one(arr)
    for i in eachindex(arr)
        arr[i] += 1
    end
    return arr
end

julia> arr = [1, 2, 3];

julia> add_one(arr);

julia> arr
3-element Vector{Int64}:
 2
 3
 4
```

The function cannot modify the "address" that the label points to in the call site.

```julia
julia> arr = [1, 2, 3];

julia> pointer(arr)
Ptr{Int64} @0x000000010d156070

julia> function incorrect_replace_with_zeros(arr)
  println("Before assignment: ", pointer(arr))
  arr = [0.0 for _ in eachindex(arr)]
  println("After assignment: ", pointer(arr))
end

julia> incorrect_replace_with_zeros(arr);
Before assignment: Ptr{Int64} @0x000000010d156070
After assignment: Ptr{Float64} @0x000000012de42b60

julia> arr
3-element Vector{Int64}:
 1
 2
 3

julia> pointer(arr)
Ptr{Int64} @0x000000010d156070
```

If you wanted to write a correct version, you can do the following:

```julia
julia> arr
3-element Vector{Int64}:
 1
 2
 3

julia> pointer(arr)
Ptr{Int64} @0x000000010d156070

julia> function replace_with_zeros!(arr)
         arr .= zero(eltype(arr))
       end
replace_with_zeros! (generic function with 1 method)

julia> replace_with_zeros!(arr);

julia> arr
3-element Vector{Int64}:
 0
 0
 0

julia> pointer(arr)
Ptr{Int64} @0x000000010d156070
```

In the analogy, passing an argument to a function is like taking a book from the shelf and giving its location address to the function.
The function can read the content of the book and make changes to it, but it cannot change the location address that was given to it.
If the book is mutable, any changes made by the function will also be visible to anyone else holding the same address.

The function `add_one` is like someone taking a book from the shelf, incrementing every number in it by one, and putting it back in the same location. Anyone else holding the address of the book will see the updated content.

On the other hand, the function `incorrect_replace_with_zeros` is like someone taking a book from the shelf, replacing it with a new empty book, and putting it back in a different location on the shelf.
Even though the same address was given back to the caller, the book they were holding onto is not the same as the one that was modified by the function.
Therefore, the caller still has the original book and any changes made by the function are lost.

To fix this, the function `replace_with_zeros!` modifies the same book that was passed to it, like someone taking a book from the shelf, erasing its content, and putting it back in the same location.
Since the location address is not changed, anyone else holding the same address will see the updated content.

By convention, the `!` at the end of the function name is a convention in Julia to indicate that the function modifies its argument in place.

# Conclusions

Thinking of programming memory as a bookshelf in a library can help beginners understand how their program interacts with memory and how different elements of their code work together.
