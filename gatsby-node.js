const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)
const BundleAnalyzerPlugin = require(`webpack-bundle-analyzer`)
  .BundleAnalyzerPlugin

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  await createBlogPages(graphql, createPage)
}

const createBlogPages = async (graphql, createPage) => {
  const blogPost = path.resolve(`./src/templates/blog-post.js`)
  const blogResults = await graphql(
    `
      {
        allMdx(
          filter: { fields: { source: { eq: "blog" } } }
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
  const posts = blogResults.data.allMdx.edges

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

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  // Add the slug (e.g. /blog/2019/04/title/)
  if (node.internal.type === `Mdx`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value: `/${node.fields.source}` + value,
    })
  }
}

exports.onCreateWebpackConfig = ({ stage, actions }) => {
  const isProductionBuild = process.env.NODE_ENV === `production`
  const isJavaScriptBuildStage = stage === `build-javascript`
  const analyzerMode = process.env.INTERACTIVE_ANALYZE ? `server` : `json`

  if (isJavaScriptBuildStage && isProductionBuild) {
    actions.setWebpackConfig({
      plugins: [
        new BundleAnalyzerPlugin({
          analyzerMode,
          reportFilename: `./__build/bundlereport.json`,
        }),
      ],
    })
  }
}
