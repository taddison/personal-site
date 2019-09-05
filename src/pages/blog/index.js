import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../../components/layout"
import SEO from "../../components/seo"

import TagPill from "../../components/TagPill"

const BlogIndex = props => {
  const { data } = props
  const posts = data.allMarkdownRemark.edges

  return (
    <Layout>
      <SEO title="All posts" />
      {posts.map(({ node }) => {
        const title = node.frontmatter.title || node.fields.slug
        const tags = node.frontmatter.tags || []
        return (
          <article
            key={node.fields.slug}
            className="mb-6 rounded shadow-md p-3 border-gray-100 hover:bg-gray-100"
          >
            <Link to={node.fields.slug}>
              <h3 className="font-semibold text-2xl">{title}</h3>

              <header className="mb-1">
                <small className="italic text-gray-500">
                  {node.frontmatter.date}
                </small>
              </header>
              <section className="mb-4">
                <p
                  dangerouslySetInnerHTML={{
                    __html: node.frontmatter.description || node.excerpt,
                  }}
                />
              </section>
            </Link>
            <section>
              {tags.map(tag => {
                return <TagPill key={tag} link="/blog" tag={tag} />
              })}
            </section>
          </article>
        )
      })}
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
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
