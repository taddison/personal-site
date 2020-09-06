import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

import LinkButton from "../components/link-button"

import { Link } from "gatsby"

const LinksPostList = (props) => {
  const posts = props.data.allMarkdownRemark.edges
  const { currentPage, numberOfPages } = props.pageContext
  const isLast = currentPage === numberOfPages
  const isFirst = currentPage === 1
  const nextPage = currentPage + 1
  const previousPage = isFirst ? `` : currentPage - 1
  const postCount = posts.length

  return (
    <Layout>
      <SEO title={`Links - Page ${currentPage}`} />
      <h2 className="text-3xl font-bold mb-6 text-center">
        Links - Page {currentPage}/{numberOfPages}
      </h2>

      {posts.map((post, i) => {
        const node = post.node
        return (
          <div key={node.fields.slug}>
            <article className="rounded p-0 sm:p-5 border-gray-100 hover:bg-gray-100 hover:shadow-md">
              <header className="mb-1">
                <h3 className="font-semibold text-2xl">
                  <Link to={node.fields.slug}>{node.frontmatter.date}</Link>
                </h3>
              </header>
              <section className="mb-4">
                <p
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: node.html,
                  }}
                />
              </section>
            </article>
            {i < postCount - 1 && (
              <div className="flex flex-col items-center my-6">
                <hr className="w-1/2" />
              </div>
            )}
          </div>
        )
      })}

      <hr className="my-6" />
      <section>
        <ul className="flex justify-between flex-wrap">
          <li>
            {!isFirst && (
              <LinkButton
                to={`/links/${previousPage}`}
                rel="next"
                label={`← Newer`}
              />
            )}
          </li>
          <li>
            {!isLast && (
              <LinkButton
                to={`/links/${nextPage}`}
                rel="prev"
                label={`Older →`}
              />
            )}
          </li>
        </ul>
      </section>
    </Layout>
  )
}

export default LinksPostList

export const pageQuery = graphql`
  query linksPostListQuery($skip: Int!) {
    allMarkdownRemark(
      filter: { fields: { sourceName: { eq: "links" } } }
      sort: { fields: [frontmatter___date], order: DESC }
      limit: 10
      skip: $skip
    ) {
      edges {
        node {
          html
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
          }
        }
      }
    }
  }
`
