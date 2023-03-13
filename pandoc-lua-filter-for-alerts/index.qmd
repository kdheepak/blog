---
title: Pandoc lua filter for alerts
date: 2022-03-31T02:27:44-0600
categories: [pandoc]
keywords: pandoc, lua, filter
summary: Pandoc lua filter for showing alerts
---

This is the example output of the markdown containing alert divs in pandoc.
The unicode icons are inserted into the HTML using a pandoc lua filter.

::: callout
::: warning
This is a `warning`.
:::
:::

::: callout
::: error
This is a `error`.
:::
:::

::: callout
::: info
This is a `info`.
:::
:::

::: callout
::: success
This is a `success`.
:::
:::

::: callout
::: hint
This is a `hint`.
:::
:::

::: callout
::: todo
This is a `todo`.
:::
:::

::: callout
::: tip
This is a `tip`.
:::
:::

::: callout
::: note
This is a `note`.
:::
:::

::: callout
::: exercise
This is a `exercise`.
:::
:::

::: callout
Quarto supports additional callouts.
:::

::: callout-note
This is a Quarto `callout-note`.
:::

::: callout-tip
This is a Quarto `callout-tip`.
:::

::: callout-important
This is a Quarto `callout-important`.
:::

::: callout-caution
This is a Quarto `callout-caution`.
:::

::: callout-warning
This is a Quarto `callout-warning`.
:::
