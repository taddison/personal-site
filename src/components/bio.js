/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
        childImageSharp {
          fixed(width: 50, height: 50) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      site {
        siteMetadata {
          author
          social {
            twitter
            github
            linkedin
          }
        }
      }
    }
  `)

  const { author, social } = data.site.siteMetadata
  return (
    <div className="flex mb-2">
      <Image
        fixed={data.avatar.childImageSharp.fixed}
        alt={author}
        className="mr-2 w-50 rounded-full"
      />
      <p>
        Written by <strong>{author}</strong>. Find the code on{" "}
        <a href={"https://www.github.com/" + social.github}>GitHub</a>, tweets
        on <a href={"https://www.twitter.com/" + social.twitter}>Twitter</a>.
        Work stuff on{" "}
        <a href={"https://www.linkedin.com/in/" + social.linkedin}>LinkedIn</a>.
      </p>
    </div>
  )
}

export default Bio
