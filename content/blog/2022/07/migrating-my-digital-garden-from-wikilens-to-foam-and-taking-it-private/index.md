---
date: "2022-07-09T00:00:00.0Z"
title: Migrating my digital garden from WikiLens to Foam, and taking it private
shareimage: "./foamgraph.png"
tags: [Digital Garden, Foam]
# cSpell:words wikilens
# cSpell:ignore lostintangent fulldate foambubble
---

I've [previously talked about how much I loved][using-gistpad-to-manage-your-github-digital-gardens] the workflow that [GistPad] (and more recently [WikiLens]) enables for curating a digital garden. With the addition of [github.dev] browsing and editing are now possible from a browser - something I called out as missing two years ago. Given the slickness of the setup, what's prompted a change? In short: data gravity.

## Too many gardens

Having multiple digital gardens has long been a pain point - specifically as the digital garden I curate with my family grows, there are more instances when daily notes straddle the public and the private. In some cases the hee-hawing over whether to write one note in each, a split note, or come up with some interesting cross-reference system has been distraction enough to not write anything down at all. [Working with the garage door up] comes with some hidden costs it seems.

I'll still have blog posts as a very public outlet, and in the future consider exploring ways to mark notes in a private garden as public. More on which in a moment.

## Not enough... gardening tools?

The metaphor has got away from me a little, I'll admit.

When collapsing the two digital gardens together I decided to take another look at how [Foam] had come along (after dismissing it as a little too early two years ago). I was pleased to see it delivers on its vision of providing 'just-enough' tooling, but no more than that. A couple of items I was _extremely_ happy to see were templates, nested tags, and frontmatter support. Coupled with a vibrant community and a low switching cost, I decided to make the move.

### Migrating

> I migrated from a wiki that worked with [WikiLens]. These steps may work for other markdown-based wikis, but I've not tried them.

Start by modifying the `.vscode/extensions.json` file to recommend Foam rather than the extension you were using:

```diff
{
  "recommendations": [
-    "lostintangent.wikilens"
+    "foam.foam-vscode"
  ]
}
```

Create an empty `.vscode/foam.json` file to tell the Foam extension that this is a Foam workspace:

```json
{}
```

To get the daily page working I updated the `.vscode/settings.json` to include the following:

```diff
{
+  "foam.openDailyNote.directory": "Daily/",
+  "foam.openDailyNote.titleFormat": "dddd, mmmm d, yyyy"
}
```

This uses the [fulldate format] and defaults to creating the page in the `Daily` folder. The default filename is still `yyyy-MM-dd.md`, though that can also be customised by a setting.

> I strongly encourage you to read the [Foam documentation], and clone the sample to see all the features in action. The migration steps here only cover a subset of the capabilities of Foam.

### Differences

One of the only differences I've noticed is that [WikiLens] used the page title for links (as defined by the H1 in the document), whereas [Foam] uses the page name (based on the filename). As an example, links to daily pages required updates for their links:

```diff
- Last time I worked on this (see [[August 18, 2020]])...
+ Last time I worked on this (see [[2020-08-18]])...
```

### Early thoughts

Beyond the fact I never have to think about which digital garden to put a daily note in (hooray!), not much has really changed. This is a great result, and further confirms my suspicion that markdown based note-taking is likely to be durable all the way through to [the long now].

One thing I've found surprising is how little content I've been able to organically discover that discusses Foam (how people are using it, extending it, migrating to it). Part of this could be the name (`Foam` and `foambubble` are challenging search terms to get lost amongst), though it could also be the community is not publishing this content and it's all in Discord/GitHub issues/Twitter.

### What next?

For now the focus will be on ensuring any friction introduced by collapsing the two digital gardens into one will be minimal. So far this is mostly a question of disambiguation. On my public (only for me) wiki I had a `Personal Blog` page which clearly meant [tjaddison.com]. In the private (for our family) wiki that could mean any one of a number of personal blogs - thankfully renaming files automatically updates all references.

Introducing Foam has also allowed us to revisit some of our tagging strategies - we used to use hyphens to create parent/child structures, but with Foam we get native support for Parent/Child tags.

Once we've worked through any teething issues I'm very interested to explore what can be done with templates and frontmatter to create a much richer experience for some of the things we log in our digital garden (think books, restaurants, trips).

[using-gistpad-to-manage-your-github-digital-gardens]: /blog/2020/07/using-gistpad-to-manage-your-github-digital-gardens/
[gistpad]: https://marketplace.visualstudio.com/items?itemName=vsls-contrib.gistfs
[wikilens]: https://marketplace.visualstudio.com/items?itemName=lostintangent.wikilens
[foam]: https://github.com/foambubble/foam
[github.dev]: https://github.com/github/dev
[working with the garage door up]: https://notes.andymatuschak.org/z21cgR9K3UcQ5a7yPsj2RUim3oM2TzdBByZu
[fulldate format]: https://github.com/felixge/node-dateformat#mask-options
[foam documentation]: https://foambubble.github.io/foam/#getting-started
[the long now]: https://longnow.org/
[tjaddison.com]: https://tjaddison.com
