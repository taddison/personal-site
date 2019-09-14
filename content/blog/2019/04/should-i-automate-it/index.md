---
layout: post
title: Should I Automate It?
share-img: https://tjaddison.com/assets/2019/2019-04-30/ShouldIAutomateIt.png
tags: [Automation, Management, Excel]
---

Whenever you need to do something more than once it's often tempting to invest in the process - either by making it easier to repeat or fully automating it.

This post isn't about convincing you that it's time to automate that thing (if you're not already 'automate by default' go check out [XKCD 1205] - once you are fully on the automation train come back here).  This post is about giving you another tool to help decide to _not automate_ that thing.

![Automation Calculator](/assets/2019/2019-04-30/Spreadsheet.png)

Download the [Calculator] to follow along!

<!--more-->

## The weekly health check

Let's imagine that every week you have a few SQL Servers you run a health check on - you grab a bit of data on key metrics, compare to a baseline number, and then send a quick summary to the team highlighting anywhere the servers need some attention this week.  Let's say it currently takes you 30 minutes, and you do it every week.

Ignoring vacations that's 1,560 minutes a year - almost 26 hours spent pulling data!  And if you imagine this check is something you'll do forever (which we'll say is...5 years) then that comes out to just over 3 weeks of time spent on that task alone (making some assumptions about working weeks).  Surely we should get on automating that ASAP?

## How long is that automation going to take?

In the prior step we took our requirement, it's duration and frequency, and a timeframe - and then used those to come up with an *automation budget*.  Although many projects end up with arbitrary deadlines I've rarely found them to be delivered feature-complete or on-time.  For automation I'd suggest by focusing on the question *how long will it take to automate*?

This is a pretty hard question to answer!  Depending on the task, the amount to which you automate, and your expertise at the automation process the answer will vary wildly.  Rather than focusing on automating the whole thing it's often better to focus on how much _time you can save_ by automating part of a task, and then compute your Return On Investment (ROI) for that piece of automation.

Let's assume that we'll start by automating the collection of metrics - in our example we were connecting to each server manually to run a query, and we're going to build something to allow us to run our query against multiple servers at the same time.  That's a fairly tractable project, we're pretty experienced with it, so we say it'll take *4 hours* to implement that, which *once every week* will save us *5 minutes*.

If we plug those into the [Calculator]:

- Time to automate - 240
- Time saved by automation - 5
- Times per month - 4 (once per week)

*It's going to take 1 year before the automation investment pays off.*

> The ROI column tells you how much time you've saved less how much you spent on automation - less than zero means you're in 'automation debt', and more than zero means your automation is paying itself back.

## Estimates are...approximate

Most of us really suck at estimates.  I've found it extremely helpful to always look at automation based on a range.  The calculator defaults to assuming that the best-case might be up to twice as fast - instead of 240 minutes it'll only take 120.  It also defaults to assuming your worst case is up to three times slower - so that 240 minutes becomes 480 minutes.  Ouch.

These multipliers (and you can adjust them) are what drive the `ROI Fast` and `ROI Slow` columns.  You can see that in the best case (we automate faster than we thought) we get payback after only 9 months, whereas in the slow case we're waiting up to 2 years.


The results of this automation show that this automation has a long-term payoff - 1-2 years before we land in the definitely bucket (which is where even the `Slow ROI` shows a payoff).  If the process is likely to stay static and not require changes over the next 2 years then this might be worth automating?

![Automation Calculator](/assets/2019/2019-04-30/AutomateTheCollection.png)

## So, should I automate it?

This tool allows you to quickly see how long before your estimate pays off.  Work prioritzation is ultimately about saying no to many different projects, and if you find out after plugging your numbers in that the payback is in years then you might be able to say no quite quickly.

It's pretty rare you'll ever make a decision solely based on the numbers here - I've found the following to be useful (though not an exhaustive) set of inputs into deciding if the automation is worth it:

- Does it _totally_ automate a specific task, removing the need for any manual intervention?  This is slightly more valuable than something that is partially automated.
- How static is this process, and how often do we expect it to change?
- Are there any easier ways to save the time (stop doing the task, delegate it, etc.)
- Does it help learn/share a new skill?
- Does it automate something that is particularly error-prone when completed manually (increasing accuracy)?
- How easy is it to maintain/debug the automation process?
- Does it create some kind of technical leverage (automating data collection from multiple servers would have uses outside of this specific task, etc.)
- Is saving that time the highest value-add right now (if you instead spend those 5 minutes doing it manually what else could you be working on)?

And that last one is really key, especially when you get into larger projects that might take days or even weeks.  Every automation effort invariably pays off over some time period, but whether you could be doing something even more valuable with your time is where the realy hard work of prioritzation comes in.  Hopefully the calculator will help you decide that automation project you were considering isn't worth putting into that list of 'things that need to be prioritised', and give you one less thing to worry about.

[XKCD 1205]: https://xkcd.com/1205/
[Calculator]: /assets/2019/2019-04-30/SampleWorkbook.xlsx