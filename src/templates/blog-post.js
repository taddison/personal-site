import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

import TagPill from "../components/tag-pill"
import LinkButton from "../components/link-button"

const BlogPostTemplate = props => {
  const post = props.data.markdownRemark
  const { previous, next } = props.pageContext
  const tags = post.frontmatter.tags || []
  const { shareimage } = post.frontmatter
  const shareImagePath = shareimage && shareimage.childImageSharp.fixed.src

  return (
    <Layout>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
        image={shareImagePath}
      />
      <h1 className="text-2xl md:text-4xl font-bold">
        {post.frontmatter.title}
      </h1>
      <p className="mb-5 italic text-gray-500">{post.frontmatter.date}</p>
      <div
        className="markdown"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
      <section>
        {tags.map(tag => (
          <TagPill key={tag} tag={tag} />
        ))}
      </section>
      <hr className="my-6" />

      <ul className="flex justify-between flex-wrap">
        <li>
          {next && (
            <LinkButton to={next.fields.slug} rel="next" label="← Next" />
          )}
        </li>
        <li>
          {previous && (
            <LinkButton
              to={previous.fields.slug}
              rel="prev"
              label="Previous →"
            />
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
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        tags
        shareimage {
          childImageSharp {
            fixed {
              src
            }
          }
        }
      }
    }
  }
`
