---
title: Cheat sheet for working with unicode
category: blog
date: 2020-09-19T02:29:49-06:00
tags: programming, unicode, python, julia, vim
keywords: python, julia, vim, unicode
summary: Comparing unicode and string interfaces in various programming languages
references:
- id: joelonsoftware
  title: "The Absolute Minimum Every Software Developer Absolutely, Positively Must Know About Unicode and Character Sets (No Excuses!)"
  URL: https://www.joelonsoftware.com/2003/10/08/the-absolute-minimum-every-software-developer-absolutely-positively-must-know-about-unicode-and-character-sets-no-excuses/
- id: fasterthanlime
  title: "Working with strings in Rust"
  URL: https://fasterthanli.me/articles/working-with-strings-in-rust
---

I wanted to make a cheat sheet for myself about the various ways different programming languages handle strings,
and the different functions associated with them.

First some basics:

1. Unicode codepoints are unique numbers to express an abstract character, concept or graphical representation.
  These graphical representations may look visually similar.
  For example: A, Α, А, Ａ are all different unicode code points.

  - 'A' U+0041 LATIN CAPITAL LETTER A
  - 'Α' U+0391 GREEK CAPITAL LETTER ALPHA
  - 'А' U+0410 CYRILLIC CAPITAL LETTER A
  - 'Ａ' U+FF21 FULLWIDTH LATIN CAPITAL LETTER A

  In vim in insert mode, you can type `Ctrl+V` followed by

  - a decimal number. `Ctrl-v255` will insert `ÿ`.
  - `o` and then an octal number. `Ctrl-vo377` will insert `ÿ`.
  - `x` and then a hex number. `Ctrl-vxff` will insert `ÿ`.
  - `u` and then a 4-hexchar Unicode sequence. `Ctrl-vu03C0` will insert `π`.
  - `U` and then an 8-hexchar Unicode sequence. `Ctrl-vU0001F409` will insert `🐉`.

  [^1]: _aside_: Check out `:help i_CTRL-V_digit` for more information. Also check out <https://github.com/chrisbra/unicode.vim>.

1. The same "idea", i.e. codepoint can be _encoded_ into different bits when represented on a machine depending on the encoding chosen.
  An encoding is a map or transformation of a codepoint into bits or bytes.
  The idea for a 🐉 can be encoded into UTF-8, UTF16, UTF32 etc.

  ```python
  In [1]: s = '🐉'

  In [2]: s.encode('utf-8')
  Out[2]: b'\xf0\x9f\x90\x89'

  In [3]: s.encode('utf-16')
  Out[3]: b'\xff\xfe=\xd8\t\xdc'

  In [4]: s.encode('utf-32')
  Out[4]: b'\xff\xfe\x00\x00\t\xf4\x01\x00'

  In [5]: s.encode()
  Out[5]: b'\xf0\x9f\x90\x89'
  ```

1. When receiving or reading data, you **must** know the encoding used to interpret it correctly.
  A Unicode encoding is not guaranteed to contain any information about the encoding.
  Different encodings exist for efficiency, performance and backward compatibility, and data in one encoding may work in another but is not strictly always going to work.
  For example, in the following binary data `01000001_01000010_01000011` can be decoded using `ascii` or `utf-8`, but naturally does not have a transformation when using a `utf-16` decoder.

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
