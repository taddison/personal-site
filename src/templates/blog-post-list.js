import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

import PostSummaryList from "../components/post-summary-list"
import LinkButton from "../components/link-button"
import BlogLinkSummary from "../components/blog-link-summary"

const BlogPostList = props => {
  const posts = props.data.allMarkdownRemark.edges
  const { currentPage, numberOfPages } = props.pageContext
  const isLast = currentPage === numberOfPages
  const nextPage = currentPage + 1
  const previousPage = currentPage < 3 ? `` : currentPage - 1

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
              rel="next"
              label={`← Newer`}
            />
          </li>
          <li>
            {!isLast && (
              <LinkButton
                to={`/blog/${nextPage}`}
                rel="prev"
                label={`Older →`}
              />
            )}
          </li>
        </ul>
        <div className="mt-4">
          <BlogLinkSummary />
        </div>
      </section>
    </Layout>
  )
}

export default BlogPostList

export const pageQuery = graphql`
  query blogPostListQuery($skip: Int!) {
    allMarkdownRemark(
      filter: { fields: { sourceName: { eq: "blog" } } }
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
