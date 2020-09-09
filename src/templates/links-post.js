import React from "react"
import { graphql } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx"

import Layout from "../components/layout"
import SEO from "../components/seo"

import LinkButton from "../components/link-button"

const LinksPostTemplate = (props) => {
  const post = props.data.mdx
  const { previous, next } = props.pageContext
  const title = `Links for ${post.frontmatter.date}`

  return (
    <Layout>
      <SEO
        title={title}
        description={`A collection of links for ${post.frontmatter.date}`}
      />
      <h1 className="text-2xl md:text-4xl font-bold mb-1 md:mb-4">{title}</h1>
      <div className="prose prose-lg max-w-none e-content">
        <MDXRenderer>{post.body}</MDXRenderer>
      </div>
      <hr className="my-4 w-2/3 mx-auto sm:w-full sm:my-6" />

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

export default LinksPostTemplate

export const pageQuery = graphql`
  query LinksPostBySlug($slug: String!) {
    mdx(fields: { slug: { eq: $slug } }) {
      body
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
      }
    }
  }
`
