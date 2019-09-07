import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../../components/layout"
import SEO from "../../components/seo"

const TagIndex = props => {
  return (
    <Layout>
      <SEO title="Post tags" />
      <div>tags</div>
    </Layout>
  )
}

export default TagIndex
