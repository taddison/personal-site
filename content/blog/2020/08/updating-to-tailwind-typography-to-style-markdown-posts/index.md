---
title: Updating to Tailwind Typography to style markdown posts
tags: ["GatsbyJS", "Tailwind CSS", "Markdown", "Blog"]
shareimage: "./tailwindconfig.png"
date: "2020-08-31T00:00:00.0Z"
---

Last year I shared some CSS to [style your markdown posts in with Tailwind CSS]. Earlier this year a Typography plugin was released for [Tailwind CSS] that would...take care of styling your vanilla HTML for you (the kind you might get from say...using Gatsby JS to render your markdown).

To get started I installed the plugin:

```shell
yarn add @tailwindcss/typography
# or by adding the UI plugin (which includes typography), which I used on the site
yarn add @tailwindcss/ui
```

And then update the class on the container:

```diff
- <article className="markdown">
+ <article className="prose prose-lg">
```

And done! There were a few differences from my [old stylesheet][style your markdown posts in with tailwind css] and the new plugin:

- Different default text color (`bg-gray-700` instead of `bg-gray-800`)
- Different link styling (gray with underline - far too edgy for me!)
- Added quotes around `inline code` and blockquotes
- More spacing around headers and between lines
- A lower max-width for the container

I was pleasantly surprised to discover that the site didn't look all that different after switching over - my stylesheet can't have been that bad from a design perspective.

Some of the changes I've decided to stick with - I've adopted `bg-gray-700` globally as well as the enhanced spacing. The other items though (link styling, quotes, container width) I wanted to undo some of the additions. Fortunately the [documentation on Github][typography documentation] made this pretty easy.

To start with the the container width was really easy to update:

```diff
- <article className="prose prose-lg">
+ <article className="prose prose-lg max-w-none">
```

Changing the default link styling required adding a `typography` key to the `tailwind.config.js` file:

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

It's a lot of code, but it is very logical and I've now got my blue links back with hover-underline (which I guess qualify as retro now).

The final change was to disable the additional quotes (which use before/after content) - what I've got for now is the following addition to the `css` key in the config:

```javascript
// in the typography key's function...
"code::before": { content: `` },
"code::after": { content: `` },
"blockquote p:first-of-type::before": {
  content: ``,
},
"blockquote p:last-of-type::after": {
  content: ``,
},
```

And we're _almost_ done. The one piece of custom styling I did have to preserve was the rule that stops `prismjs` from causing `extremely long pieces of of inline code` to scroll rather than wrap (now targeting `prose`, rather than my old `markdown` class):

```css
.prose :not(pre) > code.language-text {
  white-space: pre-line;
}
```

Overall I'm really happy to be building on a design foundation that will evolve as Tailwind CSS does - and it's also replaced about 100 lines of custom CSS with around 20 lines of config overrides.

[style your markdown posts in with tailwind css]: https://tjaddison.com/blog/2019/08/styling-markdown-tailwind-gatsby/
[tailwind css]: https://tailwindcss.com/
[typography plugin]: https://tailwindcss.com/docs/typography-plugin
[typography documentation]: https://github.com/tailwindlabs/tailwindcss-typography
