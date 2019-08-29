import React from "react"
import { Link } from "gatsby"

class Layout extends React.Component {
  render() {
    const { title, children } = this.props

    return (
      <div className="mx-auto max-w-4xl px-2">
        <header>
          <h1>
            <Link to={`/`}>{title}</Link>
          </h1>
        </header>
        <main>{children}</main>
        <footer>
          © {new Date().getFullYear()}, Built with
          {` `}
          <a href="https://www.gatsbyjs.org">Gatsby</a>
        </footer>
      </div>
    )
  }
}

export default Layout
