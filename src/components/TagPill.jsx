import React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"

const propTypes = {
  tag: PropTypes.string.isRequired,
}

const TagPill = ({ tag, customLabel }) => {
  const label = customLabel || `#${tag}`

  return (
    <Link to={`/blog/tags/#${tag}`}>
      <span className="inline-block rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mx-1 my-1 border-accent-5 border block hover:bg-accent-3 hover:text-white hover:border-accent-3">
        {label}
      </span>
    </Link>
  )
}

TagPill.propTypes = propTypes

export default TagPill
