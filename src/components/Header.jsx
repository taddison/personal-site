import React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"

const propTypes = {
  title: PropTypes.string.isRequired,
}

const Header = ({ title }) => {
  return (
    <header className="bg-accent-1 border-accent-5 border-b p-4 mb-6 flex items-center">
      <h1 className="flex-grow">
        <Link className="text-2xl font-extrabold hover:text-accent-3" to={`/`}>
          {title}
        </Link>
      </h1>
      <div>
        <Link to="/about" className="font-semibold hover:text-accent-3">
          About
        </Link>{" "}
        <Link to="/blog" className="font-semibold hover:text-accent-3">
          Blog
        </Link>
      </div>
    </header>
  )
}

Header.propTypes = propTypes

export default Header
