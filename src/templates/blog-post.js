import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

import TagPill from "../components/TagPill"

const BlogPostTemplate = props => {
  const post = props.data.markdownRemark
  const { previous, next } = props.pageContext
  const tags = post.frontmatter.tags || []

  return (
    <Layout>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />
      <h1 className="text-4xl font-bold">{post.frontmatter.title}</h1>
      <p className="mb-2 italic text-gray-500">{post.frontmatter.date}</p>
      <div
        className="markdown"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
      <section>
        {tags.map(tag => {
          return <TagPill key={tag} link="#" tag={tag} />
        })}
      </section>
      <hr className="my-6" />

      <ul className="flex justify-between flex-wrap">
        <li>
          {previous && (
            <Link
              to={previous.fields.slug}
              rel="prev"
              className="font-bold py-2 pl-3 pr-5 border-accent-5 border block hover:bg-accent-3 hover:text-white hover:border-accent-3"
            >
              ← {previous.frontmatter.title}
            </Link>
          )}
        </li>
        <li>
          {next && (
            <Link
              to={next.fields.slug}
              rel="next"
              className="font-bold py-2 pl-5 pr-3 border-accent-5 border block hover:bg-accent-3 hover:text-white hover:border-accent-3"
            >
              {next.frontmatter.title} →
            </Link>
          )}
        </li>
      </ul>
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        tags
      }
    }
  }
`
