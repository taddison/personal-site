---
title: "Adding cover images to your Gatsby blog"
date: "2019-10-20T00:00:00.0Z"
shareimage: ##TODO##
description: "If you'd like your blog posts to have a cover image show up on the post list and (or!) the post page, this guide will let you get responsive images that are also a11y approved."
tags: ["GatsbyJS", "Blog"]
---

If you decide to use GatsbyJS for your blog I would highly recommend starting with a simple starter and building up.  [Gatsby blog starter] is introduces a handful of concepts and is substantially easier to understand than some of the more advanced starters.  One feature that really adds some personality to your site is featured images for your posts - both on the post list, and on the post itself.  The rest of this article walks through the steps needed to go from the [Gatsby blog starter] to having featured images on the post list and post pages.

## TODO: Picture of the before/after ##

## Add the metadata to a post

The first thing to do is update our GraphQL schema, which we do by adding a new property to the blog post frontmatter.  To ensure our featured image is also accesible we'll specify some alt text.  As an example we'll add the existing image from the 'Hello World' post as a featured image.  You can give the property any name you want - I've used `featuredimage` which contains a `src` and an `alt`.

```
---
title: Hello World
date: "2015-05-01T22:12:03.284Z"
description: "Hello World"
featuredimage:
  src: "./salty_egg.jpg"
  alt: "A salty egg"
---
```

> If you are running `gatsby develop` you need to restart that task, as schema changes (or more broadly any changes that require re-running `gatsby-node.js`) aren't hot-reloadable.

You can verify this has worked by browsing the GraphQL schema at `http://localhost:8000/___graphql` and inspecing the `allMarkdownRemark` nodes - the `frontmatter` should now have a `featuredimage` property.  The image below shows that our salty egg post has a featured image, and the other two posts have nothing.

![GraphiQL showing featuredimage]("./salty-egg-featured.png")

## Adding the image to the post list

## Adding the image to the post

## Further reading

(gatsby image docs)

[Gatsby blog starter]: https://github.com/gatsbyjs/gatsby-starter-blog
https://blog.swingpulse.com/gatsby-meets-covers
https://juliangaramendy.dev/custom-open-graph-images-in-gatsby-blog/