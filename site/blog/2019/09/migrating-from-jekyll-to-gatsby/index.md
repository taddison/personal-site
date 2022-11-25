---
title: Migrating from Jekyll to Gatsby
date: "2019-09-30T00:00:00.0Z"
shareimage: "./after-gatsby-image.png"
description: "After some tinkering with GatsbyJS, I was pretty excited about moving my blog over from Jekyll - great performance, SEO and accessibility out of the box were one reason, and the fact I know far more React/JS than Ruby was another.  This post covers my experiences, as well as a few shortcuts that helped make the transition relatively painless."
tags: ["GatsbyJS", "Netlify", "Blog"]
# cSpell:ignore Haack Contentful opengraph Disqus Staticman Rascia
---

After some tinkering with GatsbyJS, I was pretty excited about moving my blog over from Jekyll - great performance, SEO and accessibility out of the box were one reason, and the fact I know far more React/JS than Ruby was another. This post covers my experiences, as well as a few shortcuts that helped make the transition relatively painless.

## A little history

When I first started the blog I was fairly committed to getting up and running as fast as possible - spend time writing content, not endlessly tinkering with a site bereft of any content. In some previous attempts to start blogging, I'd get derailed when I started to _write my own blog engine_. As you can imagine those efforts didn't amount to a great deal.

Although I was aiming for low-friction I did still impose a few constraints:

- I should own my content (eliminated blogging on some platforms)
- The content to be trivially portable (eliminated Wordpress, etc.)
- Content should be easy to write anywhere (this led me to markdown)
- Low/zero initial and ongoing cost
- A template I could live with (desktop + mobile)
- No ads
- Fast

[Jekyll] on GitHub pages was what I settled for, largely influenced by [this post from Phil Haack][dr jekyll and mr haack].

Fast forward to today and I've been pretty happy with the authoring process. There are a few rough edges, though I blame most of them on my lack of experience with Ruby (rounds down to zero).

## The new stack

After building a few other projects with [GatsbyJS] + [Netlify] I realized that my current blog workflow needed update. When I ran my blog through [Lighthouse] I realized that I'd been neglecting visitor experience because I was happy with my authoring experience.

### Performance

Moving the blog posts to the Gatsby pipeline had a significant impact on all the [Lighthouse] metrics (higher is better):

| Test           | Old | New  |
| -------------- | --- | ---- |
| Performance    | 87% | 100% |
| Accessibility  | 74% | 97%  |
| Best Practices | 79% | 100% |
| SEO            | 82% | 98%  |

These scores don't capture the significant impact that Gatsby's image toolchain can have. In keeping with the 'low friction' approach to authoring I had been...a bit lazy with my images, and rarely bothered to compress them or optimize them for the web. Since moving to Gatsby that all comes for free in addition to a bunch of other optimizations - see [gatsby-remark-images] for more details.

To demonstrate the impact this had, take a look at the impact of running images through the Gatsby pipeline had for the [about page](/about) (lower is better):

| Metric                    | Without | With |
| ------------------------- | ------- | ---- |
| First Contentful Paint    | 1.1s    | 0.8s |
| Time to Interactive       | 1.8s    | 1.6s |
| Max Potential Input Delay | 640ms   | 70ms |

It's easy to forget that not everyone is browsing on a 4G connection from a desktop device. Speed matters, and having that baked in for free was great.

### Development

One of the most compelling reasons to migrate was moving to a language/stack I was comfortable coding in. Gatsby sits on top of React/JavaScript - I'm no expert there but I'm infinitely more qualified in JavaScript than Ruby. There was a bit of a learning curve with GraphQL (which I'd never used before Gatsby), though the documentation of both [GraphQL] and Gatsby are excellent, and if you do make the switch I'd encourage you to read and digest them.

Having a little more experience with frontend development I was comfortable dropping the requirement for an 'out of the box template' that I'd be happy with, and I started with nothing more than `gatsby new` and built from there. I've been very impressed with [Tailwind CSS] and enjoyed building a template from the ground up and _finishing it_ (take that 2013-era Tim!).

Developing with Gatsby is extremely smooth, and I love the fact I can trivially preview a production version of my site locally - I'll confess with Jekyll and GitHub pages I may have 'committed until it works'. Again - I'm sure some of this is down to my ineptitude with Ruby, though I will say the Gatsby experience is very straightforward - `gatsby build && gatsby serve`.

### Hosting

I've never had any issues with GitHub pages hosting, though now I've seen [Netlify] I don't know if I could go back! A couple of fantastic features:

- Generous free tier (including custom domain + SSL)
- [Deploy previews] (open a pull request and Netlify will build a preview for it)
- One-click setup (I connected to GitHub and Netlify figured out the rest)
- Server-side [redirects][netlify redirects] (I moved my blog to `/blog/` so this was important for me)

If I'm feeling brave I can still push directly to master and know my site will get built and published, so this ticks the low-friction box.

## Migrating from Jekyll to GatsbyJS

### Building the new site

You can (and I did test) go straight to [gatsby-starter-blog]. There are a bunch of starters available for a blog (Gatsby's strong ecosystem is another reason I moved to it), though I ended up doing quite a bit of customization. The main changes from the template were:

- Add [Tailwind CSS] and [Purge CSS]
- Style the blog posts with Tailwind utility classes
- Add opengraph share images to each post
- Add pagination
- Add an archive page
- Add a tag page
- Add a responsive menu

You can see the source (as well as the painful journey of trial and error in the commit history!) [on GitHub][blog source].

The following posts were incredibly helpful in getting up and running:

- [Using Tailwind with Gatsby]
- [Install Gatsby with Tailwind CSS and Purge CSS from scratch]
- [Add responsive navigation menu to Gatsby Tailwind CSS site]
- [Gatsby Pagination]
- [Using Gatsby Image]
- [Styling markdown posts with Tailwind CSS in GatsbyJS]

### Migrating blog posts

The migration was fairly straightforward, and the bulk of the work was moving posts and assets around.

For some reason (lost to me now - I'm sure it felt like a good idea at the time) I had my posts and assets organized like this:

```bash
# Post
/_posts/2019/03/19/post-title.md

# Post images
/assets/2019/2019-03-19/picture1.png
/assets/2019/2019-03-19/picture2.png
```

That has always been a minor source of friction in my workflow (why weren't they together!), and the Gatsby way would look more like the following:

```bash
# Post
/content/blog/2019/03/post-title/index.md

# Post images
/content/blog/2019/03/post-title/picture1.png
/content/blog/2019/03/post-title/picture2.png
```

I'm sure it would be possible to maintain the current folder structure and stitch the data together in code, though I wanted to move a post and all associated assets around by copying a folder if needed, so I used the following PowerShell to bulk-move everything. Note that I created a new repository, rather than attempting to migrate in-place.

I migrated a few posts 'by hand' before running a script, which is what `$maxMigrated` does.

```powershell
$sourceLocation = "C:\src\tjaddison.com"
$targetRoot = "C:\src\blog\content\blog"
$posts = Get-ChildItem -Path "$sourceLocation\_posts" -Recurse -File
$maxMigrated = "2019-06-30"

foreach($post in $posts) {
    $date = $post.Name.Substring(0,10)
    if($date -ge $maxMigrated) {
        continue
    }
    $year = $date.Substring(0,4)
    $month = $date.Substring(5,2)

    $targetContainer = "$targetRoot\$year\$month"
    $name = $post.Name.Substring(11, $post.Name.Length - 14).ToLower() # remove .md
    $blogFolder = "$targetContainer\$name"

    # Move the blog post
    New-Item -ItemType Directory -Path $blogFolder
    Move-Item -Path $post.FullName -Destination "$blogFolder\index.md"

    # Find any assets (images, source code, etc.)
    $imagePath = "$sourceLocation\assets\$year\$date"
    if(Test-Path $imagePath) {
        Get-ChildItem -Path $imagePath -Recurse -Force | Copy-Item -Destination $blogFolder
    }
}
```

Because the images had been moved the references in the markdown posts needed to be updated - in hindsight it is a much saner system to have the images co-located and all references relative. I used the following regex in VSCode to bulk-replace all image references, as well as the shareimage frontmatter.

```bash
# Images
(\(/assets.*/(.*)\))
(./$2)

# shareimage
(shareimage: http.*/)(.*)
shareimage: "./$2"
```

## What's next?

One outstanding feature I've not yet solved is comments. A few times over the years I toyed with adding [Disqus] but the level of stuff it injects into the site (ads, trackers, etc.) is frankly obnoxious. I did use [Staticman] for a while but found that the spam protection just wasn't strong enough and I experienced a few issues around availability. Tania Rascia has a great post to [get a system up and running with Node.js/Express/PostgreSQL][add comments to a static site] - this is a little beyond my target complexity, so I'm already toying the idea of rolling my own system atop [Cloud Firestore] or [Netlify Forms].

I'm still chasing down a few areas where the site is not as accessible as I'd like, and I've got some ideas on what an improved home page might look like...but mostly I'm pretty happy with how it looks and excited to focus on writing post again rather than migrating them.

Let me know if you have any comments or suggestions (by email for now, there is no comment system!)

[purge css]: https://github.com/taddison/personal-site
[blog source]: https://github.com/taddison/personal-site
[gatsby-starter-blog]: https://github.com/gatsbyjs/gatsby-starter-blog
[custom open graph images]: https://juliangaramendy.dev/custom-open-graph-images-in-gatsby-blog/
[netlify redirects]: https://www.netlify.com/docs/redirects/
[deploy previews]: https://www.netlify.com/docs/continuous-deployment/
[tailwind css]: https://tailwindcss.com/
[graphql]: https://graphql.org/
[gatsby-remark-images]: https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-remark-images
[gatsbyjs]: https://www.gatsbyjs.org/
[netlify]: https://www.netlify.com/
[lighthouse]: https://developers.google.com/web/tools/lighthouse/
[jekyll]: https://jekyllrb.com/
[github pages]: https://pages.github.com/
[dr jekyll and mr haack]: https://haacked.com/archive/2013/12/02/dr-jekyll-and-mr-haack/
[using tailwind with gatsby]: https://www.jerriepelser.com/blog/using-tailwind-with-gatsby/
[install gatsby with tailwind css and purge css from scratch]: https://ericbusch.net/install-gatsby-with-tailwind-css-and-purgecss-from-scratch
[add responsive navigation menu to gatsby tailwind css site]: https://ericbusch.net/add-responsive-navigation-menu-to-gatsby-tailwind-css-site
[gatsby pagination]: https://nickymeuleman.netlify.com/blog/gatsby-pagination
[using gatsby image]: https://codebushi.com/using-gatsby-image/
[styling markdown posts with tailwind css in gatsbyjs]: /blog/2019/08/styling-markdown-tailwind-gatsby/
[disqus]: https://disqus.com/
[staticman]: https://staticman.net/
[add comments to a static site]: https://www.taniarascia.com/add-comments-to-static-site/
[cloud firestore]: https://firebase.google.com/docs/firestore/
[netlify forms]: https://www.netlify.com/docs/form-handling/
