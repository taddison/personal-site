---
title: Updating to Tailwind Typography to style markdown posts
tags: ["GatsbyJS", "Tailwind CSS", "Markdown", "Blog"]
shareimage: "./tailwindconfig.png"
date: "2020-08-31T00:00:00.0Z"
---

Last year I shared some CSS to [style your markdown posts with Tailwind CSS]. Earlier this year a Typography plugin was released for [Tailwind CSS] that would...take care of styling your vanilla HTML for you (the kind you might get from say...using Gatsby JS to render your markdown).

To get started I installed the plugin:

```shell
yarn add @tailwindcss/typography
# or by adding the UI plugin (which includes typography), which I used on the site
yarn add @tailwindcss/ui
```

And then update the class on the element that will contain the rendered markdown:

```diff
- <article className="markdown">
+ <article className="prose prose-lg">
```

And done! There were a few differences between my [old stylesheet][style your markdown posts with tailwind css] and the new plugin:

- Different default text color (`bg-gray-700` instead of `bg-gray-800`)
- Different link styling (gray with underline - far too edgy for me!)
- Added quotes around `inline code` and blockquotes
- More spacing around headers and between lines
- A lower max-width for the container

I was pleasantly surprised to discover that the site didn't look all that different after switching over - my stylesheet can't have been that bad from a design perspective.

Some of the changes I've decided to stick with - I've adopted `bg-gray-700` globally as well as the enhanced spacing. The other items though (link styling, quotes, container width) I wanted to undo some of the additions. Fortunately the [documentation on Github][typography documentation] made this a mostly painless experience.

Updating container width was really easy to update:

```diff
- <article className="prose prose-lg">
+ <article className="prose prose-lg max-w-none">
```

Changing the default link styling required adding a `typography` key to the `tailwind.config.js` file and overriding the default `a` styling:

```javascript
typography: (theme) => {
  return {
    default: {
      css: {
        a: {
          color: theme(`colors.blue.600`),
          textDecoration: `none`,
          "&:hover": {
            textDecoration: `underline`,
          },
        },
      },
    },
  }
}
```

Although it looks like a lot of code most of it is boilerplate, and the actual styling overrides are only a few lines. The lines above gave me back my blue links with that all-important underline-on-hover (which maybe qualifies as retro in 2020?).

The final change was to disable the additional quotes (which use before/after content) - what I used was the following addition to the `css` key in the config:

```javascript
// in the css: { ...block ... }
"code::before": { content: `` },
"code::after": { content: `` },
"blockquote p:first-of-type::before": {
  content: ``,
},
"blockquote p:last-of-type::after": {
  content: ``,
},
```

And we're _almost_ done. The one piece of custom styling I had to preserve was the rule that stops `prismjs` from causing `extremely long pieces of inline code (like this one here)` to scroll rather than wrap (now targeting `prose`, rather than my old `markdown` class):

```css
.prose :not(pre) > code.language-text {
  white-space: pre-line;
}
```

Overall I'm really happy to be building on a design foundation that will evolve as Tailwind CSS does. It also allowed me to replace about 100 lines of custom CSS with 20 lines of tailwind overrides.

[style your markdown posts with tailwind css]: https://tjaddison.com/blog/2019/08/styling-markdown-tailwind-gatsby/
[tailwind css]: https://tailwindcss.com/
[typography plugin]: https://tailwindcss.com/docs/typography-plugin
[typography documentation]: https://github.com/tailwindlabs/tailwindcss-typography