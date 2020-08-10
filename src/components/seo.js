/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import Helmet from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"
import profilePic from "../../content/assets/profile-pic.jpg"

function SEO({ description, lang, meta, title, image }) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
            siteUrl
            social {
              twitter
              webmention
              pingback
            }
          }
        }
      }
    `
  )

  const metaDescription = description || site.siteMetadata.description
  const openGraphImageUrl = site.siteMetadata.siteUrl + (image || profilePic)

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={`%s | ${site.siteMetadata.title}`}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:creator`,
          content: site.siteMetadata.author,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
        {
          property: `og:image`,
          content: openGraphImageUrl,
        },
        {
          property: `twitter:image`,
          content: openGraphImageUrl,
        },
        {
          property: `image`,
          content: openGraphImageUrl,
        },
      ].concat(meta)}
    >
      {/* IndieLogin */}
      <link
        href={`https://twitter.com/${site.siteMetadata.social.twitter}`}
        rel="me"
      ></link>
      <link rel="webmention" href={site.siteMetadata.social.webmention} />
      <link rel="pingback" href={site.siteMetadata.social.pingback} />
    </Helmet>
  )
}

SEO.defaultProps = {
  lang: `en`,
  meta: [],
  description: ``,
}

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
}

export default SEO
