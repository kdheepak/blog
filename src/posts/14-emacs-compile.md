---
title: Emacs Tips — Close compilation buffer
category: blog
date: 2015-07-19T12:43:56-06:00
tags: emacs
keywords: tips and tricks, compilation buffer, auto close
summary: This post shows how to close the compilation buffer in emacs if compile was successful ...
slug: emacs-tips-close-compilation-buffer-if-successful
---

When I work with markdown, $\LaTeX$ or code that requires compiling, I like to
check often if everything looks okay. Emacs has a good description of everything
you can do with the [CompileCommand](https://emacswiki.org/emacs/CompileCommand).

However, it does not have a description for auto-closing the buffer if the
compilation was successful. [StackOverflow](https://emacs.stackexchange.com/a/336) to the rescue!

```lisp
#!lisp
; from enberg on #emacs
(setq compilation-finish-function
(lambda (buf str)
    (if (null (string-match ".*exited abnormally.*" str))
        ;;no errors, make the compilation window go away in a few seconds
        (progn
            (run-at-time
            "1 sec" nil 'delete-windows-on
            (get-buffer-create "*compilation*"))
        (message "No Compilation Errors!")))))
```

Insert the above code into your `.emacs` file. You can change the time you wish
the buffer to be available by changing the "1 sec" in the above code
