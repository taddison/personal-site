import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

class Home extends React.Component {
  render() {
    return (
      <Layout location={this.props.location}>
        <SEO title="All posts" />
        <div className="text-xl">
          <span className="block text-4xl mb-4 font-bold">Hey there! 👋</span>
          Check out my{` `}
          <Link
            className="font-semibold hover:underline hover:text-accent-3"
            to="/blog"
          >
            technical blog
          </Link>
          , or read a little more{` `}
          <Link
            className="font-semibold hover:underline hover:text-accent-3"
            to="/about"
          >
            about me
          </Link>
          .<span className="block italic ml-4 mt-4">- Tim</span>
        </div>
      </Layout>
    )
  }
}

export default Home
