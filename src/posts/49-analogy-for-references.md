---
title: A bookshelf analogy to understand "pass by sharing" in Julia
summary: In this tutorial, you'll explore the concept of references and learn how it relates to Julia
date: 2023-02-25T21:14:15-0500
draft: true
---

I wanted to present an discuss an analogy that I like to use when thinking about code in the Julia language.
The Julia manual mentions that all arguments in a function are ["passed by sharing"](https://docs.julialang.org/en/v1/manual/arrays/).

Imagine there exists a bookshelf with books in a library, maintained by a strict librarian who follows a specific set of rules.
You, a curious mind, are interested in access some of the knowledge in these books, as well as putting your own thoughts into appropriate sections of books, binders or folders this bookshelf.
However, you can only interact with the librarian, who will process your instructions to access or modify contents on the bookshelf.

These books on the bookshelf are numbered by the order in which they are placed in the bookshelf, and hence every book has a unique address.
You may hand over a label to the librarian that contains the location of a book, as well as an instruction associated with that label (e.g. "retrieve it", "destroy it", etc).

In this mental model, the librarian is the CPU of a computer, the language in which you communicate with the librarian is the Julia programming language, the series of instructions you provide would be a program, and a bookshelf would represent the memory that a program has access to.
A label that contains the unique address to a book would be a variable.

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

Here there's a "book" that represents a vector that contains contains `4` `Float64` values.
The address where this object is located is stored in a label called `x`.
When you run the code `y = x`, you can essentially telling the "librarian", here's a new label `y` that should contain the same address that is in label `x`.
This is why when you modify the value of the first element in the object accessed through the label `x`, you are able to "see" the same change in the object accessed through the label `y`.
In other words, label `x` and label `y` point to the same object i.e. the label has the same address to the object.

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

You can think of this as the librarian taking a scan of the book page by page and creating a new book, and storing it in a different location on the bookshelf, and then storing the address of the new book in the label `y`.

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

that is like telling the librarian to change the first element of the object located in the address on label `x`.

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

This `.=` is called broadcasting and you can read more about it in the Julia documentation.

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

```
julia> mutable struct Book
         title::String
         price::Float64
       end

julia> book = Book("The Hitchhiker's Guide to the Galaxy", 9.99);

julia> book.price = 4.99;

julia> book
Book("The Hitchhiker's Guide to the Galaxy", 4.99)
```

You can think about this as a librarian changing the contents on an existing book on the bookshelf.

### Immutability

In Julia, there are a number of objects that immutable. For example, `String`, `Int`, `Float64` are all immutable types.

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

You can have a `struct` that is not `mutable` that contains an instance of a `mutable` type.

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

julia> book.meta["id"] = "42";

julia> book
Book("The Hitchhiker's Guide to the Galaxy", 9.99, Dict("id" => "42"))
```

You can think about this as a special book, where the librarian is not able to change the contents of any of the pages in the book.
But one of the pages happens to have an address of another book on the bookshelf.
The librarian cannot change where this address points to, but can change the contents of the object located at that address, as long as that object is a mutable object.

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

In Julia, because everything is always "pass by sharing" it is helpful to hint at the call site whether or not the function is going to mutate the arguments. By convention, this is done by adding a `!` at the end of a function name.
