import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../../components/layout"
import SEO from "../../components/seo"

import PostSummaryList from "../../components/PostSummaryList"
import LinkButton from "../../components/LinkButton"

const BlogIndex = props => {
  const { data } = props
  const posts = data.allMarkdownRemark.edges

  return (
    <Layout>
      <SEO title="Recent posts" />
      <h2 className="text-3xl font-bold mb-6 text-center">Recent Posts</h2>
      <PostSummaryList posts={posts} />
      <hr className="my-6" />
      <section>
        <ul className="flex justify-between flex-wrap">
          <li></li>
          <li>
            <LinkButton to={`/blog/2`} label={`Older →`} rel={`next`} />
          </li>
        </ul>
        <div className="mt-4">
          You can also browse{" "}
          <Link className="font-semibold hover:text-accent-4 hover:underline" to="/blog/tags">
            posts by tag
          </Link>
          , or view the{" "}
          <Link
            className="font-semibold hover:text-accent-4 hover:underline"
            to="/blog/archive"
          >
            whole archive.
          </Link>
        </div>
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
