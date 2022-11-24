---
title: "Link Roundups"
date: "2019-11-30T00:00:00.0Z"
shareimage: "./link-page.png"
description: "I'm now sharing link roundups - interesting stuff I've seen and you might find interesting."
tags: ["Blog", "GatsbyJS"]
---

I've started to publish [link roundups] to the site. I used to share these in weekly/fortnightly newsletters at work, and as I invariably re-shared most of them outside of work anyway, figured I'd put them on the blog. I used to do these weekly, though think I'll settled for an irregular cadence that sees them come in once or twice a month.

The links pages are implemented as markdown pages, and in order to prevent them showing up as blog posts (and in all the blog meta pages like tags, history, etc.) I used the [gatsby-remark-source-name] package. My `gatsby-config.js` now contains two markdown imports:

```js
{
  resolve: `gatsby-source-filesystem`,
  options: {
    path: `${__dirname}/content/blog`,
    name: `blog`,
  },
},
{
  resolve: `gatsby-source-filesystem`,
  options: {
    path: `${__dirname}/content/links`,
    name: `links`,
  },
}
```

Anywhere I need to refer to either blog posts or links posts I can use the `name` attribute to disambiguate the `allMarkdownRemark` node - the following is an example from the `gatsby-node.js` file that builds the `/links` pages:

```graphql
{
  allMarkdownRemark(
    filter: { fields: { sourceName: { eq: "links" } } }
    sort: { fields: [frontmatter___date], order: DESC }
    limit: 1000
  ) {
    edges {
      node {
        fields {
          slug
        }
      }
    }
  }
}
```

You can see all the changes needed to add the new post type in [this pull request][add links type to blog pr]. There are probably a few rough edges - I haven't got that many links pages so pagination and navigation may require some fixes.

Once I've got a few more links pages up I'll see about adding a 'recent updates' component to the home page, which would show a feed of posts (links or blog entries). The RSS feed probably needs some attention to, as does the navigation (now there are blogs _and_ links to worry about!).

For now I'm just glad to [share the keystrokes][count your keystrokes article] with a wider audience.

[link roundups]: /blog/tags/#Links
[gatsby-remark-source-name]: https://github.com/elboman/gatsby-remark-source-name
[add links type to blog pr]: https://github.com/taddison/personal-site/pull/7
[count your keystrokes article]: https://blog.jonudell.net/2007/04/10/too-busy-to-blog-count-your-keystrokes/
