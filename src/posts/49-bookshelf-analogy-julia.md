---
title: A Bookshelf Analogy for Understanding Variables and Mutability in Julia
summary: In this blog post, I present a mental model for understanding the basics of variable assignment and mutability in Julia, using analogies to books and bookshelves to help illustrate the concepts.
date: 2023-02-25T21:14:15-0500
draft: true
---

I wanted to present an discuss an analogy that I like to use when thinking about code in the Julia language.

Imagine there exists a bookshelf with books in a library, maintained by a librarian who follows a specific set of rules.
You, a curious mind, are interested in access some of the knowledge in these books, as well as putting your own thoughts into appropriate sections of books, binders or folders this bookshelf.
However, you can only interact with the librarian, who will process your instructions to access or modify contents on the bookshelf.

These books on the bookshelf are numbered by the order in which they are placed in the bookshelf, and hence every book has a unique address.
You may hand over a label to the librarian that contains the location of a book, as well as an instruction associated with that label (e.g. "retrieve it", "destroy it", etc).

In this mental model, the librarian is like the CPU of a computer, the language in which you communicate with the librarian is the Julia programming language, and a bookshelf would represent the memory your program has access to.
In the Julia language, you would have to use functions and variables.
Functions would be actions you'd like the librarian to take or instructions you'd like the librarian to follow.
And variables in Julia are a label that contains the unique address to a book on the bookshelf.

### Assignment

Let's look at a code example:

```julia
julia> x = [0.0, 0.0, 0.0, 0.0];

julia> y = x;

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

In this code, the `x` and `y` variables are like two labels that both point to the same "book" on the bookshelf.
When you assign `y = x`, you are essentially telling the "librarian" to create a new label that points to the same memory location as the `x` variable.

So when you modify `x[1] = 2.0`, you are telling the librarian to make a change to the book at the address pointed to by the `x` label, which changes the first element of the vector to `2.0`.

Since `y` points to the same memory location as `x`, when you inspect the `y` variable, you will see that it also reflects the same changes made to the underlying memory location.
Because both `x` and `y` are just different labels pointing to the same memory location, any changes made through one of the labels will be reflected when you look at the contents through the other label.

You can verify that this is the case by using the `pointer()` function:

```julia
julia> pointer(x)
Ptr{Float64} @0x0000000161c60d60

julia> pointer(y)
Ptr{Float64} @0x0000000161c60d60
```

If you did want to create a entirely new object, you can use `deepcopy()`:

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

In the analogy of the bookshelf, using `deepcopy()` would be like making a photocopy of a book and placing it on a new shelf.

The new book on the new shelf is a completely independent object with its own unique address, and any changes made to the original book will not affect the copy.
Similarly, `deepcopy()` creates a new object in memory that is completely independent of the original object, so any changes made to one object will not affect the other.

Assignments always create new "labels", that may or may not have the same address as an existing object.

### Mutability

In Julia, the `=` operator can be used to either assign values to a label or mutate existing values that can be accessed through a label.

For example, this is an assignment:

```julia
julia> x = [0.0, 0.0, 0.0, 0.0];
```

If the LHS of a `=` is variable without any `[]` or `.` or `@` symbols, it means an assignment has happened.

However, if for example there's a `[]` in the LHS, like so:

```julia
julia> x[1] = 2.0;
```

that is indexing into the object at the address in the label `x`, and changing that value of that element.

Mutability is an important concept in Julia because it determines whether or not an object can be modified. In general, mutable objects can be modified, and other objects cannot be modified.

In the analogy of the bookshelf, mutability would be like the ability to modify the contents of a book on the bookshelf. If a book is mutable, you can add or remove pages or modify existing pages, while if a book is not mutable, you cannot modify its contents and must create a new book with the desired changes.

Julia also has a special `.=` syntax, which instead of assignment does what mutability does.

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

Mutation can also occur when the `obj.field`.

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

Using the analogy of the bookshelf in the library, mutability would be analogous to being able to change the content of a book already on the shelf.
It's like erasing and re-writing some of the information on a page, without changing the location of the book on the shelf.

### Immutability

In Julia, there are a number of types that represent immutable objects. For example, `String`s, `Int`s, `Float64`s are all immutable.

```julia
julia> title = "The Hitchhiker's Guide to the Galaxy"
"The Hitchhiker's Guide to the Galaxy"

julia> title_author = title * " - Douglas Adams"
"The Hitchhiker's Guide to the Galaxy - Douglas Adams"

julia> pointer(title)
Ptr{UInt8} @0x0000000160f687f8

julia> pointer(title_author)
Ptr{UInt8} @0x0000000107ea82a0
```

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
In Julia, for `immutable` `struct`s, if you want to update the data that corresponds to a immutable object, you'll have to create a new instance of the struct.

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

### Pass by sharing

In Julia, arguments to functions are always passed by sharing.
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
julia> function incorrect_replace_with_zeros(arr)
  println("Before assignment: ", pointer(arr))
  arr = [0.0 for _ in eachindex(arr)]
  println("After assignment: ", pointer(arr))
end

julia> arr = [1, 2, 3];

julia> pointer(arr)
Ptr{Int64} @0x000000010d156070

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

If you wanted to write a working version, you can do the following:

```julia
julia> function replace_with_zeros!(arr)
         arr .= zero(eltype(arr))
       end
replace_with_zeros! (generic function with 1 method)

julia> arr
3-element Vector{Int64}:
 1
 2
 3

julia> pointer(arr)
Ptr{Int64} @0x000000010d156070

julia> replace_with_zeros!(arr);

julia> arr
3-element Vector{Int64}:
 0
 0
 0

julia> pointer(arr)
Ptr{Int64} @0x000000010d156070
```

In the analogy, passing an argument to a function is like taking a book from the shelf and giving its location address to the function. The function can read the content of the book and make changes to it, but it cannot change the location address that was given to it. If the book is mutable, any changes made by the function will also be visible to anyone else holding the same address.

The function `add_one` is like someone taking a book from the shelf, incrementing every number in it by one, and putting it back in the same location. Anyone else holding the address of the book will see the updated content.

On the other hand, the function `incorrect_replace_with_zeros` is like someone taking a book from the shelf, replacing it with a new empty book, and putting it back in a different location on the shelf. Even though the same address was given back to the caller, the book they were holding onto is not the same as the one that was modified by the function. Therefore, the caller still has the original book and any changes made by the function are lost.

To fix this, the function `replace_with_zeros!` modifies the same book that was passed to it, like someone taking a book from the shelf, erasing its content, and putting it back in the same location. Since the location address is not changed, anyone else holding the same address will see the updated content.

By convention, the `!` at the end of the function name is a convention in Julia to indicate that the function modifies its argument in place.
