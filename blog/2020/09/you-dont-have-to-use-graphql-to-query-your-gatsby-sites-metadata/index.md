---
title: You don't have to use graphql to query your Gatsby site's metadata
tags: ["GatsbyJS", "JavaScript", "React"]
shareimage: "./graphql.png"
date: "2020-09-30T00:00:00.0Z"
---

## The Challenge

The learning curve for GatsbyJS can be pretty rough. For me, a big part of that was feeling that you _had_ to use GraphQL or you were being distinctly 'un-Gatsby-like'. In addition to the documentation featuring it almost exclusively, every starter (from the official starters to popular community ones) had GraphQL everywhere. Because there were no counter-examples I happily went along and dutifully queried all my `siteMetadata` via GraphQL, as [the docs requested].

For an imaginary component that renders a link to my [Twitter bio] that would mean the following in `gatsby-config.js`:

```javascript
site: {
  siteMetadata: {
    social: {
      twitter: "tjaddison"
    }
  },
}
```

And then this code to query that value:

```jsx
// TwitterLink.js
import React from "react"
import { useStaticQuery, graphql } from "gatsby"

const TwitterLink = (props) => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            social {
              twitter
            }
          }
        }
      }
    `
  )

  return (
    <a href={`https://twitter.com/${site.siteMetadata.social.twitter}`}>
      Twitter
    </a>
  )
}
```

After teaching Gatsby to a few people (and having to apologize for the amount of boilerplate almost every time) and building out a dozen or so sites...I'm pretty confident that there are _several_ better ways of handling this.

### Solution 1 - Hardcode

Count how many times you reference the piece of data. Is it one? What would it look like if you hardcoded that value where you needed it?

```jsx
// TwitterLink.js
import React from "react"

const TwitterLink = (props) => {
  return <a href="https://twitter.com/tjaddison">Twitter</a>
}
```

Even if you reference your Twitter bio in three places on your site, maybe it's also fine to hardcode in those three places? You'll almost certainly not be changing your Twitter handle that often (if ever), and if you do change it a find & replace for the full URI (`https://twitter.com/tjaddison`) is going to make quick work of it.

If you're not building a site to share as a starter, do yourself a favour and keep it simple.

### Solution 2 - Reference a JavaScript object

If you're going to reference the data in a few places and/or it's going to change fairly often, then centralizing the data may make sense. Rather than putting the data into Gatsby's GraphQL layer, we'll export the values from a file (I used `site.config.js`) and then import that in any file that needs it.

```javascript
// site.config.js
module.exports = {
  siteMetadata: {
    social: {
      twitter: `tjaddison`,
    },
  },
}
```

```jsx
// TwitterLink.js
import React from "react"
import config from "../../site.config"

const TwitterLink = (props) => {
  return (
    <a href={`https://twitter.com/${config.siteMetadata.social.twitter}`}>
      Twitter
    </a>
  )
}
```

In addition to needing less code to consume the data, this method is easier to debug as we're working with plain old JavaScript (`console.log(config)` is far easier to work with than debugging the Gatsby GraphQL pipeline).

In the example above I've kept the same nesting (`siteMetadata/social/Twitter`) though I could have used any structure (e.g. `socialLinks/twitterBioFullUri`).

### Solution 3 - Hybrid

One of the strengths of the Gatsby ecosystem is the number of plugins that _just work_. Some of them rely on the presence of `siteMetadata` int order to _just work_ and may break if you no longer include that in your `gatsby-config.js` (one common plugin that expects `siteMetadata` is the RSS plugin [gatsby-plugin-feed]). If you want to keep those plugins working (without needing to reconfigure them) you can re-use your `site.config.js` data:

```javascript
// gatsby-config.js
const config = require(`./site.config`)

module.exports = {
  siteMetadata: config.siteMetadata,
  // rest of the file...

```

As long as you include the fields needed by the plugins (`gatsby-plugin-feed` needs `title`, `description`, and `siteUrl`) they'll work just fine.

### So no more GraphQL?

At least not when there is a better alternative!

You can't get very far with Gatsby without having to learn how to work with GraphQL and Gatsby's implementation. My suggestion is you don't _start_ there though, and for simple pieces of data you use the simplest technique that will work. Changing the site title (or your Twitter bio) shouldn't require people to even see GraphQL, let alone start questioning why it has been used.

I remember searching _really hard_ for the 'why GraphQL for this data' when first learning Gatsby, and the [Why Gatsby uses GraphQL] page doesn't offer much content. I do remember reading:

> GraphQL is certainly not required, but the benefits of adopting GraphQL are significant. GraphQL will simplify the process of building and optimizing your pages, so it’s considered a best practice for structuring and writing Gatsby applications.

Based on that I figured I better just go ahead and learn it. Older (maybe wiser?) me now looks at that document as a bit of marketing copy rather than a great assessment of the pros/cons of using GraphQL vs. other methods to populate data on your site. I'd also question what aspects of building the site it simplifies for most use cases! After teaching Gatsby a few times I'm now convinced the pedagogical value of having people deal with the GraphQL concepts just to get their name on a starter...definitely too much.

Speaking of starters - if the prevalence (nigh-exclusivity) of GraphQL in the docs is the genesis of this issue, then the starter library is what boosted this problem into the stratosphere.

### Gatsby starters

The first iteration of my site was a mess (it still is). It worked though, and I could have shared it for others to build on. I would have been sharing cobbled together bits of code with multiple solutions to a single problem (e.g. sourcing data). There were edge cases I'd worked around and not documented, and packages included that were no longer required. As something to _learn_ from it would have been a poor starting point.

And that is basically the experience I had when learning Gatsby - after completing the tutorial I picked a few different starters (either official or popular community submissions) and set about reverse engineering the 'why' of various technical decisions that were present in a 'good' Gatsby site.

This was not particularly helpful 😅.

My advice to people learning Gatsby today is to really vet any starter before committing to build on it (lest they find themselves with a partly TypeScript, partly styled-components, partly inline-CSS...'unique' starter). If something looks overcomplicated (in docs, blog posts, starters) then _it probably is_, consider how you'd solve the problem without Gatsby and see if that is any easier. I'm hopeful this situation will improve over time, otherwise it'll be hard to even suggest Gatsby for technical blogs (over something like [GitHub pages] or [11ty]).

If you want to explore more reading on the 'Gatsby is overkill' theme, I highly recommend the post by Jared Palmer that [takes these ideas a little further] (I'd like to point out I still think Gatsby is great - but I can see how it's not always the right fit for everyone).

[the docs requested]: https://www.gatsbyjs.com/docs/gatsby-config/#sitemetadata
[twitter bio]: https://twitter.com/tjaddison
[why gatsby uses graphql]: https://www.gatsbyjs.com/docs/why-gatsby-uses-graphql/
[github pages]: https://pages.github.com/
[11ty]: https://www.11ty.dev/
[takes these ideas a little further]: https://jaredpalmer.com/gatsby-vs-nextjs
[gatsby-plugin-feed]: https://www.gatsbyjs.com/plugins/gatsby-plugin-feed/
