import React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"

import TagPill from "./tag-pill"

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
            <article className="rounded p-0 sm:p-5 border-gray-100 hover:bg-gray-100 hover:shadow-md">
              <h3 className="font-semibold text-2xl">
                <Link
                  className="hover:underline hover:text-accent-3"
                  to={node.fields.slug}
                >
                  {title}
                </Link>
              </h3>

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
                <Link
                  className="block mt-2 hover:underline hover:text-accent-3 italic"
                  to={node.fields.slug}
                >
                  Read Post
                </Link>
              </section>
              <section>
                {tags.map((tag) => (
                  <TagPill key={tag} tag={tag} />
                ))}
              </section>
            </article>
            {i < postCount - 1 && (
              <div className="flex flex-col items-center my-6">
                <hr className="w-1/2" />
              </div>
            )}
          </div>
        )
      })}
    </React.Fragment>
  )
}

TagPill.propTypes = propTypes

export default PostSummaryList
