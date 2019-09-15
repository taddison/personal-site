import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"

import Layout from "../../components/layout"
import SEO from "../../components/seo"

import TagPill from "../../components/TagPill"

const TagIndex = props => {
  const { tagGroup } = useStaticQuery(
    graphql`
      query {
        tagGroup: allMarkdownRemark {
          group(field: frontmatter___tags) {
            tag: fieldValue
            totalCount
            posts: nodes {
              frontmatter {
                date(formatString: "DD MMMM YYYY")
                title
              }
              fields {
                slug
              }
              id
            }
          }
        }
      }
    `
  )

  const tagGroups = tagGroup.group

  return (
    <Layout>
      <SEO title="Post tags" />
      <h2 className="text-3xl font-bold mb-6 text-center">Posts by Tag</h2>
      <div className="mb-4 md:mb-6 lg:px-12 flex flex-wrap">
        {tagGroups.map(group => {
          return (
            <div key={group.tag}>
              <TagPill
                tag={group.tag}
                customLabel={`${group.tag} (${group.totalCount})`}
              />
            </div>
          )
        })}
      </div>
      {tagGroups.map(group => {
        return (
          <div key={group.tag} id={group.tag} className="mb-4">
            <h2 className="font-semibold text-xl">{group.tag}</h2>
            <div className="italic text-gray-500 text-sm">
              {group.totalCount} post{group.totalCount === 1 ? "" : "s"}
            </div>
            {group.posts.map(post => {
              return (
                <div key={post.id}>
                  <Link to={post.fields.slug} className="hover:text-accent-3">
                    {post.frontmatter.title}{" "}
                  </Link>
                  <span className="text-gray-500 text-sm">
                    {post.frontmatter.date}
                  </span>
                </div>
              )
            })}
          </div>
        )
      })}
    </Layout>
  )
}

export default TagIndex
