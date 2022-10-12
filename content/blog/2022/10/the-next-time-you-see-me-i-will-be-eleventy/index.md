---
date: "2022-10-13T00:00:00.0Z"
title: The next time you see me I will be Eleventy
shareimage: "./complexity-large.png"
header-image:
  - source: "./complexity-large.png"
  - alt: Someone standing in a room covered with computers, screens, cables, and gadgets
  - title: How I feel when I need to do anything non-trivial with my Gatsby blog
tags: [Gatsby, Blog, Eleventy]
# cSpell:words
# cSpell:ignore
---

After slowly completing a series of explorations into how I can migrate from [Gatsby] to [Eleventy], I've decided to draw a line in the sand and say this will be my last post until it's done.

The rest of this post will cover why I decided to switch away from Gatsby, what I'm hoping to achieve with Eleventy, and thoughts on why I've struggled to make the switch.

## History

This blog was originally built with [Jekyll]. At the time I knew nothing about Ruby or [Liquid templates] (largely unchanged today), and I made little effort to learn about the ecosystem. I was mostly happy with Hugo, though did have a pretty rough time when I tried to get my feet wet with Ruby - I like to think it was because running Ruby on Windows was a pain at the time, but more honestly I wasn't invested in learning that language.

A few years later I was writing React recreationally and came across Gatsby. Their zero-touch image optimisation spoke to a problem I'd started noticing with my site (where I did nothing to optimise images). That, plus the ability to work with a Static Site Generator (SSG) in a language I was comfortable with (JavaScript) convinced me to trial a migration, and I remember it being relatively painless to see demonstrable performance gains for my site. I migrated.

> I wrote about my motivations to move in the post [migrating from Jekyll to Gatsby], which includes criteria I applied when selecting Gatsby.

I was happy with this setup for a while, though did find the hit & miss plugin quality and GraphQL _everywhere_ (even places it had no business being) were detractors from the experience.

## Build Timeouts and Upgrades

At some point in late 2020 my [Netlify] builds started to time out (getting up to twenty minutes on the free tier before being terminated). Image processing accounted for ninety percent of this, which was surprising given the site had around a hundred images. Luckily Netlify was emitting warnings that there was a Gatsby cache plugin available that allowed assets to be shared between builds.

This experience planted the seed to start looking elsewhere, a twenty minute build time for a site as small as mine was unreasonable.

> I'm not without blame - I've done nothing to ensure the source images are well-sized and compressed, which I'm certain would cut down on build times regardless of the image processing pipeline I use.

The experience that committed me to move was attempting the Gatsby v3 to v4 major upgrade. A modest collection of Gatsby plugins caused me to hit a number of issues with breaking changes on the plugins, and one edge case that caused builds to never complete (which was later fixed, but this was an awful experience for a core plugin that handled images).

I never completed the major upgrade, and my site is currently stuck at Gatsby 3.9.1. I'm sure some issues I experienced are fixed by now, but I'm convinced the only future this ecosystem has to offer me is more pain with dependency upgrades.

## Lessons Learned and Looking Ahead

Reviewing the criteria that I used when deciding on the last migration, the only thing Gatsby failed to deliver on was _low/zero ongoing cost_. A new requirement came from a more nuanced view of what _Fast_ means to me, encouraging me to eliminate the giant bundles I was shipping with the site (a truly static site).

The other requirement should be a simple set of dependencies that are easy to extend. JavaScript is an incredibly capable language, and so many plugins and their deep tangle of dependencies are unnecessary.

> Dependencies and the software supply supply chain are something I've been spending a lot of time wondering about with a view to wondering how durable a given software or tool is going to be. I covered it briefly in [a pocket app with no dependencies].

After initially considering and rejecting Eleventy due to the requirement of learning a new template language (Liquid or [Nunjucks]), I finally came back to it after accepting a learning curve was reasonable, and in the case of Nunjucks the templating language was [popular][nunjucks vs liquid npm].

The other candidate I spent a long time considering was [NextJS]. After a few prototypes it was rejected as needlessly complicated for my needs, and categorically failed on the dependencies test.

## Not Migrating

As of early 2022 I'd decided there was no future in Gatsby, and that Eleventy was the right answer. And it is now October 2022 and I'm writing a post to assist in motivating me to _get it done_. What's caused the delay?

A big part of the delay is that life has been happening, as it is wont to do.

The other part was working on the blog became an energy drain - it used to be something I enjoyed extending and tweaking, and now every interaction with the setup makes me wish I was using literally anything else.

To combat this I tried to make forward progress with proof of concepts - things like ensuring I could get images working. These explorations produced the post [processing images linked from frontmatter with Eleventy] but didn't get the blog any closer to migrated. I'm convinced this was mostly a procrastination tactic, and I could have learned everything I needed experimenting in a branch or fork of the site.

And so that's what I'm going to do now.

This post is the swan song of the Gatsby v3 blog. The next post will be coming from the Eleventy edition.

[gatsby]: https://www.gatsbyjs.com/
[eleventy]: https://www.11ty.dev/
[jekyll]: https://jekyllrb.com/
[liquid templates]: https://shopify.github.io/liquid/
[netlify]: https://www.netlify.com/
[migrating from jekyll to gatsby]: https://tjaddison.com/blog/2019/09/migrating-from-jekyll-to-gatsby/
[a pocket app with no dependencies]: https://tjaddison.com/blog/2022/03/writing-a-simple-pocket-app-in-nodejs-with-no-dependencies/
[nunjucks]: https://mozilla.github.io/nunjucks/templating.html
[nunjucks vs liquid npm]: https://npmtrends.com/liquidjs-vs-nunjucks
[nextjs]: https://nextjs.org
[processing images linked from frontmatter with eleventy]: https://tjaddison.com/blog/2022/08/processing-images-linked-from-frontmatter-with-eleventy-img-to-use-in-meta-tags/
