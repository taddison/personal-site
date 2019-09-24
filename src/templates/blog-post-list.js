import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

import PostSummaryList from "../components/PostSummaryList"
import LinkButton from "../components/LinkButton"
import BlogLinkSummary from "../components/BlogLinkSummary"

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
              label={"← Newer"}
            />
          </li>
          <li>
            {!isLast && (
              <LinkButton
                to={`/blog/${nextPage}`}
                rel="next"
                label={"Older →"}
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
