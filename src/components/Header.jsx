import React, { useState } from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"

const propTypes = {
  title: PropTypes.string.isRequired,
}

const Header = ({ title, hideAbout = false }) => {
  const [isExpanded, toggleExpanded] = useState(false)

  return (
    <header className="bg-accent-1 border-accent-5 border-b p-4 mb-6 flex items-center flex-wrap">
      <h1 className="flex-grow">
        <Link className="text-2xl font-extrabold hover:text-accent-3" to={`/`}>
          {title}
        </Link>
      </h1>
      <div className="block lg:hidden">
        <button
          onClick={() => toggleExpanded(e => !e)}
          className="flex items-center px-3 py-2 border rounded text-accent-5 border-accent-5 hover:text-accent-3 hover:border-accent-3"
        >
          <svg
            className="fill-current h-3 w-3"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>

      <div className="hidden lg:block">
        {!hideAbout && (
          <>
            <Link to="/about" className="font-semibold hover:text-accent-3">
              About
            </Link>{" "}
          </>
        )}
        <Link to="/blog" className="font-semibold hover:text-accent-3">
          Blog
        </Link>
      </div>
      <div
        className={`${
          isExpanded ? `block` : `hidden`
        } w-full block flex-grow lg:hidden`}
      >
        <div className="font-semibold text-right">
          {!hideAbout && (
            <>
              <Link to="/about" className="block hover:text-accent-3 p-2">
                About
              </Link>{" "}
            </>
          )}
          <Link to="/blog" className="block hover:text-accent-3 p-2">
            Blog
          </Link>
        </div>
      </div>
    </header>
  )
}

Header.propTypes = propTypes

export default Header
