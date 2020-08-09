import React from "react"
import { Link } from "gatsby"

const BlogLinkSummary = () => (
  <React.Fragment>
    You can also browse{` `}
    <Link
      className="font-semibold hover:text-accent-4 hover:underline"
      to="/blog/tags"
    >
      posts by tag
    </Link>
    , view the{` `}
    <Link
      className="font-semibold hover:text-accent-4 hover:underline"
      to="/blog/archive"
    >
      whole archive
    </Link>
    , or subscribe to the{` `}
    <a
      className="font-semibold hover:text-accent-4 hover:underline"
      href="/rss.xml"
    >
      RSS feed
    </a>
    .
  </React.Fragment>
)

export default BlogLinkSummary
