---
title: Interesting Links - February 2020
tags: ["Links"]
date: "2020-02-07T00:00:00.0Z"
# cSpell:ignore Criteo's Weinert leetcode Calçado
---

- A [tweet on Criteo's migration to .Net core][criteo netcore tweet] which has a bunch of interesting comments in the thread. The migration is doing good things for Criteo's web app that currently runs on 5,000 32-logical-core hosts, peaks at 6 million requests per second, and has an median latency of 10ms (-10% in core!).
- The [JavaScript Pipeline Operator (|>) proposal][javascript pipeline operator] makes for interesting reading - the competing proposals are in-depth and worth reading. Also great to see some examples of before/after - I prefer proposal 1, but would also be happy if 4 makes it.
- There are times in interactions with the Azure (notably the billing department) that I can't help but recall this [(AWS variant) image][making jeff rich].
- The Morning Paper with an excellent summary of the [Stella Paper][stella paper summary], which seeks to understand how operators handle and avert catastrophe in the face of operating complex systems. On the back of the summary I read the whole paper, and (maybe because I'm familiar with the complexities of operating an ecommerce app?) I'd recommend the summary over the paper.
- I've previously spent time talking vaguely about why beyond a certain point focusing on force-multiplier/leveraged work is key, [this excellent write-up][work is work] says it far better than I could. If you've even a passing interest in organizational design this is highly recommended reading.
- One way to generate a tonne of leverage across an engineering organization is to align multiple groups on a single Technical Strategy. Implementing that may require generating an [Architecture Strategy]. Once built the strategy is useless if it isn't shared, which is why I recommend reading the companion post that covers [how to create and share architecture initiatives][architecture initiatives].
- We've now been using RFCs in engineering for about a year, and as such have taken some time out to reflect on if the process is delivering the value needed. One thing we recently changed was an explicit readme (answering FAQs that we could have anticipated early on). Re-reading [this post from Phil Calçado][structured rfc process] I can confirm this is extremely helpful advice if you're considering an RFC process.
- Expectation vs. Reality - Algorithms in the interview vs. Algorithms on the job. Dan Luu [telling it like it is][algorithm interviews], though it doesn't change the fact that most hiring loops are still expecting you to farm [leetcode].
- A lot to agree with in this post that argues [the only code worth a damn is the code running production][production oriented development]. The only point I'd hedge on would be the Buy vs. Build point - where I'm actually closer to _Buy & Integrate_ vs. _Build & Operate_ (even that breaks down once you stop squinting). I'm not sure yet if this is my optimization function being different, location along product-market fit curve, team culture, something else? Anyway - a thought-provoking article!
- When thinking about team's, do you first stop to ask question 0 - [Is this really a team?][is this really a team]
- Whatever side of a 1 on 1 you're sitting on, it's always helpful to see how others [approach their 1 on 1s][marco on 1on1s].
- Zero Trust is dangerously close to becoming a marketer's term first & foremost (maybe it's already too late?). Alex Weinert has a [great overview (and a linked talk)][zero trust and identity] that spells out what Zero Trust might look like, and if you're a Microsoft shop there are some explicit next-step videos you can consume (this is Zero Trust, not Zero Marketing). The original [Beyond Corp] resources from Google are worth reading if you want more.
- I'm enjoying [Designing Data Intensive Applications] - the easiest way to know if this is for you is to check out this [summary post][designing data intensive applications summary], and if you're curious you'll almost certainly enjoy the book. The [footnotes on GitHub][designing data intensive applications references] are also worth browsing.
- Will Larson's post on [the first 90 days as VPE/CTO][first 90 days] is worth reading for the same reason I encourage everyone to read books like [The Manager's Path] - you'll do whatever it is you do far better when you understand the demands of your role, your peer's roles, and your manager's role. And if you're a budding VPE/CTO, there aren't many articles out there written for you.
- Also from Will Larson, [Engineering Brand] explores the challenges of building your company's engineering brand.
- Although dated from late 2018, this post on [the history of React-Redux][history of react-redux] is both interesting, educational, and answers a lot of questions I had about 'why are things this way' when working with Redux.
- Finally, a pretty dark framing of the future of the internet, is [Internet of Beefs], a piece that argues that the current (and future?) state of the internet is a disinformation warzone (that's my paraphrasing, and doesn't do the article justice). I couldn't help but be reminded of the internet as imagined in [Neal Stephenson's Dodge][fall; or, dodge in hell: a novel]. Maybe we're already there?

[criteo netcore tweet]: https://twitter.com/KooKiz/status/1221819208352354305
[javascript pipeline operator]: https://github.com/tc39/proposal-pipeline-operator/wiki
[making jeff rich]: https://www.reddit.com/r/ProgrammerHumor/comments/etkmxb/cloud_is_a_costly_rental_of_someone_elses_computer/
[stella paper summary]: https://blog.acolyer.org/2020/01/20/stella-coping-with-complexity-2/
[work is work]: https://codahale.com/work-is-work/
[architecture strategy]: https://blog.thepete.net/blog/2019/12/09/delivering-on-an-architecture-strategy/
[architecture initiatives]: https://blog.thepete.net/blog/2020/01/09/creating-and-sharing-strategic-architectural-initiatives/
[structured rfc process]: https://philcalcado.com/2018/11/19/a_structured_rfc_process.html
[algorithm interviews]: https://danluu.com/algorithms-interviews/
[leetcode]: https://leetcode.com/
[production oriented development]: https://medium.com/@paulosman/production-oriented-development-8ae05f8cc7ea
[is this really a team]: http://www.lindbohm.se/2018/is-this-really-a-team
[marco on 1on1s]: https://marcorogers.com/blog/my-approach-to-1-on-1s
[beyond corp]: https://cloud.google.com/beyondcorp/
[zero trust and identity]: https://techcommunity.microsoft.com/t5/azure-active-directory-identity/zero-hype/ba-p/1061413
[designing data intensive applications summary]: https://henrikwarne.com/2019/07/27/book-review-designing-data-intensive-applications/
[designing data intensive applications references]: https://github.com/ept/ddia-references
[first 90 days]: https://lethain.com/first-ninety-days-cto-vpe/
[engineering brand]: https://lethain.com/eng-brand/
[history of react-redux]: https://blog.isquaredsoftware.com/2018/11/react-redux-history-implementation/
[internet of beefs]: https://www.ribbonfarm.com/2020/01/16/the-internet-of-beefs/
[//]: # "Books"
[designing data intensive applications]: https://www.amazon.com/dp/B06XPJML5D
[the manager's path]: https://www.amazon.com/dp/B06XP3GJ7F/
[fall; or, dodge in hell: a novel]: https://www.amazon.com/dp/B071X3ZWDN/
