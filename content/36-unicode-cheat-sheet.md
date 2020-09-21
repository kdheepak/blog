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
- id: python3unicodedocs
  title: "Unicode HOWTO - Comparing strings"
  URL: https://docs.python.org/3/howto/unicode.html#comparing-strings
nocite: |
  @hsivonen
  @fasterthanlime
  @joelonsoftware
---

I wanted to make a cheat sheet for myself containing a reference of things I use when it comes to Unicode.

First some basics:

1. Unicode Code Points[^codepoint: See <https://unicode.org/glossary/#code_point>.] are unique mappings from hexadecimal
   integers to an abstract character, concept or graphical representation.
   These graphical representations may look similar visually but can represent different "ideas".
   For example: A, Α, А, Ａ are all different Unicode code points.

   - 'A' U+0041 LATIN CAPITAL LETTER A
   - 'Α' U+0391 GREEK CAPITAL LETTER ALPHA
   - 'А' U+0410 CYRILLIC CAPITAL LETTER A
   - 'Ａ' U+FF21 FULLWIDTH LATIN CAPITAL LETTER A

1. The same "idea", i.e. code point can be _encoded_ into different bits when it is required to be represented on a machine.
   The bits used to represent the idea depend on the encoding chosen.
   An encoding is a map or transformation of a code point into bits or bytes.
   For example, the code point for a 🐉 can be encoded into UTF-8, UTF16, UTF32 in Python as follows.

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

   Python prints the bytes as human readable characters if they are valid ASCII characters.
   ASCII defines 128 characters, half of the 256 possible bytes in an 8-bit computer system.
   Valid ASCII byte strings are also valid UTF-8 byte strings.

   ```python
   In [7]: s = 'hello world'

   In [7]: s.encode('ascii')
   Out[7]: b'hello world'

   In [8]: s.encode('utf-8')
   Out[8]: b'hello world'

   In [9]: s.encode('utf-16')
   Out[9]: b'\xff\xfeh\x00e\x00l\x00l\x00o\x00 \x00w\x00o\x00r\x00l\x00d\x00'
   ```

1. When receiving or reading data, we **_must_** know the encoding used to interpret it correctly.
   A Unicode encoding is not guaranteed to contain any information about the encoding.
   Different encodings exist for efficiency, performance and backward compatibility.
   UTF-8 is a good pick for an encoding in the general case.

# Vim

In vim in insert mode, we can type `Ctrl+V`^[_aside_: Check out `:help i_CTRL-V_digit` for more information.] followed by either:

- a decimal number [0-255]. `Ctrl-v255` will insert `ÿ`.
- the letter `o` and then an octal number [0-377]. `Ctrl-vo377` will insert `ÿ`.
- the letter `x` and then a hex number [00-ff]. `Ctrl-vxff` will insert `ÿ`.
- the letter `u` and then a 4-hexchar Unicode sequence. `Ctrl-vu03C0` will insert `π`.
- the letter `U` and then an 8-hexchar Unicode sequence. `Ctrl-vU0001F409` will insert `🐉`.

Using [`unicode.vim`](https://github.com/chrisbra/unicode.vim), we can use `:UnicodeName` to get the Unicode number of the code point under the cursor.

# Python

Since Python >=3.3 [^pep0393], the Unicode string type supports a "flexible string representation".
This means that any one of multiple internal representations may be used depending on the largest Unicode ordinal (1, 2, or 4 bytes) in a Unicode string.

[^pep0393]: See PEP0393 for more information: <https://www.python.org/dev/peps/pep-0393/>.

For the common case, a string used in the English speaking world may only use ASCII characters thereby using a Latin-1 encoding to store the data.
If non Basic Multilingual Plane characters are using in a Python Unicode string, the internal representation may be stored as UCS2 or UCS4.

In each of these cases, the internal representation uses the same number of bytes for each code point.
This allows efficient indexing into a Python Unicode string, but indexing into a Python Unicode string will only return a
valid code point and not a grapheme.
The Unicode consortium defines a grapheme[^grapheme] as a "What a user thinks of as a character".
In such an implementation it makes sense that the `length` of a Unicode string is defined as the number of code points in the string.

[^grapheme]: See <https://unicode.org/glossary/#grapheme>.

However, in practice, indexing into a string may not be what we want.
As an example, let's take this emoji: 🤦🏼‍♂️.
This emoji actually consists of 5 code points.

- 🤦 : U+1F926 FACE PALM
- 🏼 : U+1F3FC EMOJI MODIFIER FITZPATRICK TYPE-3
- ‍ : U+200D ZERO WIDTH JOINER
- ♂ : U+2642 MALE SIGN (Ml)
- ️: U+FE0F VARIATION SELECTOR-16

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

If we want to keep a Python file pure ascii but want to use Unicode in string literals, we can use the `\U` escape sequence.

```python
In [5]: s = '\U0001F926\U0001F3FC\u200D\u2642\uFE0F'

In [6]: s
Out[6]: '🤦🏼\u200d♂️'

In [7]: print(s)
🤦🏼‍♂️
```

As mentioned earlier, indexing into a Python Unicode string gives us the code point at that location.

```python

In [7]: s[0]
Out[7]: '🤦'

In [8]: s[1]
Out[8]: '🏼'

In [9]: s[2]
Out[9]: '\u200d'

In [10]: s[3]
Out[10]: '♂'

In [11]: s[4] # this may look like an empty string but it is not.
Out[11]: '️'

In [12]: s[4].encode('utf-8')
Out[12]: b'\xef\xb8\x8f'

In [13]: ''.encode('utf-8')
Out[13]: b''

In [14]: s[5]
---------------------------------------------------------------------------
IndexError                                Traceback (most recent call last)
<ipython-input-42-b5dece75d686> in <module>
----> 1 s[5]

IndexError: string index out of range
```

Iterating over a Python string gives us the code points as well.

```python
In [15]: [c for c in s]
Out[15]: ['🤦', '🏼', '\u200d', '♂', '️']
```

Indexing into the code points may not be useful in practice. More often, we are interested in indexing into the byte string representation or
interested in indexing into the graphemes.

We can use the `s.encode('utf-8')` function to get a Python byte string representation of the Python unicode string in `s`.

```python
In [16]: s
Out[16]: '🤦🏼\u200d♂️'

In [17]: len(s)
Out[17]: 5

In [18]: type(s)
Out[18]: str

In [19]: s.encode('utf-8')
Out[19]: b'\xf0\x9f\xa4\xa6\xf0\x9f\x8f\xbc\xe2\x80\x8d\xe2\x99\x82\xef\xb8\x8f'

In [20]: len(s.encode('utf-8'))
Out[20]: 17

In [21]: type(s.encode('utf-8'))
Out[21]: bytes
```

If we are interested in the number of graphemes, we can use the [`grapheme`](https://pypi.org/project/grapheme/) package.

```python
In [22]: import grapheme

In [23]: grapheme.length(s)
Out[23]: 1

In [24]: s = s + " Why is Unicode so complicated?"

In [25]: grapheme.slice(s, 0, 1)
Out[25]: '🤦🏼\u200d♂️'

In [26]: grapheme.slice(s, 2)
Out[26]: 'Why is Unicode so complicated?'
```

For historical reasons, Unicode allows the same set of characters to be represented by different sequences of code points.

```python
In [27]: single_char = 'ê'
    ...: multiple_chars = '\N{LATIN SMALL LETTER E}\N{COMBINING CIRCUMFLEX ACCENT}'

In [28]: single_char
Out[28]: 'ê'

In [29]: multiple_chars
Out[29]: 'ê'

In [30]: len(single_char)
Out[30]: 1

In [31]: len(multiple_chars)
Out[31]: 2
```

We can use the built in standard library `unicodedata` to normalize Unicode strings [@python3unicodedocs].

```python
In [32]: import unicodedata

In [33]: len(unicodedata.normalize("NFD", single_char))
Out[33]: 2
```

It is best practice to add the following lines to the top of your Python file that you expect to run as scripts.

```python
#!/usr/bin/env/python
# -*- coding: utf-8 -*-
```

If your Python files are part of a package, just adding the second line is sufficient.
I recommend using [pre-commit](using-pre-commit-hooks.html) hooks to ensure that [the encoding pragma of python files are fixed](https://github.com/pre-commit/pre-commit-hooks/blob/31d41ff29115a87808277ee0ec23999b17d5b583/pre_commit_hooks/fix_encoding_pragma.py)
before making a git commit.

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
As we saw earlier, this is the number of code points in the unicode string.

Julia `String` literals are encoded using the UTF-8 encoding.
In Python, the indexing into a string would return the code point at the string.
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

If we want each code point in a Julia `String`, we can use `eachindex`[^julia].

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

If we wish to encode a Julia string as UTF-8[^juliatrancode], we can use the following:

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
