---
date: "2021-08-31T00:00:00.0Z"
title: Interesting Links - August 2021
#shareimage: "./shareimage.png"
tags: [Links]
# cSpell:words Supabase Automerge Replicache dotfiles chezmoi Urlist Pulumi Gergely's
# cSpell:ignore hahaha
---

With the advent of tab groups I can now claim to have 'only a few tabs' open, yet have dozens (maybe more) links pile up for later review. I'm not sure that's an improvement 🤔.

Links are broadly categorised into [Frontend](#frontend), [Development](#development), [Management and leadership](#management-and-leadership), and the catch-all [Miscellaneous](#miscellaneous).

## Frontend

### Webmention Analytics

Add visibility to your site's webmention implementation with [Webmention Analytics](https://mxb.dev/blog/webmention-analytics/). In addition to being something you can fork and deploy pretty quickly, it also demonstrates how you can build on top of your webmention data. Assumes you're using webmention.io.

### TypeScript Deep Dive

If you prefer learning via reading (and the official [Typescript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) wasn't your style), I found the [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/) to be an accessible and much more practical introduction (includes topics like project setup, getting up and running with a React app). In addition to the basics, it includes real-world usage tips, a style guide, and a deep dive into the TypeScript compiler internals.

### DOM Events

[DOM Events](https://domevents.dev/) is a fantastic visual exposition of the browser's DOM event system that needs to be seen to be appreciated (click the _Dispatch_ button!). I can't think of a better way to teach/understand the model - a great UI that is both simple, informative, and yet feature-packed.

### React from scratch

This in-depth and enlightening three-part series (starting with [Climbing Mount Effect](https://acko.net/blog/climbing-mt-effect/)) lays out some of the problems React's architecture solves, and then extends that architecture with some very different solutions.

If you've never read the details on why some of React's limitations exist (one-way data flow, rules regarding hooks, effects) - this piece is well worth the effort to work through. And if you do understand those limitations, this piece shows another way of thinking about them - really helped consolidate my mental model of React.

If you're curious about building React from scratch, I'd recommend the fantastic [Build your own React](https://pomb.us/build-your-own-react/). Not only is the content great, but the presentation is fantastic.

### Javascript

Looking forward to hopefully seeing the [proposal for JSON modules](https://github.com/tc39/proposal-json-modules) make it into the standard. I've got a whole bunch of JSON being imported in various utility tools, and if it could fail-fast if it's no longer JSON (for any reason), so much the better.

```javascript
import json from "./foo.json" assert { type: "json" }
```

And now looking back, after reading [authentication in React apps](https://kentcdodds.com/blog/authentication-in-react-applications) it is hard to unsee the many times I have made the same mistakes over and over. At least next time I need to write an app I've got a solid pattern to follow, and maybe one day I'll refactor some existing code into the pattern (hahaha...).

Looking forward again, I'm already confident that Next.js + Tailwindcss are my go-to choices for building. Hosting is a little trickier. While I've been very happy with Netlify for static sites, because Next.js integrates so tightly with Vercel that's probably an upcoming change I'll make. Nothing has yet dislodged firebase/firestore as the go-to _web accessible_ data store to use...until I started reading about Supabase. And given it's actually SQL (hooray!) I'm even _more_ interested than I was before. Reading through [an end to end tutorial](https://www.freecodecamp.org/news/the-complete-guide-to-full-stack-development-with-supabas/) has convinced me this is worth exploring more.

Another missing piece of my puzzle is how to make calls to that backend - in most cases I'm using a straightforward `useFirestore` hook that has some home-rolled caching, but after reading through [practical react-query](https://tkdodo.eu/blog/practical-react-query) I'm wondering if that might not be a better fit. I started the series with [react-query as a state manager](https://tkdodo.eu/blog/react-query-as-a-state-manager) and was hooked (no pun intended!), and promptly went back to the beginning to complete the series.

## Development

### Local-first Software

Data longevity is something I've been thinking about a lot recently, especially when applied at a personal level (_can I leverage this data when I am 20, 30 years older?_). The [Local-first software](https://www.inkandswitch.com/local-first.html) article covers this as well as 6 other concerns that point towards a very different kind of software.

In addition to the principles, the [Automerge](https://github.com/automerge/automerge) library demonstrates that collaborative applications don't have to be incredibly challenging to implement (leave that to the library authors).

I also noted [Replicache](https://doc.replicache.dev/how-it-works) that provides a hosted solution in the same space.

### Data Longevity - Datasets

While thinking about data longevity I realized that I care far more about programmatic consumption of data, more than merely reading it - and so my focus is on datasets. The [US Library of Congress recommendation for datasets](https://www.loc.gov/preservation/resources/rfs/data.html) suggests:

1. Formats using well known schemas with public validation tool available
1. Line-oriented, e.g. TSV, CSV, fixed-width
1. Platform-independent open formats, e.g. .db, .db3

I've been focusing on [JSON Lines](https://jsonlines.org/) as my personal choice recently - the fact it's human readable is a huge plus, and it's also very close to the interchange format for most sites I'm building (JSON round-trips well over the web!).

However, after reading (and frankly having my mind blown) [hosting SQLite databases on GitHub pages](https://phiresky.github.io/blog/2021/hosting-sqlite-databases-on-github-pages/) I might reconsider using it instead of 'JSON databases'.

### Environment setup

One rough edge I've found with codespaces so far is environment setup - and the docs for [customizing your codespace](https://docs.github.com/en/codespaces/customizing-your-codespace/) sent me down the rabbit hole of environment configuration.

[René-Marc's dotfiles](https://github.com/renemarc/dotfiles) were my jumping-off point, and in addition to discovering [scoop](https://scoop.sh/) I also found the rather formidable [chezmoi](https://www.chezmoi.io/). A _lot_ to digest here (even the [how-to](https://www.chezmoi.io/docs/how-to/#personalizing-codespaces-for-your-account) is huge!), but it does look like the comprehensive solution that will let me work between Windows and macOS and linux.

But there's a lot of work to do to get there...

### Security beyond on-premise

While the tier model worked well for on-premise networks, it wasn't a good fit for a hybrid or cloud-native org (or basically any environment where you need to have [Zero Trust](https://docs.microsoft.com/en-us/security/zero-trust/)). If you're familiar with the tier model then the [Privileged Access Model](https://docs.microsoft.com/en-us/security/compass/privileged-access-access-model) provides a mapping from old to new.

### Azure

The discussion of [how the Urlist app is built](https://burkeholland.github.io/posts/the-urlist/) covers a lot of ground, and along the way hits Front Door, Cosmos DB, CNAME flattening, Azure Functions and more. It's eminently practical and also covers cost (which is never present on architecture diagrams), and left me with a better understanding of how some of the different tools fit together.

When deploying all of those apps to Azure, perhaps rather than inflicting [ARM templates](https://docs.microsoft.com/en-us/azure/azure-resource-manager/templates/overview) on yourself you could instead use the new [Bicep language](https://docs.microsoft.com/en-us/azure/azure-resource-manager/bicep/overview). It's an improvement, but I don't know if it's enough of an improvement over something like [Pulumi](https://www.pulumi.com/) to be worth learning.

I've still not really leveraged durable functions, but found the [new backend announcement](https://techcommunity.microsoft.com/t5/apps-on-azure/new-storage-providers-for-azure-durable-functions/ba-p/2382044) to be particularly interesting. In particular for the [SQL backend](https://microsoft.github.io/durabletask-mssql/) I was curious how they implemented the workflow schema, as I've had some painful experiences with workflow/orchestration inside of SQL Server before; one of the notes at the bottom confirmed what I had seen before:

> In many cases, the database will be the primary performance bottleneck.

But with the option to use the [Netherite provider](https://microsoft.github.io/durabletask-netherite/) there is a faster, cheaper (albeit more setup required) option. The [FASTER](https://github.com/Microsoft/FASTER) technology that is used by Netherite is..._fast_!

And finally - tying together Security and durable functions is [Cloud Katana](https://www.microsoft.com/security/blog/2021/08/19/automating-security-assessments-using-cloud-katana/). Love the work Microsoft security are doing to let people improve and iterate on security _safely_ (knowing where to start is hard, this is a fantastic onramp).

### Access control, explained

[RBAC like it was meant to be](https://tailscale.com/blog/rbac-like-it-was-meant-to-be/) is the best introduction to access control I've ever read. [Tailscale](https://tailscale.com/) is an extremely impressive product, and the documentation/blog posts are just as impressive.

## Management and Leadership

### Growing Inclusive Behaviours

One way to start is defining those behaviours, and Chelsea Troy's [Rubric for Evaluating Team Member's Contributions to an Inclusive Culture](https://chelseatroy.com/2018/05/24/why-your-efforts-to-make-your-company-inclusive-arent-working/) is still my go-to post/resource in this space. Highly recommended for everyone (not just managers).

### Up Next for organisations?

While everybody is thinking about more immediate changes related to remote work and the 'new-normal', what longer-term (think 2031) changes are already happening? [How organisations are changing](https://swardley.medium.com/how-organisations-are-changing-cf80f3e2300) covers a lot of ground (and remote vs. in-office is fairly pivotal question that is covered).

### Engineering career growth

Looking at something like Dropbox's [career framework](https://dropbox.github.io/dbx-career-framework/) you could be fooled into thinking that if you could just _define_ the ladder (Dropbox carefully don't call it a ladder, but it is) then you're half-way towards solving 'growth'. The ladder framing (level 1...N) is common, and I'm now wondering if it may be harmful when it comes to what I call terminal levels (the combination of individual/company/team means growth is not possible _or_ required).

The specific problem I have with the ladder metaphor is that nobody climbs halfway up a ladder and stops - everyone wants to get to the top/get off the ladder. This can lead to conversations with a senior engineer (who will never make staff) and the discussion can end up fixating on 'why not staff'. How can we instead focus on framing 'continued excellence as a senior engineer'?

Acknowledging the changing requirements of a role is important (if you level as senior now, invest nothing in personal development, would you still level as a senior in 5 years? 10 years?), and perhaps that is a way to frame a conversation about sustaining excellence. This isn't purely technical either - reading through [career development for engineering managers](https://leaddev.com/professional-development/career-development-engineering-managers), how many of those points were you considering 5/10+ years ago? [Gergely's tweet](https://twitter.com/GergelyOrosz/status/1427960129320804358) hits a similar note - and I'd say what makes those EM's unique is the ability to stay executing in the top N% for that role.

One thing I've found valuable in defining the senior+ roles is it allows you to identify projects/behaviours you would like to see other roles (either adjacent like EMs, or more junior for the same role) execute. The list of those is long, here are a few I've enjoyed:

- [An incomplete list of skills senior engineers need beyond coding](https://www.elidedbranches.com/2021/06/an-incomplete-list-of-skills-senior.html)
- [Driving cultural change through software choices](https://www.elidedbranches.com/2020/11/driving-cultural-change-through.html)
- [Driving a technical strategy at scale](https://leaddev.com/scaling-teams-hypergrowth/driving-technical-strategy-scale-part-1)
- [Debugging engineering velocity and leading high performance teams](https://leaddev.com/productivity-eng-velocity/debugging-engineering-velocity-and-leading-high-performing-teams)

Even if you don't want to make these activities your focus (EM/staff engineer), making participation in them part of your role/though process may be part of how you sustain excellence.

## Miscellaneous

### Orbit

Spaced repetition (think Anki) taken to the next level. What if we could get much, much more from reading, by changing the format in which we author and then consume the text? See [Tools for Transformative Thought](https://numinous.productions/ttft/) for the background, [Orbit](https://withorbit.com/) for an introduction, or jump right into the [Orbit documentation](https://docs.withorbit.com/) for implementation details. This is no less than an attempt to reimagine the humble written word as a tool for learning, and I think it's worth keeping an eye on.

### My debugging hero

I didn't think I _had_ a debugging hero, but then I read another of Bruce Dawson's posts (this time on [Arranging Invisible Icons in Quadractic time](https://randomascii.wordpress.com/2021/02/16/arranging-invisible-icons-in-quadratic-time/)) and then realised that actually, I do!

### Agency

As a (relatively) freshly minted parent I'm now starting to think about education, and reflecting back on my experiences I can say that I'd like to do better. Reading [The most precious resource is agency](https://simonsarris.substack.com/p/the-most-precious-resource-is-agency) struck a chord, mainly in that outside of the social value of school, I'm not sure how valuable our current system is compared to what it could be.
