---
title: You don't have to use graphql to query your Gatsby site's metadata
tags: ["GatsbyJS"]
# shareimage: "./tailwindconfig.png"
date: "2020-09-30T00:00:00.0Z"
---

## The Challenge

The learning curve for GatsbyJS can be pretty rough. Part of that (at least for me) was the feeling that you _had_ to use GraphQL or you were being distinctly 'un-Gatsbylike'. In addition to the documentation featuring it almost exclusively, every starter (from the official starters to popular community ones) had GraphQL everywhere. Because there were no counter-examples I happily went along and dutifully queried all my `siteMetadata` via GraphQL, as [the docs requested].

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

And then all this code to query that value:

```javascript
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

After teaching Gatsby to a few people (and having to apologize for the amount of boilerplate almost every time), as well as building out a dozen or so sites...I'm pretty confident that there are _several_ better ways of handling this.

### Solution 1 - Hardcode

Count how many times you reference the piece of data. Is it one? What would it look like if you hardcoded that value in place?

```javascript
// TwitterLink.js
import React from "react"

const TwitterLink = (props) => {
  return <a href="https://twitter.com/tjaddison">Twitter</a>
}
```

And at this point even if you reference your Twitter bio in three places on your site, maybe it's also fine to hardcode in three places as you'll almost certainly not be changing your Twitter handle that often (if ever). If you do change it, then a find & replace for the full URI (`https://twitter.com/tjaddison`) is going to make quick work of it.

If you're not specifically building a site to share as a starter, do yourself a favor and keep it simple.

### Solution 2 - Reference a JavaScript object

If you're going to reference the data in a few places and/or it's going to change fairly often, then centralizing the data may make sense. Rather than putting the data into Gatsby's GraphQL layer, we'll export the values from a file (I used `site.config.js`) and then import in any component that needs it.

```javascript
// site.config.js
module.exports = {
  siteMetadata: {
    social: {
      twitter: `tjaddison`,
    },
  },
}

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

As well as being terser, this is now super-easy to debug as we're working with plain old JavaScript (`console.log(config)` is far easier to work with than debugging GraphQL).

In the example above I've kept the same nesting (`siteMetadata/social/Twitter`) though I could have used anything I want (e.g. `socialLinks/twitterBioFullUri`).

### Solution 3 - Hybrid

One of the strengths of the Gatsby ecosystem is the number of plugins that 'just work'. Part of that 'just works' magic may break if you no longer include a `siteMetadata` node in your `gatsby-config.js`, as some plugins expect to query that - a notable example being the various RSS feed plugins. If you want to keep these plugins working without having to reconfigure them you can re-use your `site.config.js` file:

```javascript
// gatsby-config.js
const config = require(`./site.config`)

module.exports = {
  siteMetadata: config.siteMetadata,
  // rest of the file...

```

As long as you include the fields needed by the plugins (the RSS plugin needs `title`, `description`, and `siteUrl`) they'll work just fine.

### So no more GraphQL?

At least not where there is a better alternative!

You can't get very far with Gatsby without having to learn how to work with GraphQL and Gatsby's implementation - though I'm not sure the pedagogical tradeoff of having you learn this in order to update your Twitter bio is quite right.

I remember searching _really hard_ for the 'why' of this when first learning GraphQL, and the [Why Gatsby uses GraphQL] page doesn't offer much content. I do remember reading:

> GraphQL is certainly not required, but the benefits of adopting GraphQL are significant. GraphQL will simplify the process of building and optimizing your pages, so it’s considered a best practice for structuring and writing Gatsby applications.

And after that I figured I better just go ahead and learn it. Older (and brusied) me now looks at that document as a bit of marketing copy rather than a great assessment of the pros/cons of using GraphQL vs. other methods to populate data on your site. After teaching Gatsby a few times I'm now convinced the pedagogical value of having people deal with the GraphQL concepts just to get their name on a starter...definitely too much.

Speaking of starters - if the prevlance (nigh-exclusivity) of GraphQL in the docs is the genesis of this issue, then the starter library is what boosted this problem into the stratosphere.

### Gatsby starters

The first iteration of my site was a mess (it still is), and although I could have shared it I'd have been sharing cobbled together bits of code with multiple solutions to a single problem. There were edge cases I'd worked around and not documented, and packages that were no longer required. If I'd had shared it and some newcomer had picked it as their starter to build from...wow - talk about starting with a penalty!

This is basically the experience I had where I picked a few different starters (either official ones or popular community starters) and set about reverse engineering the 'why' of various technical decisions.

This was not particularly helpful 😅.

My advice to people learning Gatsby today is to really vet any starter before committing to build on it (lest they find themselves with a partly TypeScript, partly styled-components, partly inline-CSS...'challenge'), and if something looks overcomplicated then _it probably is_, and to see if there is a better way. I'm hopeful this will improve over time, otherwise it'll be hard to even suggest Gatsby for technical blogs (over something like [GitHub pages] or [11ty]).

Finally - if you want to explore more reading on the 'Gatsby is overkill' theme, I highly recommend this piece by Jared Palmer that [takes these ideas a little further] (he suggests ditching Gatsby entirely - for me at least I still see more pros than cons).

[the docs requested]: https://www.gatsbyjs.com/docs/gatsby-config/#sitemetadata
[twitter bio]: https://twitter.com/tjaddison
[why gatsby uses graphql]: https://www.gatsbyjs.com/docs/why-gatsby-uses-graphql/
[github pages]: https://pages.github.com/
[11ty]: https://www.11ty.dev/
[takes these ideas a little further]: https://jaredpalmer.com/gatsby-vs-nextjs
