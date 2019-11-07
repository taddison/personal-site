const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const blogPost = path.resolve(`./src/templates/blog-post.js`)
  const blogResults = await graphql(
    `
      {
        allMarkdownRemark(
          filter: { fields: { sourceName: { eq: "blog" } } }
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
              }
            }
          }
        }
      }
    `
  )

  if (blogResults.errors) {
    throw blogResults.errors
  }

  // Create blog posts pages.
  const posts = blogResults.data.allMarkdownRemark.edges

  posts.forEach((post, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1].node
    const next = index === 0 ? null : posts[index - 1].node

    createPage({
      path: post.node.fields.slug,
      component: blogPost,
      context: {
        slug: post.node.fields.slug,
        previous,
        next,
      },
    })
  })

  // Create post list pages
  const POSTS_PER_PAGE = 10
  const numberOfPages = Math.ceil(posts.length / POSTS_PER_PAGE)

  Array.from({ length: numberOfPages }).forEach((_, i) => {
    // Skip the first page
    if (i > 0) {
      createPage({
        path: i === 0 ? `/blog/` : `/blog/${i + 1}`,
        component: path.resolve(`./src/templates/blog-post-list.js`),
        context: {
          skip: i * POSTS_PER_PAGE,
          numberOfPages,
          currentPage: i + 1,
        },
      })
    }
  })

  createLinksPages(createPage)
}

// TODO: Pagination/similar
const createLinksPages = createPage => {
  createPage({
    path: `/links`,
    component: path.resolve(`./src/templates/links-list.js`),
    context: {
      skip: 0,
      numberOfPages: 1,
      currentPage: 1,
    },
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value: `/${node.fields.sourceName}` + value,
    })
  }
}
