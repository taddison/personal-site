---
date: "2022-08-31T00:00:00.0Z"
title: Processing images linked from frontmatter with eleventy-img to use in meta tags
shareimage: "./shareimage.png"
tags: [Eleventy]
templateEngineOverride: "md"
# cSpell:words shortcode shortcodes
# cSpell:ignore srcset
---

Given a markdown file (`/blog/hello-world/index.md`) with frontmatter that looks like this:

```yaml
---
shareimage: "small.png"
---
```

How can we process that image with [eleventy-img plugin] and render a meta tag:

```html
<!-- note the generated filename is a content hash-width combination -->
<meta property="og:image" content="/blog/hello-world/xfO_genLg4-600.png" />
```

This post will cover the steps needed, and assumes a basic familiarity with [Eleventy].

> Despite tonnes of great documentation of the various features of Eleventy and its plugins, the lack of an example that showed processing images via frontmatter left me struggling with this as a newcomer to the ecosystem.

## Setup

In addition to `@11ty/eleventy` you'll need `@11ty/eleventy-img`. The code below assumes you're using [Nunjucks] as the template language. Finally, we've got the following file structure (note the images are in the same folder as the markdown file):

```
/blog
  /hello-world
    index.md
    giant.png
    small.png
```

## Processing the image

To copy the image to our output folder (along with resizing and any other processing we want to do) we'll be creating a [shortcode]:

```javascript
// .eleventy.js
const Image = require("@11ty/eleventy-img");

async function shareImageShortcode(src) {
  // src might be small.png - taken from frontmatter
  const { url } = this.page;
  // url might be /blog/hello-world/
  const imageSrc = "." + url + src;
  let metadata = await Image(imageSrc, {
    widths: [600],
    formats: ["jpeg"],
    urlPath: url,
    outputDir: `./_site/${url}`,
  });

  const data = metadata.jpeg[0];
  // data.url might be /blog/hello-world/xfO_genLg4-600.jpeg
  // note the filename is a content hash-width combination
  return data.url;
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addNunjucksAsyncShortcode(
    "shareImageUri",
    shareImageShortcode
  );

  return {
    markdownTemplateEngine: "njk",
  };
};
```

The code above is making a few assumptions:

- We are creating a jpeg image (broadest support - we can't use multiple sources)
- We're making that image 600 pixels wide (we can't use a `srcset`)
- The output directory is `_site`

> The contents of `this.page` are [well documented][the page variable contents] and are available in all shortcodes

The shortcode we've created is `shareImageUri` which we can now use in a template.

## Using the shortcode in a template

We can use the shortcode in a template (which will need to be one that can render into the final `head` tag) like this:

```nunjucks
<!-- part of default.njk -->
<head>
  <meta>
  {% if shareimage %}
    <meta property="og:image" content="{% shareImageUri shareimage %}" />
  {% endif %}
  </meta>
</head>
```

Because of the [data cascade] the frontmatter value `shareimage` will be available. If you want a fallback image you can use an `{% else %}` block to render a hardcoded alternative. You'll probably want to put that somewhere in the root of your site (e.g. `/img`) rather than generating the same placeholder in every post's folder (which using the shortcode we created would do).

And that's all there is to it!

## What did I miss

As a total newbie to Eleventy I'm sure I've missed some obvious stuff. If you can point me in the right direction on any of the below please mail me _eleventy-feedback_ at this blog's domain.

- Rather than hardcoding `_site` is it accessible somewhere? I can see that the `outputPath` starts with that but I'd need to assume the output path was a single folder only.
- This all seemed fairly simple _in hindsight_, and the documentation has all the bits needed to get it working. Is there an image tutorial I missed that explains this, or I am just spoiled coming from a world where Gatsby did a pretty good job at processing everything as an image?
- Working with local images using relative file paths was a little tricky both here and with rendering images in markdown posts (another post!) - is there a go-to tutorial/document/starter that covers this? Some of my path manipulation code feels like it could have been easier?

[eleventy]: https://www.11ty.dev/docs/
[eleventy-img plugin]: https://www.11ty.dev/docs/plugins/image/
[the page variable contents]: https://www.11ty.dev/docs/data-eleventy-supplied/#page-variable-contents
[data cascade]: https://www.11ty.dev/docs/data-cascade/
[nunjucks]: https://www.11ty.dev/docs/languages/nunjucks/
[shortcode]: https://www.11ty.dev/docs/shortcodes/
