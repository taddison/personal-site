import React from "react"
import { graphql } from "gatsby"

import Layout from "../../components/layout"
import SEO from "../../components/seo"

import PostSummaryList from "../../components/post-summary-list"
import LinkButton from "../../components/link-button"
import BlogLinkSummary from "../../components/blog-link-summary"

const BlogIndex = props => {
  const { data } = props
  const posts = data.allMarkdownRemark.edges

  return (
    <Layout>
      <SEO title="Blog" />
      <h2 className="text-3xl font-bold mb-6 text-center">Blog</h2>
      <div className="mt-4 mb-6">
        A technical blog which covers everything from the frontend to making SQL
        Server go fast. Recent posts are shown below.
        <BlogLinkSummary />
      </div>
      <PostSummaryList posts={posts} />
      <hr className="my-6" />
      <section>
        <ul className="flex justify-between flex-wrap">
          <li></li>
          <li>
            <LinkButton to={`/blog/2`} label={`Older →`} rel={`next`} />
          </li>
        </ul>
      </section>
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      limit: 10
    ) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
            tags
          }
        }
      }
    }
  }
`
