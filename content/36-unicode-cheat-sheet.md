---
title: My cheat sheet for working with Unicode
category: blog
date: 2020-09-19T02:29:49-06:00
tags: programming, unicode, vim
keywords: python, julia, vim, unicode
summary: References for various things associated with unicode
references:
- id: joelonsoftware
  title: "The Absolute Minimum Every Software Developer Absolutely, Positively Must Know About Unicode and Character Sets (No Excuses!)"
  URL: https://www.joelonsoftware.com/2003/10/08/the-absolute-minimum-every-software-developer-absolutely-positively-must-know-about-unicode-and-character-sets-no-excuses/
- id: hsivonen
  title: "It’s Not Wrong that \"🤦🏼‍♂️\".length == 7"
  URL: https://hsivonen.fi/string-length/
- id: fasterthanlime
  title: "Working with strings in Rust"
  URL: https://fasterthanli.me/articles/working-with-strings-in-rust
nocite: |
  @hsivonen
  @fasterthanlime
  @joelonsoftware
---

I wanted to make a cheat sheet for myself that contains some of the different things I use when it comes to unicode.

First some basics:

1. Unicode codepoints are unique numbers to express an abstract character, concept or graphical representation.
   These graphical representations may look similar visually but represent different "ideas".
   For example: A, Α, А, Ａ are all different unicode codepoints.

   - 'A' U+0041 LATIN CAPITAL LETTER A
   - 'Α' U+0391 GREEK CAPITAL LETTER ALPHA
   - 'А' U+0410 CYRILLIC CAPITAL LETTER A
   - 'Ａ' U+FF21 FULLWIDTH LATIN CAPITAL LETTER A

1. The same "idea", i.e. codepoint can be _encoded_ into different bits when represented on a machine depending on the encoding chosen.
   An encoding is a map or transformation of a codepoint into bits or bytes.
   The codepoint for a 🐉 can be encoded into UTF-8, UTF16, UTF32 etc.

   ```python
   Python 3.7.6 (default, Jan  8 2020, 13:42:34)
   Type 'copyright', 'credits' or 'license' for more information
   IPython 7.16.1 -- An enhanced Interactive Python. Type '?' for help.

   In [1]: s = '🐉'

   In [2]: s.encode('utf-8')
   Out[2]: b'\xf0\x9f\x90\x89'

   In [3]: s.encode() # Python3 uses 'utf-8' by default
   Out[3]: b'\xf0\x9f\x90\x89'

   In [4]: s.encode('utf-16')
   Out[4]: b'\xff\xfe=\xd8\t\xdc'

   In [5]: s.encode('utf-32')
   Out[5]: b'\xff\xfe\x00\x00\t\xf4\x01\x00'
   ```

   ASCII can only encode 256 codepoints. Python throws an `UnicodeEncodeError` if we try to encode 🐉 into ASCII.

   ```python
   In [6]: s.encode('ascii')
   ---------------------------------------------------------------------------
   UnicodeEncodeError                        Traceback (most recent call last)
   <ipython-input-2-532f2946fbcf> in <module>
   ----> 1 s.encode('ascii')

   UnicodeEncodeError: 'ascii' codec can't encode character '\U0001f409' in position 0: ordinal not in range(128)
   ```

   Valid ASCII byte strings are also valid UTF-8 byte strings.
   Python prints the bytes as human readable characters if they are valid ASCII characters.

   ```python
   In [7]: s = 'hello world'

   In [7]: s.encode('ascii')
   Out[7]: b'hello world'

   In [8]: s.encode('utf-8')
   Out[8]: b'hello world'

   In [9]: s.encode('utf-16')
   Out[9]: b'\xff\xfeh\x00e\x00l\x00l\x00o\x00 \x00w\x00o\x00r\x00l\x00d\x00'
   ```

1. When receiving or reading data, you **must** know the encoding used to interpret it correctly.
   A Unicode encoding is not guaranteed to contain any information about the encoding.
   Different encodings exist for efficiency, performance and backward compatibility, and data in one encoding may work  in another but is not strictly always going to work.
   For example, in the following binary data `01000001_01000010_01000011` or hexadecimal data `41_42_43` can be decoded using `ascii` or `utf-8`, but naturally does not have a valid transformation when using a `utf-16` decoder.

   ```python
   In [1]: b'\x41\x42\x43'.decode('ascii')
   Out[1]: 'ABC'

   In [2]: b'\x41\x42\x43'.decode('utf-8')
   Out[2]: 'ABC'

   In [3]: b'\x41\x42\x43'.decode('utf-16')
   ---------------------------------------------------------------------------
   UnicodeDecodeError                        Traceback (most recent call last)
   <ipython-input-23-d64cb3406699> in <module>
   ----> 1 b'\x41\x42\x43'.decode('utf-16')

   UnicodeDecodeError: 'utf-16-le' codec can't decode byte 0x43 in position 2: truncated data
   ```

# Vim

In vim in insert mode, you can type `Ctrl+V`^[_aside_: Check out `:help i_CTRL-V_digit` for more information.
Also check out <https://github.com/chrisbra/unicode.vim>.] followed by either:

- a decimal number [0-255]. `Ctrl-v255` will insert `ÿ`.
- the letter `o` and then an octal number [0-377]. `Ctrl-vo377` will insert `ÿ`.
- the letter `x` and then a hex number [00-ff]. `Ctrl-vxff` will insert `ÿ`.
- the letter `u` and then a 4-hexchar Unicode sequence. `Ctrl-vu03C0` will insert `π`.
- the letter `U` and then an 8-hexchar Unicode sequence. `Ctrl-vU0001F409` will insert `🐉`.


# Python

Since Python >=3.3 [^pep0393], the Unicode string type supports a "flexible string representation".
This means that any one of multiple internal representations may be used depending on the largest Unicode ordinal (1, 2, or 4 bytes) in a Unicode string.

[^pep0393]: See PEP0393 for more information: <https://www.python.org/dev/peps/pep-0393/>

For the common case, a string used in the English speaking world may only use ASCII characters thereby using a Latin-1 encoding to store the data.
If non Basic Multilingual Plane characters are using in a Python Unicode string, the internal representation may be stored as UCS2 or UCS4.

In each of these cases, the internal representation uses the same number of bytes for each codepoint.
This allows efficient indexing into a Python Unicode string, but indexing into a Python Unicode string will only return a
valid codepoint and not a grapheme.
In such an implementation it makes sense that the `length` of a Unicode string is defined as the number of codepoints in the string.

However, in practice, indexing into a string may not be what you want.
As an example, let's take this emoji: 🤦🏼‍♂️.
🤦🏼‍♂️
actually consists of 5 codepoints.

- 🤦 : U+1F926 FACE PALM
- 🏼 : U+1F3FC EMOJI MODIFIER FITZPATRICK TYPE-3
- ‍ : U+200D ZERO WIDTH JOINER
- ♂ : U+2642 MALE SIGN (Ml)
- ️: U+FE0F Dec:65039 VARIATION SELECTOR-16

Let's take an example of a Python string that contains just this emoji.

```python
Python 3.7.6 (default, Jan  8 2020, 13:42:34)
Type 'copyright', 'credits' or 'license' for more information
IPython 7.16.1 -- An enhanced Interactive Python. Type '?' for help.

In [1]: s = "🤦🏼‍♂️"

In [2]: s
Out[2]: '🤦🏼\u200d♂️'

In [3]: print(s)
🤦🏼‍♂️

In [4]: len(s)
Out[4]: 5
```

As mentioned earlier, indexing into a Python Unicode string gives us the codepoint at that location.

```python

In [5]: s[0]
Out[5]: '🤦'

In [6]: s[1]
Out[6]: '🏼'

In [7]: s[2]
Out[7]: '\u200d'

In [8]: s[3]
Out[8]: '♂'

In [9]: s[4]
Out[9]: '️'

In [10]: # this may look like an empty byte string but it is not.

In [11]: s[4].encode('utf-8')
Out[11]: b'\xef\xb8\x8f'

In [12]: ''.encode('utf-8')
Out[12]: b''

In [13]: s[5]
---------------------------------------------------------------------------
IndexError                                Traceback (most recent call last)
<ipython-input-42-b5dece75d686> in <module>
----> 1 s[5]

IndexError: string index out of range
```

Indexing into the codepoints may not be useful in practice. More often, we are interested in indexing into the byte string representation or
interested in indexing into the graphemes.

We can use the `s.encode('utf-8')` function to get a Python byte string representation of the Python unicode string in `s`.

```
In [14]: s.encode('utf-8')
Out[14]: b'\xf0\x9f\xa4\xa6\xf0\x9f\x8f\xbc\xe2\x80\x8d\xe2\x99\x82\xef\xb8\x8f'

In [15]: len(s.encode('utf-8'))
Out[15]: 17
```

If we are interested in the number of graphemes, we can use the [`grapheme`](https://pypi.org/project/grapheme/) package.

```
In [16]: import grapheme

In [17]: grapheme.length(s)
Out[17]: 1
```

# Julia

Let's take a look at how Julia handles strings.

```bash
               _
   _       _ _(_)_     |  Documentation: https://docs.julialang.org
  (_)     | (_) (_)    |
   _ _   _| |_  __ _   |  Type "?" for help, "]?" for Pkg help.
  | | | | | | |/ _` |  |
  | | |_| | | | (_| |  |  Version 1.5.0 (2020-08-01)
 _/ |\__'_|_|_|\__'_|  |  Official https://julialang.org/ release
|__/                   |

```


```julia
julia> s = "🤦🏼‍♂️"
"🤦🏼\u200d♂️"

julia> println(s)
🤦🏼‍♂️

julia> length(s)
5

julia> ncodeunits(s)
17

julia> codeunit(s)
UInt8
```

Printing the length of the string in Julia returns `5`.
As we saw earlier, this is the number of codepoints in the unicode string.

Julia `String` literals are encoded using the UTF-8 encoding.
In Python, the indexing into a string would return the codepoint at the string.
In Julia, indexing into a string refers to code units, and for the default `String` this returns the byte as a `Char` type.

```julia
julia> s[1]
'🤦': Unicode U+1F926 (category So: Symbol, other)

julia> typeof(s[1])
Char

julia> s[2]
ERROR: StringIndexError("🤦🏼\u200d♂️", 2)
Stacktrace:
 [1] string_index_err(::String, ::Int64) at ./strings/string.jl:12
 [2] getindex_continued(::String, ::Int64, ::UInt32) at ./strings/string.jl:220
 [3] getindex(::String, ::Int64) at ./strings/string.jl:213
 [4] top-level scope at REPL[12]:1

julia> s[3]
ERROR: StringIndexError("🤦🏼\u200d♂️", 3)
Stacktrace:
[...]

julia> s[4]
ERROR: StringIndexError("🤦🏼\u200d♂️", 4)
Stacktrace:
[...]

julia> s[5]
'🏼': Unicode U+1F3FC (category Sk: Symbol, modifier)

julia> s[6]
ERROR: StringIndexError("🤦🏼\u200d♂️", 6)
Stacktrace:
[...]

julia> s[7]
ERROR: StringIndexError("🤦🏼\u200d♂️", 7)
Stacktrace:
[...]

julia> s[8]
ERROR: StringIndexError("🤦🏼\u200d♂️", 8)
Stacktrace:
[...]

julia> s[9]
'\u200d': Unicode U+200D (category Cf: Other, format)

julia> s[10]
ERROR: StringIndexError("🤦🏼\u200d♂️", 10)
Stacktrace:
[...]

julia> s[11]
ERROR: StringIndexError("🤦🏼\u200d♂️", 11)
Stacktrace:
[...]

julia> s[12]
'♂': Unicode U+2642 (category So: Symbol, other)

julia> s[13]
ERROR: StringIndexError("🤦🏼\u200d♂️", 13)
Stacktrace:
[...]

julia> s[14]
ERROR: StringIndexError("🤦🏼\u200d♂️", 14)
Stacktrace:
[...]

julia> s[15]
'️': Unicode U+FE0F (category Mn: Mark, nonspacing)

julia> s[16]
ERROR: StringIndexError("🤦🏼\u200d♂️", 16)
Stacktrace:
[...]

julia> s[17]
ERROR: StringIndexError("🤦🏼\u200d♂️", 17)
Stacktrace:
[...]

julia> s[18]
ERROR: BoundsError: attempt to access String
  at index [18]
Stacktrace:
[...]
```

If you do want each codepoint in a Julia `String`, you can use `eachindex`[^julia].

[^julia]: See the Julia manual strings documentation for more information: <https://docs.julialang.org/en/v1/manual/strings/>

```julia
julia> [s[x] for x in eachindex(s)]
5-element Array{Char,1}:
 '🤦': Unicode U+1F926 (category So: Symbol, other)
 '🏼': Unicode U+1F3FC (category Sk: Symbol, modifier)
 '\u200d': Unicode U+200D (category Cf: Other, format)
 '♂': Unicode U+2642 (category So: Symbol, other)
 '️': Unicode U+FE0F (category Mn: Mark, nonspacing)
```

And finally, we can use the `Unicode` module that is built in to the standard library to get the number of graphemes.

```julia

julia> using Unicode

julia> graphemes(s)
length-1 GraphemeIterator{String} for "🤦🏼‍♂️"

julia> length(graphemes(s))
1
```

If you wish to encode a Julia string as UTF-8[^juliatrancode], we can use the following:

[^juliatranscode]: As of Julia v1.5.0, only conversion to/from UTF-8 is currently supported: https://docs.julialang.org/en/v1/base/strings/#Base.transcode

```
julia> transcode(UInt8, s)
17-element Base.CodeUnits{UInt8,String}:
 0xf0
 0x9f
 0xa4
 0xa6
 0xf0
 0x9f
 0x8f
 0xbc
 0xe2
 0x80
 0x8d
 0xe2
 0x99
 0x82
 0xef
 0xb8
 0x8f
```
