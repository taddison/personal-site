---
title: Spell checking your Markdown blog posts with cspell
tags: ["Blog", "Markdown"]
shareimage: "./cspell-output.png"
date: "2021-02-28T00:00:00.0Z"
---

I love authoring in Markdown as there is almost no friction - just write. When the time comes to publish though - at minimum you'll want a preview, and a spell check. If you're using VS Code then the [code spell checker extension] is the fastest way to get started (don't be fooled by the fact it says 'code spell checker' - it'll happily check any file, including Markdown).

But what if you've got a lot of posts you want to check? And what if perhaps you haven't been all that fastidious about spell-checking your posts in the past? That's where I was a few weeks ago, and I was happy to find there's a simple solution that requires nothing more than Node 12...

## Checking all files in a folder

To check all files anywhere under the `content/posts` folder that are either Markdown (`.md`) or MDX (`.mdx`) we can use [cspell] by running:

```bash
npx cspell content/posts/**/*.md*
```

We'll then see every file and any unknown words:

![cspell command line output](./cspell-output.png)

> Running this in the VS Code terminal allows you to CTRL-click any of the errors and be taken straight to that word in the file.

This is the same library that powers the [code spell extension] (that's what the c stands for in cspell), which means you'll see the same errors reported on the command line and when viewing the file.

This is a good start, but what if we're not happy with the defaults cspell uses?

## Changing the cspell defaults

If you're using the VS Code extension then by default any changes you make to the settings will be reflected in the `.vscode/settings.json` file - which probably isn't what you want if you plan on doing anything with cspell from the command line.

I suggest you create a `cspell.json` file in the root of your folder:

```json
{
  "version": 0.1
}
```

And now any changes you make in the context of the workspace will be placed in this file, which is also used by default when running cspell from the command line. As an example, if I wanted to ensure a particular repo was always checked using British English (rather than the American English default) I could add the following to the `cspell.json` file:

```json
{
  "version": 0.1,
  "language" "en-GB
}
```

The options available in the file are documented on the [cspell GitHub page][cspell].

## Adding words to the dictionary

## Installing cspell as a dev dependency

## Next steps

[code spell checker extension]: https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker
[cspell]: https://github.com/streetsidesoftware/cspell/tree/master/packages/cspell

##

## From testing

##

## Ignoring words

Easy way to ignore words in blog posts is to leverage comments in the yaml block, as an example:

```yaml
---
title: My great post about ZZZZOOOOOMMM
tags:
  - ZZZZOOOOOMMM
  - FASSSTTT
# cSpell:ignore ZZZZOOOOOMMM, FASSSTTT
```
