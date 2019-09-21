import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

import PostSummaryList from "../components/PostSummaryList"
import LinkButton from "../components/LinkButton"

const BlogPostList = props => {
  const posts = props.data.allMarkdownRemark.edges
  const { currentPage, numberOfPages } = props.pageContext
  const isLast = currentPage === numberOfPages
  const nextPage = currentPage + 1
  const previousPage = currentPage < 3 ? "" : currentPage - 1

  return (
    <Layout>
      <SEO title={`Posts - Page ${currentPage}`} />
      <h2 className="text-3xl font-bold mb-6 text-center">
        Posts - Page {currentPage}/{numberOfPages}
      </h2>
      <PostSummaryList posts={posts} />
      <hr className="my-6" />
      <section>
        <ul className="flex justify-between flex-wrap">
          <li>
            <LinkButton
              to={`/blog/${previousPage}`}
              rel="prev"
              label={"← Newer Posts"}
            />
          </li>
          <li>
            {!isLast && (
              <LinkButton
                to={`/blog/${nextPage}`}
                rel="next"
                label={"Older Posts →"}
              />
            )}
          </li>
        </ul>
        <div className="mt-4">
          You can also browse{" "}
          <Link className="font-semibold hover:text-accent-4" to="/blog/tags">
            posts by tag
          </Link>
          , or view the{" "}
          <Link
            className="font-semibold hover:text-accent-4"
            to="/blog/archive"
          >
            whole archive.
          </Link>
        </div>
      </section>
    </Layout>
  )
}

export default BlogPostList

export const pageQuery = graphql`
  query blogPostListQuery($skip: Int!) {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      limit: 10
      skip: $skip
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
