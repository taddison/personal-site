---
layout: post
title: SQLChecks v1 Released
share-img: http://tjaddison.com/assets/2018/2018-01-07/PesterTests.png
tags: [PowerShell, Pester, SQL, SQLChecks]
---

After using SQLChecks to help tame our production instances for a few months, [v1 has now been released](https://github.com/taddison/SQLChecks/releases/tag/1.0).  This first release includes documentation on all supported tests, as well as limited guidelines on how to structure any new tests/PowerShell functions.

![Pester Tests](/assets/2018/2018-01-07/PesterTests.png)

Get the [latest version of SQLChecks from GitHub](https://github.com/taddison/SQLChecks).
<!--more-->
The documentation in some cases includes suggestions for config values, and explanations on why you should care about testing for that particular value.  These values and recommendations are drawn from a combination official sources (e.g. [SQLRAP](https://blogs.technet.microsoft.com/mspfe/2013/01/08/10-top-sql-server-issues-uncovered-by-the-sql-server-risk-assessment-program/)), books & blogs, as well as hard-won experience.

The goal with these tests is not just to identify areas where you're not meeting policy today, but to ensure that over time you don't have any accidental regressions (e.g. new databases, people changing configuration settings for testing and not putting them back...)

As an example consider the transaction log growth tests:

*Max transaction log fixed growth*
> Reports on any database which has a fixed growth larger than the config value.

*Transaction log with percentage growth*
> Reports on any database log with a percentage growth configured.

Even though you'll endeavour to design your environment to never need an auto-growth (by e.g. right sizing your databases, managing log backups, monitoring replica redo, managing long-running transactions), if your database log file does ever fill and triggers that growth you'll want it to complete quickly (as all log activity is suspended while the log grows).  Because the log is zeroed out before use you could find yourself waiting a long time when your 1TB database log attempts to grow by 10%.

Having this check in place alongside existing measures you might have to manage log file growths (setting model appropriately for new databases, one-time reviews of all databases in violation, etc.) means that when something invariably slips through the cracks (or a DBA fat-fingers an update) you'll know about it and be able to take corrective action.