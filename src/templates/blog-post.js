import React from "react"
import { graphql, Link } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx"

import Layout from "../components/layout"
import SEO from "../components/seo"

import TagPill from "../components/tag-pill"

const BlogPostTemplate = (props) => {
  const post = props.data.mdx
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
      <article className="h-entry">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold p-name">
          {post.frontmatter.title}
        </h1>
        <p className="mb-5 italic text-gray-500">
          <time className="dt-published">{post.frontmatter.date}</time>
        </p>
        <div className="prose prose-lg max-w-none e-content">
          <MDXRenderer>{post.body}</MDXRenderer>
        </div>
        <section className="mt-4">
          {tags.map((tag) => (
            <TagPill key={tag} tag={tag} />
          ))}
        </section>
      </article>
      <hr className="my-4 w-2/3 mx-auto sm:w-full sm:my-6" />

      <ul className="flex">
        <li className="w-1/2">
          {previous && (
            <div className="flex flex-col text-left">
              <div>Previous Post</div>
              <Link
                className="block py-2 font-semibold hover:underline hover:text-accent-3"
                to={previous.fields.slug}
                rel="prev"
              >
                {previous.frontmatter.title}
              </Link>
            </div>
          )}
        </li>
        <li className="w-1/2">
          {next && (
            <div className="flex flex-col text-right">
              <div>Next Post</div>
              <Link
                className="block py-2 font-semibold hover:underline hover:text-accent-3"
                to={next.fields.slug}
                rel="next"
              >
                {next.frontmatter.title}
              </Link>
            </div>
          )}
        </li>
      </ul>
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    mdx(fields: { slug: { eq: $slug } }) {
      excerpt(pruneLength: 160)
      body
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
