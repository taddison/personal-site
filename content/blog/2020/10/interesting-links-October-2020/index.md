---
title: Interesting Links - October 2020
tags: ["Links"]
date: "2020-10-31T00:00:00.0Z"
---

- [Keavy McMinn] shares some great examples of [what senior technical leadership can look like] (all engineering career ladders should not lead to management!).
- In addition to being a pretty terrifying read from a security perspective, this fascinating journey through the process of [discovering a vulnerability in TeamViewer] offers a glimpse at a pretty exciting red-team engagement.
- [7 helpful design tips] that should be useful even if you profess to have no design talent (_raises hand_)
- Ever wondered why Mozilla shows up in so many user agents (even when you're not using Firefox?) - the [history of the browser user-agent string] will clue you in.
- If you enjoyed [basecs], you'll probably enjoy it's distributed systems cousin [baseds].
- An incredible [introduction to networking for programmers] from routing down to the physical (analog!) layer
- Unlike in RPGs, in reality the [side quests] are pretty key to advancing the 'main story' (getting stuff done)
- [Rick Branson] argues that you [you shouldn't count production incidents] if you want to improve quality.
- When someone tells you they're not biased, perhaps you could suggest this thorough article that reminds us [we still have a lot of work to do to remove gender bias in tech].
- And once you get past that lack of bias, maybe help correct them on their meritocratic ways (hint: [meritocracy is a fallacy]).
- [Corp.com is up for sale], and that's a bit of a problem if you Active Directory domain is configured in a certain way (a certain set of defaults proposed by Microsoft in the past!).
- In addition to being an (extremely) fast JavaScript bundler, [esbuild] has a fantastic set of [architecture docs][esbuild architecture] that (in a relatively short document) gave me a clear picture of how a bundler works.
- [Maggie Appleton's site] is a growing collection of [illustrated essays] as well as a [digital garden] that serve as both great introductions, works of art, and a collection of metaphors that might help concepts (from React hooks to databases) stick.
- If you've ever had mixed feelings about Object/Relational-Mapping then you'll probably enjoy the essay [Vietnam of computer science]. Just don't expect a clear resolution at the end.
- Trying to understand [how accelerated database recovery works] is made far easier with this article from Forrest McDaniel. The animated illustrations bring the procedure to life in a way no amount of testing (or re-reading the whitepaper) could.
- And finally, four great whitepapers covered by the [the morning paper]:
  - [Meaningful Availability] introduces _windowed user-uptime_ as a better way of measuring service availability in some cases
  - [Extending relational query processing with ML inference] is all embedding ML in a database engine. Using SQL Server cores to run ML sounds pretty expensive, but if it can be fast enough to offset the need to ship the data around, maybe moving the model to the data is the way to go.
  - When you might be rolling out 600 different relases a day, how do you spot the bad ones? [Gandalf] is Azure's answer, and it does a pretty impressive job.

[keavy mcminn]: https://keavy.com
[what senior technical leadership can look like]: https://keavy.com/work/thriving-on-the-technical-leadership-path/
[discovering a vulnerability in teamviewer]: https://whynotsecurity.com/blog/teamviewer/
[7 helpful design tips]: https://medium.com/refactoring-ui/7-practical-tips-for-cheating-at-design-40c736799886
[history of the browser user-agent string]: https://webaim.org/blog/user-agent-string-history/
[basecs]: https://medium.com/basecs
[baseds]: https://medium.com/baseds
[introduction to networking for programmers]: https://www.destroyallsoftware.com/compendium/network-protocols?share_key=97d3ba4c24d21147
[side quests]: https://noidea.dog/blog/surviving-the-organisational-side-quest
[rick branson]: https://medium.com/@rbranson
[you shouldn't count production incidents]: https://medium.com/@rbranson/why-you-shouldnt-count-production-incidents-38616d8e6329
[we still have a lot of work to do to remove gender bias in tech]: https://medium.com/tech-diversity-files/if-you-think-women-in-tech-is-just-a-pipeline-problem-you-haven-t-been-paying-attention-cb7a2073b996
[meritocracy is a fallacy]: https://medium.com/@cathy_67575/the-fallacy-of-meritocracy-d8260f5f0611
[corp.com is up for sale]: https://krebsonsecurity.com/2020/02/dangerous-domain-corp-com-goes-up-for-sale/
[esbuild]: https://esbuild.github.io/
[esbuild architecture]: https://github.com/evanw/esbuild/blob/master/docs/architecture.md
[maggie appleton's site]: https://maggieappleton.com/
[illustrated essays]: https://maggieappleton.com/essays
[digital garden]: https://maggieappleton.com/garden
[vietnam of computer science]: http://blogs.tedneward.com/post/the-vietnam-of-computer-science/
[how accelerated database recovery works]: https://www.red-gate.com/simple-talk/sql/database-administration/how-does-accelerated-database-recovery-work/
[the morning paper]: https://blog.acolyer.org/
[meaningful availability]: https://blog.acolyer.org/2020/02/26/meaningful-availability/
[extending relational query processing with ml inference]: https://blog.acolyer.org/2020/02/21/extending-relational-query-processing/
[gandalf]: https://blog.acolyer.org/2020/02/28/microsoft-gandalf/
