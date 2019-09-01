import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

class Home extends React.Component {
  render() {
    return (
      <Layout location={this.props.location}>
        <SEO title="All posts" />
        <p>Hey.  Read the <Link to="/blog">blog.</Link></p>
      </Layout>
    )
  }
}

export default Home