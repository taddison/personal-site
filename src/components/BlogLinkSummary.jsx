import React from "react"
import { Link } from "gatsby"

const BlogLinkSummary = () => {
  return (
    <React.Fragment>
      You can also browse{" "}
      <Link
        className="font-semibold hover:text-accent-4 hover:underline"
        to="/blog/tags"
      >
        posts by tag
      </Link>
      , view the{" "}
      <Link
        className="font-semibold hover:text-accent-4 hover:underline"
        to="/blog/archive"
      >
        whole archive
      </Link>
      , or subscribe to the{" "}
      <Link
        className="font-semibold hover:text-accent-4 hover:underline"
        to="/rss.xml"
      >
        RSS feed
      </Link>
      .
    </React.Fragment>
  )
}

export default BlogLinkSummary
