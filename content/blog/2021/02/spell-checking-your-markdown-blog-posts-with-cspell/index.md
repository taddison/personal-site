---
title: Spell checking your Markdown blog posts with cspell
tags: ["Blog", "Markdown"]
shareimage: "./cspell-output.png"
date: "2021-02-28T00:00:00.0Z"
---

# Introduction

I love authoring in Markdown as there is almost no friction - just write. When the time comes to publish though - at minimum you'll want a preview, and a spell check. If you're using VS Code then the [code spell checker extension] is the fastest way to get started (don't be fooled by the fact it says 'code spell checker' - it'll happily check any file, including Markdown).

But what if you've got a lot of posts you want to check? And what if perhaps you haven't been all that fastidious about spell-checking your posts in the past? That's where I was a few weeks ago, and I was happy to find there's a simple solution that requires nothing more than Node 12...

# Demo

# Closing

[code spell checker extension]: https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker

## From testing

From the command line, check all md/mdx files with defaults:

```bash
npx cspell content/posts/**/*.md*
```

Control-click any error to jump straight to the word.

Update the language to `en-GB` in a config file (`cspell.json`):

```json
{
  "version": 0.1,
  "language" "en-GB
}
```

And now run cspell again to have it pick that change up.

## VSCode

Use the extension. If you _don't_ have a `cspell.json` file then any words added (or ignored) at the workspace level are added in vscode's `settings.json`. If you have a `cspell.json` file then they'll be put there instead.

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
