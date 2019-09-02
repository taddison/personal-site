import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"

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
      <header className="bg-accent-1 border-accent-5 border-b p-4 mb-6">
        <h1>
          <Link
            className="text-2xl font-extrabold hover:text-accent-3"
            to={`/`}
          >
            {title}
          </Link>
        </h1>
      </header>
      <div className="mx-auto max-w-5xl px-2 flex-1">
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
          {" "}
          <a
            className="hover:text-accent-3"
            href={`https://twitter.com/${social.twitter}`}
          >
            Twitter
          </a>
          {" "}
          <a
            className="hover:text-accent-3"
            href={`https://www.linkedin.com/in/${social.linkedin}`}
          >
            LinkedIn
          </a>
          {" "}
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
