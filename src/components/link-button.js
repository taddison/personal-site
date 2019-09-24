import React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"

const propTypes = {
  to: PropTypes.string.isRequired,
  rel: PropTypes.string,
  label: PropTypes.string.isRequired,
}

const LinkButton = ({ to, rel, label }) => (
  <Link
    to={to}
    rel={rel}
    className="font-bold py-2 pl-5 pr-3 border-accent-5 border block hover:bg-accent-3 hover:text-white hover:border-accent-3"
  >
    {label}
  </Link>
)

LinkButton.propTypes = propTypes

export default LinkButton
