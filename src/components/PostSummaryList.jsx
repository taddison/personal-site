import React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"

import TagPill from "./TagPill"

const propTypes = {
  posts: PropTypes.array.isRequired,
}

const PostSummaryList = ({ posts }) => {
  const postCount = posts.length
  return (
    <React.Fragment>
      {posts.map((post, i) => {
        const node = post.node
        const title = node.frontmatter.title || node.fields.slug
        const tags = node.frontmatter.tags || []
        return (
          <div key={node.fields.slug}>
          <article
            className="rounded p-5 border-gray-100 hover:bg-gray-100 hover:shadow-md"
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
          { i < postCount - 1 && <div className="flex flex-col items-center my-6">
            <hr className="w-1/2"/>
          </div>
        }
          </div>
        )
      })}
    </React.Fragment>
  )
}

TagPill.propTypes = propTypes

export default PostSummaryList
