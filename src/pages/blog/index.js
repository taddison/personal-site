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
      <SEO title="Recent posts" />
      <h2 className="text-3xl font-bold mb-6 text-center">Recent Posts</h2>
      {posts.map(({ node }) => {
        const title = node.frontmatter.title || node.fields.slug
        const tags = node.frontmatter.tags || []
        return (
          <article
            key={node.fields.slug}
            className="mb-6 rounded shadow-md pt-3 pb-4 px-5 border-gray-100 hover:bg-gray-100"
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
                return <TagPill key={tag} tag={tag} />
              })}
            </section>
          </article>
        )
      })}
      <hr className="my-6" />
      <section>
        <ul className="flex justify-between flex-wrap">
          <li></li>
          <li>
            <Link
              to="/blog/2"
              rel="next"
              className="font-bold py-2 pl-5 pr-3 border-accent-5 border block hover:bg-accent-3 hover:text-white hover:border-accent-3"
            >
              Older Posts →
            </Link>
          </li>
        </ul>
        <p>
          Or browse{" "}
          <Link className="font-semibold hover:text-accent-4" to="/blog/tags">
            posts by tag
          </Link>
          .
        </p>
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
