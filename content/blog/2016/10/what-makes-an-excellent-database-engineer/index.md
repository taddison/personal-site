---
layout: post
title: What makes an excellent database engineer?
tags: [Management]
---

The question of what makes an excellent database engineer is one I'm always asking myself and increasingly find myself answering for others.  The question typically isn't phrased quite so directly, and instead shows up in a variety of discussions:

- In 1:1s this might be part of a discussion on long-term career goals and progress against them
- During the recruiting process some of the best candidates will probe to understand how I define greatness in that role
- When working with other leads we want to try and understand why certain team members are great, and look to see what behaviours we want to encourage elsewhere
<!--more-->
While the specifics will always vary with the individual, the team, and the platform, I believe that the below fairly accurately captures what I currently think of as the key traits & beliefs an excellent database engineer should possess:

- ***Deep technical mastery of one or more areas***
- ***Broad knowledge of the platform and the ecosystem it works in***
- ***Ownership of problems & their solutions end to end***
- ***Does not tolerate badness***
- ***Treats the system as a customer***

This is largely based on the role of a database engineer who is both a developer, an administrator, and an operations guy (outside of some specialist exceptions I don't think the dedicated role of DBA really has a future - perhaps a subject for another post).  I primarily work in the Microsoft ecosystem but I believe the detail below applies for any ecosystem, and probably more generally for any software engineering role.

Each item is discussed in more detail below.
	
## Deep technical mastery of one or more areas

A whole heap of other qualities are rolled up into this goal.  The fact this goal is never actually finished (can anyone ever say they're _finished_ learning about query optimisation? How long would that statement be valid for?) means you need to be both humble in accepting you have something to learn, and curious enough to keep you digging into that area.

Each additional level of mastery means you're now able to teach that area to other people (teaching/speaking/writing about an area at level N requires level N+1 knowledge), that you're able to work in that area with reduced effort and increased confidence, and that any project which interacts with that area will benefit from your input.

Database engineering excites me so much as it exposes a huge surface area for learning - you're at the confluence of academic research, hardware & software advances, product advances, as well as the disciplines of programming, systems architecture, and system administration.  On top of all that sits the solution you'll build to solve a real problem, and knowing the foundations of what you build is going to help you deliver a better project (cost, performance, reliability).

## Broad knowledge of the platform and the ecosystem it works in

You can't solve a problem using a tool you don't even know exists.  That's a rough analogy but it holds even when you start to stretch that up to the system level.  Consider the following changes SQL 2016 has brought (or will bring soon in some cases), which eliminate problems ranging from small code changes to entire systems:

- Native string split function
- Query Store
- Always Encrypted
- Polybase
- Power BI embedded in SSRS

I've been involved in projects which have built, maintained, and ultimately deprecated various solutions which are all solved far more elegantly by something which is now part of the 'boxed' product.  It's so easy to delegate the responsibility of knowing this to architects/consultants, but the art of the possible is something each engineer needs to own for herself.

The key to brilliance when being broad isn't knowing everything that is happening (impossible) or the fine details of everything you learn (also impossible), but to have a model of the system you're trying to understand, and a method for keeping up to date or digging deeper.

Very briefly, this might mean you split your ecosystem into a few areas (perhaps by product, by problem solved, by team).  For each area you would think about how you'd keep abreast of significant happenings in those areas (that might be colleagues, conferences, blogs, etc.).  Finally you'd assign yourself some kind of depth gauge for each area - if you're spending no time keeping up to date with .Net and 100% of your data access happens in .Net, you'd want to be very careful before relying on any old assumptions.

## Ownership of problems & their solutions end to end

First and foremost we're problem solvers.  The best problem solvers I've worked with have all shared the same fundamental trait - *they own the problem*.  I'd hesitate to call the following a framework, but I've seen very similar steps executed by some of the most respected problem solvers I've seen in action:

- Understand the problem
  - Why are we solving this problem
  - What will we gain
  - How will we know if we've solved the problem
- Understand how the problem might be solved
  - Explore a few different options, even if unfeasible now (what _might_ another solution look like?)
- Understand how this particular implementation will work
  - Any weaknesses, positive-side-effects
  - What are the unknowns
- Identify all the stakeholders
  - Who needs to know before we start/as we progress/when we're done
- Own the problem until it's solved/no longer a priority

Implicit in the above (but explicit in the title of this section) is that you're not just taking ownership of the data/data-tier.  This can really manifest when exploring other options - you might not be empowered to make process or application changes, but if fixing bad data can be better solved by modifying the application or business processes that input the data you owe it to the data to at least outline that option.  I'll talk more about the data (and the system) as a customer later.

## Do not tolerate badness

Unpacking that a bit, there are two ways in which this tendency will typically show up when working with an exceptional engineer:

- She ships high quality solutions (quality being not-bad)
- When she discovers badness she has an almost pathological desire to fix it
- Any system she works on typically benefits from her attention in either uncovering or fixing badness

Obviously terms like badness and quality are subjective, and even when defined there is a scale.  It gets even worse when you layer on the fact that your primary goal will typically be to ship, and so stopping to fix every bit of badness you find would leave you paralysed and unable to deliver anything.  Cutting this Gordian knot with the appropriate degree of pragmatism is a lifelong challenge for any engineer that values shipping & disdains badness.

Practically speaking, you should understand both personally and as a team what constitutes badness, and then call it out whenever you see it.  Given your wide range of customers (see the next point) there will invariably be badness in your systems - how you choose to deal with it and when will shape the future of your system.

Consider an example of a backup failure.  Standard response might be to re-run the backup.  A more curious engineer might dig and perform some root-cause analysis.  A great engineer might automate the response.  An exceptional engineer might keep digging until she discovers the underlying badness that leads to the backup failure and do what she can to fix it, or expose the issue to the relevant team (whose problem would the SAN backup target running out of space be?).

## Treat the system as a customer

While everyone may care about the data, the scalability, and the performance of the [database] system as it pertains to their application, as a data engineer you are ultimately accountable for all of those concerns, for every application.  As you're making changes you should not only be thinking about the end-customer and your internal customers (colleagues), but also the system that you're modifying & maintaining.

Building a healthy level of scepticism will set you in good stead for ensuring you keep your data systems correct (free from corruption), available, and performant.  As the feature comes in which is going to add one call per second to some component, you'll be thinking about what happens at one and two orders of magnitude above that (and if you don't, who will?).  When you get access to your SQL Azure instance that supports 1000 TPS, you'll be the one verifying that and finding out what happens when you exceed that number - perhaps even coming up with a list of options for what you could do in that event.

There are many ways a given system can start to go south, most of which won't manifest as an application issue until it is too late.  This means you and your team have to monitor and be responsible for understanding the state of the system independent of the applications they support.  Your goal should always be to have the system alert you (or self-heal) so the problem is solved before it bubbles up to the application.

Unlike most other customers the system doesn't have a way of making these problems known (colleagues and customers are typically adept at voicing their concerns), so in treating the system as a customer you have to ensure that you've put the appropriate structures in place to get useful feedback and insight into the current/historic state of the system.

## Summary & Additional Reading

Excellence doesn't happen by accident - it is something which you have to continually and deliberately work towards.  I've outlined  the template I currently use when having discussions about excellence in database engineering with others or for my own introspection.  The list is really just a jumping-off point, and I hope to continue having interesting & challenging conversations with brilliant people about what excellence looks like to them.

Below are a handful of interesting articles/books which served as inspiration for parts of this post.  If you have any questions or thoughts about what makes an excellent engineer (database or otherwise) drop me a line or leave a comment below.

[Principles](https://www.principles.com) - particularly principle [138](https://www.principles.com/#Principle-138), which has made its way verbatim to my point 'Do not tolerate badness'

[Site Reliability Engineering](https://landing.google.com/sre/) - Epitomises what I think exceptional operations looks like, and what anyone servicing a shared system (like maybe a database) should aspire to

[Valve Staff Handbook](http://www.valvesoftware.com/company/Valve_Handbook_LowRes.pdf) (particularly pages 39-46) - Calls out T shaped individuals (breadth & depth) and hits a lot of the right notes on hiring for excellence

[Chris Adkin](https://exadat.co.uk/), [Paul White](https://sqlperformance.com/author/paulwhitenzgmail-com), [Bob & Bob](https://blogs.msdn.microsoft.com/bobsql/) - When someone asks me for an example of an expert in a few different domains these are some of the blogs I send them

[Impostor syndrome](http://www.hanselman.com/blog/ImAPhonyAreYou.aspx) - Great article with a wonderful closing quote that only becomes increasingly relevant the more you learn.  Excellence is a tall order, it's ok to feel a little overwhelmed by it all
