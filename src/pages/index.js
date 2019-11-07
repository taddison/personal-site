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
          <span className="block text-4xl mb-4 font-bold">Hey there! 👋</span>I{" "}
          <Link
            className="font-semibold hover:underline hover:text-accent-3"
            to="/blog"
          >
            write a blog
          </Link>{" "}
          on mostly engineering topics (ranging from SQL Server to Gatsby), and
          occasionally publish{" "}
          <Link
            className="font-semibold hover:underline hover:text-accent-3"
            to="/links"
          >
            link roundups
          </Link>{" "}
          of stuff I find interesting. You can also read a little more {" "} 
          <Link
            className="font-semibold hover:underline hover:text-accent-3"
            to="/about"
          >
          about me
          </Link>
          , or see what I'm up to on{" "}
          <a
            className="font-semibold hover:underline hover:text-accent-3"
            href="https://www.github.com/taddison"
          >
            GitHub
          </a>
          .<span className="block italic ml-4 mt-4">- Tim</span>
        </div>
      </Layout>
    )
  }
}

export default Home
