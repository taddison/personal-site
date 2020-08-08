import React from "react"
import { graphql, Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

import TagPill from "../components/tag-pill"

const BlogPostTemplate = (props) => {
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
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
        {post.frontmatter.title}
      </h1>
      <p className="mb-5 italic text-gray-500">{post.frontmatter.date}</p>
      <div
        className="markdown"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
      <section>
        {tags.map((tag) => (
          <TagPill key={tag} tag={tag} />
        ))}
      </section>
      <hr className="my-4 w-2/3 mx-auto sm:w-full sm:my-6" />

      <ul className="flex">
        <li className="w-1/2">
          {next && (
            <div className="flex flex-col">
              <div className="self-start">Next Post</div>
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
        <li className="w-1/2">
          {previous && (
            <div className="flex flex-col">
              <div className="md:self-end mt-2 md:mt-0">Previous Post</div>
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
