---
title: Spell checking your Markdown blog posts with cspell
tags: ["Blog", "Markdown"]
shareimage: "./cspell-output.png"
date: "2021-02-28T00:00:00.0Z"
---

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
