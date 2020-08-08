const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  await createBlogPages(graphql, createPage)
  await createLinksPages(graphql, createPage)
}

const createBlogPages = async (graphql, createPage) => {
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
              frontmatter {
                title
              }
              fields {
                slug
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

  // Create blog posts pages
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
}

const createLinksPages = async (graphql, createPage) => {
  const linksPost = path.resolve(`./src/templates/links-post.js`)
  const linksResults = await graphql(
    `
      {
        allMarkdownRemark(
          filter: { fields: { sourceName: { eq: "links" } } }
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
              }
            }
          }
        }
      }
    `
  )

  if (linksResults.errors) {
    throw linksResults.errors
  }

  // Create links posts pages
  const posts = linksResults.data.allMarkdownRemark.edges

  posts.forEach((post, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1].node
    const next = index === 0 ? null : posts[index - 1].node

    createPage({
      path: post.node.fields.slug,
      component: linksPost,
      context: {
        slug: post.node.fields.slug,
        previous,
        next,
      },
    })
  })

  // Create links post list pages
  const POSTS_PER_PAGE = 10
  const numberOfPages = Math.ceil(posts.length / POSTS_PER_PAGE)

  Array.from({ length: numberOfPages }).forEach((_, i) => {
    createPage({
      path: i === 0 ? `/links/` : `/links/${i + 1}`,
      component: path.resolve(`./src/templates/links-post-list.js`),
      context: {
        skip: i * POSTS_PER_PAGE,
        numberOfPages,
        currentPage: i + 1,
      },
    })
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  // Add the slug (e.g. /blog/2019/04/title/)
  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value: `/${node.fields.sourceName}` + value,
    })
  }
}
