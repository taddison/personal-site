---
date: "2023-04-22T00:00:00.0Z"
title: Half a year to complete the migration to Eleventy. What will I do with the rest of it?
#shareimage: "./shareimage.png"
tags: [Blog, Predictions, Gatsby, Eleventy]
# cSpell:words
# cSpell:ignore
---

After six months this blog is now running on Eleventy instead of Gatsby. In my [previous post][eleventy migration announcement post] I talked about why I wanted to make the switch. Today I'll talk briefly about how I found the migration, whether the result is what I hoped for, and make a few predictions about the future of the site.

## The upgrade process

Don't be fooled by the six month timing between posts. I'd suggest that with focus the migration could have been done in a long day or a weekend.

I'd like to say the delta between that long weekend and six months was purely down to limited time, but I know I spent a lot of time trying to understand how Eleventy worked and why certain decisions had been made.

Towards the end of the migration I stumbled on a few interesting blogs that helped me understand how people were using Eleventy in the wild - I never found the official docs to be helpful in this respect, and would suggest anyone looking to grok Eleventy starts by reading as broadly on the topic (through the eyes of others) as possible.

Coming from Gatsby - a very much 'batteries included' framework which is supported by a strong ecosystem of documentation - at times Eleventy felt like I wasn't smart enough to figure out what was clearly an obvious thing. The amount of time I wondered about what was the idiomatic way to put images in my posts left me convinced I'd missed a tutorial somewhere (I'm pretty sure I haven't). The learning curve felt needlessly high in many places, with the documentation gleefully presenting all the features but little guidance on when you might want to use or avoid them.

## The results

The build process is faster - both locally and on Netlify, with builds on a cold cache dramatically faster. The client-side bundle has been eliminated. There is no more GraphQL involved. The number of referenced development packages (and thus `npm install` performance) is greatly reduced.

Navigating between pages doesn't feel as snappy as before (Gatsby pre-fetched and performed client-side navigation), which is a tradeoff I knew I'd make in exchange for eliminating the client-side bundle. I haven't noticed any other changes, and the [core web vitals] agree.

Happy with the current status of the project and site.

I'll caveat the above by adding that I have migrated but not authored anything yet nor had to go through any upgrades. On top of that, I've set myself a 'no tinkering until the first blog post is published' rule which means that I can't even speak to the editing experience.

## Predictions for the future

Offered with probabilities I've pulled out of thin air, and something I can come back and examine in the future.

- 100% chance I'll publish at least one post on the Eleventy blog in the next month (as I write this draft, I feel supremely confident)
- 75% chance I'll complete at least two items from my 'do soon' checklist in the next three months
- 50% chance I'll complete at least four of them in the next three months
- 10% chance I'll complete all of them in the next three months
- 75% chance I'll publish at least two posts in the next six months
- 75% chance I'll do something from the 'do later' checklist in the next six months
- 50% chance I'll do a quarter of them in the next six months
- 25% chance I'll publish at least six posts in the next twelve months
- 5% chance I'll spend time searching for an alternative static site generator in the next twelve months, based on an observed limitation/friction with the setup

The 'do soon' and 'do later' checklists are in the project's readme file - here's the [current commit on GitHub][blog readme at commit of post time] if you'd like to see what's there.

[core web vitals]: https://web.dev/vitals/
[eleventy migration announcement post]: /blog/2022/10/the-next-time-you-see-me-i-will-be-eleventy/
[blog readme at commit of post time]: https://github.com/taddison/personal-site/blob/2897cc24e89d7dd646db53520bba1b51d54cd446/README.md
