import React from "react"
import { Link } from "gatsby"

import Header from "./header"

const Layout = props => {
  const { children } = props

  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Tim Addison" />
      <div className="mx-auto max-w-5xl px-8 md:px-0 flex-1 w-full md:w-5/6">
        <main>{children}</main>
      </div>
      <footer className="bg-accent-1 border-accent-5 border-t py-6 mt-6 flex flex-col items-center">
        <div>
          <Link
            className="font-semibold hover:text-accent-3 hover:underline"
            to="/about"
          >
            Tim Addison
          </Link>
          {` `}• {new Date().getFullYear()} •{` `}
          <Link
            className="font-semibold hover:text-accent-3 hover:underline"
            to="/"
          >
            tjaddison.com
          </Link>
        </div>
      </footer>
    </div>
  )
}

export default Layout
