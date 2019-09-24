import React from "react"
import { useStaticQuery, graphql } from "gatsby"

import Header from "./header"

const Layout = props => {
  const { children } = props

  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            author
            social {
              twitter
              github
              linkedin
            }
          }
        }
      }
    `
  )

  const { author, title, social } = site.siteMetadata

  return (
    <div className="min-h-screen flex flex-col">
      <Header title={title} />
      <div className="mx-auto max-w-5xl px-8 md:px-0 flex-1 w-full md:w-5/6">
        <main>{children}</main>
      </div>
      <footer className="bg-accent-1 border-accent-5 border-t pb-10 pt-6 mt-6 flex flex-col items-center">
        <div className="mb-4 font-semibold">
          <a
            className="hover:text-accent-3"
            href={`https://www.github.com/${social.github}`}
          >
            GitHub
          </a>
          {` `}
          <a
            className="hover:text-accent-3"
            href={`https://twitter.com/${social.twitter}`}
          >
            Twitter
          </a>
          {` `}
          <a
            className="hover:text-accent-3"
            href={`https://www.linkedin.com/in/${social.linkedin}`}
          >
            LinkedIn
          </a>
          {` `}
          <a className="hover:text-accent-3" href={`/rss.xml`}>
            RSS
          </a>
        </div>
        <div>
          {author} • {new Date().getFullYear()} • tjaddison.com
        </div>
      </footer>
    </div>
  )
}

export default Layout
