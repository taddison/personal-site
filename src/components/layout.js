import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"

const Layout = props => {
  const { children } = props;
  
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            author
          }
        }
      }
    `
  )

  const { author, title } = site.siteMetadata;

  return (
    <>
      <header className="bg-gray-200 p-4 border-gray-300 border-b mb-6">
        <h1>
          <Link className="text-2xl font-extrabold" to={`/`}>
            {title}
          </Link>
        </h1>
      </header>
      <div className="mx-auto max-w-5xl px-2">
        <main>{children}</main>
      </div>
      <footer className="bg-gray-200 p-12 border-gray-300 border-t mt-6 flex flex-col items-center">
        <div className="mb-4">GitHub Twitter LinkedIn RSS</div>
        <div>
          {author} • {new Date().getFullYear()} • tjaddison.com
        </div>
      </footer>
    </>
  )
}

export default Layout
