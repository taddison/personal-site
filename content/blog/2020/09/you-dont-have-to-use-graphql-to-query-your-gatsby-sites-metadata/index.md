---
title: You don't have to use graphql to query your Gatsby site's metadata
tags: ["GatsbyJS"]
# shareimage: "./tailwindconfig.png"
date: "2020-09-30T00:00:00.0Z"
---

The learning curve for GatsbyJS can be pretty rough. Part of that (at least for me) was the feeling that you _had_ to use GraphQL or you were being distinctly 'un-Gatsbylike'. In addition to the documentation featuring it almost exclusively, every starter (from the official starters to popular community ones) had GraphQL everywhere. Because there were no counter-examples I happily went along and dutifully queried all my `siteMetadata` via GraphQL, as [the docs requested].

This mean that in order to access some data in an object in `gatsby-config.js`:

```javascript
site: {
  siteMetadata: {
    title: "Tim Addison",
  },
}
```

I'd need to write a _lot_ of boilerplate:

```javascript
// AllHailGraphQL.js
import React from "react"
import { useStaticQuery, graphql } from "gatsby"

const AllHailGraphQL = (props) => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
          }
        }
      }
    `
  )

  return <div>{site.siteMetadata.title}</div>
}
```

After teaching Gatsby to a few people (and having to apologize for this behavior every time), and building out a dozen sites...I'm pretty confident that there are _several_ better ways of handling this.

[the docs requested]: https://www.gatsbyjs.com/docs/gatsby-config/#sitemetadata
[jared palmer's feelings on gatsby]: https://jaredpalmer.com/gatsby-vs-nextjs
