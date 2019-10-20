import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"

import Layout from "../../components/layout"
import SEO from "../../components/seo"

const PostArchive = () => {
  const { postsByDate } = useStaticQuery(
    graphql`
      query {
        postsByDate: allMarkdownRemark(
          sort: { fields: frontmatter___date, order: DESC }
        ) {
          posts: nodes {
            frontmatter {
              year: date(formatString: "YYYY")
              date: date(formatString: "DD MMMM YYYY")
              title
            }
            fields {
              slug
            }
            id
          }
        }
      }
    `
  )

  const yearGroup = postsByDate.posts.reduce((acc, post) => {
    // New array or post is for a new year? Push into the array
    if (!acc.length || acc[acc.length - 1].year !== post.frontmatter.year) {
      acc.push({ year: post.frontmatter.year, posts: [post] })
    } else {
      acc[acc.length - 1].posts.push(post)
    }
    return acc
  }, [])

  return (
    <Layout>
      <SEO title="Post Archive" />
      <h2 className="text-3xl font-bold mb-6 text-center">Post Archive</h2>
      {yearGroup.map(year => (
        <div key={year.year} className="mb-8">
          <h3 className="font-semibold text-2xl mb-4">{year.year}</h3>
          <div>
            {year.posts.map(post => (
              <div key={post.id} className="mb-1">
                <Link
                  to={post.fields.slug}
                  className="hover:text-accent-3 hover:underline"
                >
                  {post.frontmatter.title}
                  {` `}
                </Link>
                <span className="text-gray-500 text-sm">
                  {post.frontmatter.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </Layout>
  )
}

export default PostArchive
