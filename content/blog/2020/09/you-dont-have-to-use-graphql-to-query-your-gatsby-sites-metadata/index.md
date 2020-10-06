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

And at this point even if you referece your Twitter bio in three places on your site, maybe it's also fine to hardcode in three places as you'll almost certainly not be changing your Twitter handle all that often (if ever). If you do change it, then a find & replace for the full URI (`https://twitter.com/tjaddison`) is going to make quick work of it.

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

In the example above I've kept the same nesting (siteMetadata/social/Twitter) though I could have used anything I want (e.g. socialLinks/twitterBioFullUri).

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

### How did we end up with GraphQL everywhere?

I can't say for sure, but I'd put it down to all the documentation and starters focusing heavily on GraphQL, and the lack of any alternative 'best-practice' documents. The other driving force is the natural tendency for most of us to over-abstract and make everything configurable.

Over-abstraction.
No/limited vetting for starters.

[the docs requested]: https://www.gatsbyjs.com/docs/gatsby-config/#sitemetadata
[twitter bio]: https://twitter.com/tjaddison
[jared palmer's feelings on gatsby]: https://jaredpalmer.com/gatsby-vs-nextjs
