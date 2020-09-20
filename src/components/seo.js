import React from "react"
import PropTypes from "prop-types"
import Helmet from "react-helmet"
import profilePic from "../../content/assets/profile-pic.jpg"

import config from "../../site.config"

function SEO({ description, lang, meta, title, image }) {
  const { siteMetadata } = config

  const metaDescription = description || siteMetadata.description
  const openGraphImageUrl = siteMetadata.siteUrl + (image || profilePic)

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={`%s | ${siteMetadata.title}`}
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
          content: siteMetadata.author,
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
        href={`https://twitter.com/${siteMetadata.social.twitter}`}
        rel="me"
      ></link>
      <link rel="webmention" href={siteMetadata.social.webmention} />
      <link rel="pingback" href={siteMetadata.social.pingback} />
      <link rel="stylesheet" href="https://rsms.me/inter/inter.css"></link>
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
