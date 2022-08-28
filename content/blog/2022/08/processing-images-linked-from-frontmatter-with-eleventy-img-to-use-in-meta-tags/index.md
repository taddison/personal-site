---
date: "2022-08-31T00:00:00.0Z"
title: Processing images linked from frontmatter with eleventy-img to use in meta tags
#shareimage: "./shareimage.png"
tags: [Eleventy]
# cSpell:words
# cSpell:ignore
---

Given a markdown file (`/blog/hello-world/index.md`) with frontmatter that looks like this:

```yaml
---
shareimage: "small.png"
---
```

How can we process that image with [eleventy-img] and render a meta tag:

```html
<meta property="og:image" content="/blog/hello-world/small.png" />
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

> With the benefit of hindsight, I can confirm the documentation spells out everything you need (between the [eleventy-img plugin], [the page variable contents] and the [data cascade]). Even after reading it all, putting it all together without a reference took me a while is there an 'images in Eleventy' resource I missed that makes this all obvious?

[eleventy]: https://www.11ty.dev/docs/
[eleventy-img plugin]: https://www.11ty.dev/docs/plugins/image/
[the page variable contents]: https://www.11ty.dev/docs/data-eleventy-supplied/#page-variable-contents
[data cascade]: https://www.11ty.dev/docs/data-cascade/
[nunjucks]: https://www.11ty.dev/docs/languages/nunjucks/
