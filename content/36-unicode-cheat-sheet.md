---
title: My cheat sheet for working with unicode
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
  @fasterthanlime
  @hsivonen
  @joelonsoftware
---

I wanted to make a cheat sheet for myself that contains some of the different things I use when it comes to unicode.

First some basics:

1. Unicode codepoints are unique numbers to express an abstract character, concept or graphical representation.
   These graphical representations may look similar visually but represent different "ideas".
   For example: A, Α, А, Ａ are all different unicode code points.

   - 'A' U+0041 LATIN CAPITAL LETTER A
   - 'Α' U+0391 GREEK CAPITAL LETTER ALPHA
   - 'А' U+0410 CYRILLIC CAPITAL LETTER A
   - 'Ａ' U+FF21 FULLWIDTH LATIN CAPITAL LETTER A

   In vim in insert mode, you can type `Ctrl+V`^[_aside_: Check out `:help i_CTRL-V_digit` for more information. Also check out <https://github.com/chrisbra/unicode.vim>.] followed by

   - a decimal number [0-255]. `Ctrl-v255` will insert `ÿ`.
   - the letter `o` and then an octal number [0-377]. `Ctrl-vo377` will insert `ÿ`.
   - the letter `x` and then a hex number [00-ff]. `Ctrl-vxff` will insert `ÿ`.
   - the letter `u` and then a 4-hexchar Unicode sequence. `Ctrl-vu03C0` will insert `π`.
   - the letter `U` and then an 8-hexchar Unicode sequence. `Ctrl-vU0001F409` will insert `🐉`.

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

1. When receiving or reading data, you **must** know the encoding used to interpret it correctly.
   A Unicode encoding is not guaranteed to contain any information about the encoding.
   Different encodings exist for efficiency, performance and backward compatibility, and data in one encoding may work  in another but is not strictly always going to work.
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
