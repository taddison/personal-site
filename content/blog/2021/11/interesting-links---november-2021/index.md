---
date: "2021-11-30T00:00:00.0Z"
title: Interesting Links - November 2021
#shareimage: "./shareimage.png"
tags: [Links]
# cSpell:words Speedlify Gibler Lerdorf molds cishet Sivers Gwern Branwen monodraw Ryff monkeytype ohmyposh
# cSpell:ignore tldrsec kool
---

Links are broadly categorised into [Development](#development), [Management and leadership](#management-and-leadership), and the catch-all [Miscellaneous](#miscellaneous).

## Development

Capturing my frustrations on what an `npm-outdated` looks like for my Gatsby-powered blog, Ru Singh's [waving goodbye to static websites and more](https://rusingh.com/waving-thankful-goodbye-to-static-websites-and-more/) does make the 'DIY' option look like a poor choice. Every time I think about switching to Wordpress (or something else) I run through the framework I used last time I switched my blog ([back in 2019](https://tjaddison.com/blog/2019/09/migrating-from-jekyll-to-gatsby/)) and always land on static sites. For now.

One important feature for me is cost - ideally free, and [stack on a budget](https://github.com/255kb/stack-on-a-budget) is a good place to look for inspiration. Another feature is performance, and [Speedlify](https://www.zachleat.com/web/speedlify/) can let you track performance over time (though Lighthouse scores are not [without their challenges](https://www.zachleat.com/web/lighthouse-deception/)).

Another month goes by and the GitHub issues for [optimize images during next build](https://github.com/vercel/next.js/discussions/19065)...maybe inches towards being implemented? I'll probably have to ignore this and rely on the default `next/image` component, though I'm not a fan of being locked into Vercel (as a free host). When the time comes to migrate, the [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote) library is probably how I'll get the MD/MDX used (there's even a [starter template](https://github.com/vercel/next.js/tree/canary/examples/with-mdx-remote)).

Finally, if you find yourself wanting a reminder of what the relentless pursuit of pragmatism looks like, these [quotes from Rasmus Lerdorf](https://en.m.wikiquote.org/wiki/Rasmus_Lerdorf) (creator of PHP) are worth reviewing. As a taster - _"I actually hate programming, but I love solving problems."_

## Management and Leadership

Scaling security across an organization is _hard_ - Clint Gibler's presentation [How to 10X your security](https://docs.google.com/presentation/d/1lfEvXtw5RTj3JmXwSQDXy8or87_BHrFbo1ZtQQlHbq0/view#slide=id.g6555b225cd_0_1069) is an excellent starting point (and probably covers stuff that most orgs won't even get to in their end-state). Clint also maintains the excellent infosec newsletter [tldrsec.com](https://tldrsec.com/), which reduces the firehose of infosec news to a ...slightly smaller firehose?

A common criticism of most business books I read is _'that could have been a long-form article'_. Imagine my delight when I discovered [The Kool Aid Factory](https://koolaidfactory.com/), a site full of zines (in this instance: long-form articles) that cover various aspects of organizational design. In addition to having a tonne of content that will get you thinking, the site's filters allow you to focus on what matters to you (though I ended up devouring everything - no filters for me).

From articles that resisted becoming books, to a presentation that resisted becoming a book - [Coordination Headwind - How organizations are like slime molds](https://komoroske.com/slime-mold/) covers the challenge of keeping an organization nimble as it grows.

I've always felt a little uneasy with the advice that states you should _'never be the smartest person in the room'_, as it always felt like a crutch to lean on when you don't want to have a conversation about the values of a diverse team (smart sometimes being a codeword for cishet-white-male). A much better rebuttal can be found in [don't surround yourself with smarter people](https://www.ribbonfarm.com/2014/11/05/dont-surround-yourself-with-smarter-people/), which is a long but rewarding read that switches out _smart_ for _differently free_.

I don't think the dust has settled on the future of work (at least I _hope_ it hasn't, and that we're still in a phase of the pandemic that doesn't fully represent the new normal), but I do think there is a lot we can learn about the good & bad of remote from the natural experiment COVID-19 provided. The negative impact on bridging/weak/cross-team ties is what I was most interested in exploring in [The effects of remote work on collaboration among information workers](https://www.nature.com/articles/s41562-021-01196-4.pdf). I definitely felt that being fully remote 'impacted serendipity', but that is much more rigorously formulated and explored in the paper. No solutions on offer here though - I wonder if more radical organizational changes are needed to succeed with a remote org (rather than taking the existing organizational structure and simply removing everyone from the office)?

Regardless of remote or in-person, articles on [how to have an honest one on one](https://knowyourteam.com/blog/2017/12/01/how-to-have-an-honest-one-on-one-meeting-with-an-employee/), fantastic [threads on soliciting feedback as a manager](https://twitter.com/kaydacode/status/1458084282530992140) or the kitchen-sink of resources ([How to Lead People and Be a Manager](https://docs.google.com/document/d/1R1O0OEsQpZcBcLheRlomDrmR2tyEpdRNFnjbLALmbH4/view)) are well worth revisiting in what is turning out to be a very challenging few months/years/new normal.

I've also ordered the book [Become an effective software engineering manager](https://pragprog.com/titles/jsengman/become-an-effective-software-engineering-manager/), though I do wonder when I'll get round to reading it. Meanwhile, James has released a new book on effective remote work, and I've still not finished going through his back-catalogue of his [excellent posts on engineering management](https://www.theengineeringmanager.com/). An ever-expanding [anti library](https://fs.blog/the-antilibrary/) is a great problem to have.

## Miscellaneous

### People

> In addition to recently following the below, I also highly recommend their archives.

I first encountered [Derek Sivers](https://sive.rs) thanks to his [Now page](https://sive.rs/now) (mine is still a TODO), but I stuck around for the thoughtful and clear writing on a wide range of topics.

I can't remember where I first encountered [Rachel's writing](https://rachelbythebay.com/w/), but I suspect it was a link to one of the (many, excellent) war stories she has shared. I found myself nodding along an awful lot, and appreciate someone sharing the unvarnished truth on how dysfunctional work can be.

For longer, thought-provoking reads (also on a wide range of topics), the [writing of Scott Alexander](https://astralcodexten.substack.com/) never disappoints. Seeing Scott highlight and respond to some of the better comments in follow-up posts is a unique touch, and it helps to see the material discussed from different viewpoints.

Finally, something that has so far defied my attempts to track via Feedly - [Gwern Branwen's website](https://www.gwern.net). I'm not sure what to call it - digital garden, long content, evergreen blog - whatever it is, the thought process behind the site really resonated with me. In addition to deep and engaging material, the UX of the site is truly excellent (and quite necessary given all the fascinating links and references).

### Tools

For editing tables in markdown (or CSV for that matter), the [grid table editor](https://eviltester.github.io/grid-table-editor/) supports operations like adding/removing/moving columns, which is not much fun to do manually.

Another great tool I've started using recently to enhance a text (e.g. markdown) documentation is [monodraw](https://monodraw.helftone.com/).

Only after hacking together a [script](https://github.com/taddison/personal-site/blob/main/scripts/newpost.mjs) to scaffold new blog posts I discovered [plop](https://plopjs.com/), an incredibly versatile 'micro-generator framework' for node - the combination of inquirer and handlebars is pretty versatile.

I've recently started using a Mac in addition to my Windows machine, and one of the first things I installed was PowerShell core. While tweaking my shell (starting with [Oh My Posh](https://www.ohmyposh.dev/docs/)) I gave the [z PowerShell command](https://github.com/badmotorfinger/z) a try, and I can't believe I didn't try it sooner, the amount of time I spend navigating directories has dropped dramatically.

### Well-being

A notable gap in the data I collect (see [quantified self](https://quantifiedself.com/)) is mental health - will I remain 'young minded' as I age, and will I be free from any mental illness? For the former question I've looked at [Ryff Scales](https://centerofinquiry.org/wp-content/uploads/2018/04/Ryff_Scales.pdf) and some tests on [Your Morals](https://yourmorals.org/), and for the latter it seems positive mental health correlates with a decline in the incidence of mental illnesses (see the paper [Change in Level of Positive Mental Health as a Predictor of Future Risk of Mental Illness](https://ajph.aphapublications.org/doi/full/10.2105/AJPH.2010.192245)). A few open questions I have are what can be done to improve mental health, and how reliable is self-evaluations.

### Typing

Right now I'm only considering it, but moving to a [split keyboard](https://jhelvy.shinyapps.io/splitkbcompare/) and learning a [new keyboard layout](https://dreymar.colemak.org/) might help maximise my ability to type effectively over time (and maybe boost my [keys left](https://www.keysleft.com/)). In anticipation of switching, I've started to capture some basic [typing speed results](https://flatgithub.com/taddison/my-data?filename=typing%2Fresults.csv) with [monkeytype](https://monkeytype.com/).

I'd like to consume more research on the topic, so far the only paper I've completed was to confirm something I was already fairly certain of - tactile feedback matters for typing speed and accuracy ([A Study of Touch Typing Performance with Keyclick Feedback](https://engineering.purdue.edu/~hongtan/pubs/PDFfiles/C63_JRKimTan_HS2014.pdf)).
