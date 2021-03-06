---
title: Interesting Links - December 2019
tags: ["Links"]
date: "2019-12-01T00:00:00.0Z"
# cSpell:ignore Damageboy's Alyzer Taiji
---

- This whole paper is galaxy-brain - from the fact that Facebook built a load balancer that leveraged users connectedness to the graph that shows 500 million database queries per second. Full of interesting ideas, and mind-boggling numbers - [Taiji: Managing Global User Traffic for Large-Scale Internet Services at the Edge] is an excellent read.
- The state of [distributed tracing in .NET Core 3.0] is looking pretty good, and the move to support the [W3C Trace Context spec] and [OpenTelemetry] SDKs makes it easier than ever to instrument a distributed app.
- Dating from last May, the paper on [Accelerated Networking in Azure] is interesting both as a reminder of how hard the hosting providers are working to squeeze every last drop of performance out of their compute, and as another example of how reducing team handoffs (in this case hardware to software) leads for better delivery
- GatsbyJS now has support for hot schema rebuilds - I've been caught out by not restarting `gatsby develop` when updating the schema, so this is a welcome addition. No announcement post yet, but you can see the detail in [this pull request][gatsby pull request for schema rebuild].
- I love Netlify - never has a platform done exactly as it's promised quite so easily. Turns out there is a whole lot more to Netlify than just hosting though, and the [complete intro to Netlify] has an excellent set of notes that enumerate the rather impressive set of features.
- Now I understand [what npx does]!
- If you're interested in online experimentation then [the morning paper's coverage of the PlanAlyzer paper][planalyzer paper] is a great place to start, and I found myself following every link. The [PlanOut] documentation is fantastic, as is the paper that introduces PlanOut:
  - [Designing and deploying online field experiments]
- Another Microcode update that's coming along to indiscriminately cause performance issues. To put this most recent change into context, an excellent paper that covers how syscalls have only gotten worse over time (and you'll note a few significant regressions associated with the Spectre update):
  - [An analysis of performance evolution of linux's core operations]
  - [Damageboy's thread]
- Choose boring technology is an evergreen idea, and it's nice to get the occasional story of how choosing not-boring code ended up being a (wait for it) bad idea, and the boring code won out in the end:
  - [Choose boring technology talk]
  - [Dan McKinley's thread on the python middle-tier at Etsy]

[taiji: managing global user traffic for large-scale internet services at the edge]: https://research.fb.com/publications/taiji-managing-global-user-traffic-for-large-scale-internet-services-at-the-edge/
[distributed tracing in .net core 3.0]: https://devblogs.microsoft.com/aspnet/improvements-in-net-core-3-0-for-troubleshooting-and-monitoring-distributed-apps/
[w3c trace context spec]: https://www.w3.org/TR/trace-context/
[opentelemetry]: https://opentelemetry.io/
[accelerated networking in azure]: https://blog.acolyer.org/2018/05/01/azure-accelerated-networking-smartnics-in-the-public-cloud/
[planout]: http://facebook.github.io/planout/
[planalyzer paper]: https://blog.acolyer.org/2019/11/22/planalyzer/
[designing and deploying online field experiments]: https://arxiv.org/pdf/1409.3174v1.pdf
[what npx does]: https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b
[complete intro to netlify]: https://www.netlify.com/blog/2019/10/07/complete-intro-to-netlify-in-3.5-hours/
[an analysis of performance evolution of linux's core operations]: https://blog.acolyer.org/2019/11/04/an-analysis-of-performance-evolution-of-linuxs-core-operations/
[damageboy's thread]: https://twitter.com/damageboy/status/1194751035136450560
[choose boring technology talk]: http://boringtechnology.club/
[dan mckinley's thread on the python middle-tier at etsy]: https://twitter.com/mcfunley/status/1194713711337852928
[gatsby pull request for schema rebuild]: https://github.com/gatsbyjs/gatsby/pull/19092
