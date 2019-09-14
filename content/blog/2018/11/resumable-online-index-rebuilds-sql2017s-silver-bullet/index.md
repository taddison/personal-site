---
layout: post
title: Resumable Online Index Rebuilds - SQL 2017's Silver Bullet
share-img: https://tjaddison.com/assets/2018/2018-11-16/IndexRebuildPaused.png
tags: [SQL]
---

Every new version of SQL Server comes with a whole grab-bag of new features that open up exciting possibilities, or obviate the need for workarounds (or dirty hacks).  In the runup to deploying SQL 2017 I thought that [automatic plan correction] was going to be the closest thing to a silver bullet I'd seen in any release so far (in terms of value added vs. effort to implement), but it has been eclipsed for us by the _awesomeness_ of Resumable Online Index Rebuilds (ROIR).

In this post I'll talk through a few of the scenarios where this feature really shines, and how it has transformed the way we think about index maintenance.  If you'd like more details about how ROIR is implemented I'd encourage you to read through the [excellent paper detailing ROIR] - this covers how the online index rebuild algorithm was updated, and also demonstrates how in most cases ROIR outperforms the non-resumable version in terms of performance.

<!--more-->

## When index rebuilds are kind of a big deal

A few conditions (either individually or in combination) can make index rebuilds a pretty big deal in an environment:

- 24/7 operations (no such thing as a 'quiet time' or maintenance window)
- Index is very large (takes a long time to rebuild)
- Transaction volume is high (log truncation being blocked means log utilisation grows rapidly)
- Presence of Availability Group (AG) replicas (index build has to be replayed on 1...many servers, potentially getting blocked behind queries)

Having enterprise edition (online rebuilds) and fast local-attached drives (NVMe and availability groups) help with the 24/7 and speed issues, but transaction log volume and AG replicas remain a challenge.  In the worst case you end up needing a huge transaction log on your primary replica to support the rebuild itself, and then it can grow even larger if redo gets blocked on the secondary replica.

Those last two bullet points caused us to go through a pretty rigorous scheduling process for any maintenance on indexes larger than 100GB in one of our high-volume databases.  What should have been an automated script turned into an affair which needed attention from the DB and App teams, potentially dialling down other operations to reduce load (not to mention the DBA monitoring the log utilisation and invariably sweating bullets as the rebuild chugs along).  There may have also been several reported incidents of reporting queries on replicas being killed if they got in front of a `SCH-M` lock.

Not ideal, and that isn't even the worst of it.

## Throwing away good work

On our mission critical instances we have no tolerance for any kind of blocking on critical tables.  As such we take an extremely paranoid approach to any index of rebuild:

```sql
set lock_timeout 1500;
alter index IX_ImportantIndex on dbo.ImportantTable rebuild with (online = on);
```

Online index rebuilds aren't entirely lock-free - there is a `SCH-M` lock taken at the start and end of the process, and although [managed lock priority] allows you to wait at low priority the options for what to do if your session _can't_ get the lock after the timeout are pretty limited:

- Kill yourself
- Kill anything blocking you
- Elevate to regular lock priority

The second two aren't really options - critical work is either going to be killed, or get blocked (for who knows how long - option 3 could potentially wait forever).

The first option is the only one we'd really entertain, but in our testing we found that on a busy OLTP system waiting at low priority for even five minutes had less chance of getting through than waiting at normal priority for 1.5 seconds.  This is obviously specific to our environment, but it is what we ended up going with.  This sometimes meant that a 30 minute index rebuild could end up getting rolled back because it couldn't acquire a brief `SCH-M` lock.

>The option of leaving the transaction open and waiting e.g. 1 hour at low priority was problematic due to the log usage.  We were never entirely happy this index maintenance setup, and it was relegated to the pile of 'works but not ideal, let's hope we don't have to rebuild critical indexes that often'.

## Enter the silver bullet - ROIR

In order to support resumable index operations in SQL 2017 the rebuild algorithm was changed to support batching.  Internally SQL Server will operate on batches of rows, committing work every 100k rows and allowing the transaction log to truncate after each batch.  In the event that the rebuild is stopped (either by a pause command, or something like a network blip/failover) the maximum amount of work that is 'lost' will be a single batch.

The icing on the cake is that resumable index rebuilds will typically execute _faster_ than the regular, non-resumable variety.  With a small change our index maintenance suddenly becomes almost risk-free:

```sql
set lock_timeout 1500;
alter index IX_ImportantIndex on dbo.ImportantTable rebuild with (online = on, resumable = on);
```

If the rebuild gets to 100% complete and attempts to perform the switch (acquiring the `SCH-M` lock) and fails, we haven't lost all the work.  Looking in `sys.index_resumable_operations` we'll see our rebuild at 100%.

```sql
select *
from sys.index_resumable_operations;
```

![Paused index rebuild](/assets/2018/2018-11-16/IndexRebuildPaused.png)

The following SQL attempts to complete the rebuild - sitting at 100% the only thing it needs to do is take the schema stability lock to switch out the new index for the old.  As we're using a lock timeout of 1500ms it might take a few tries, but crucially we do not have to start the index rebuild from scratch.

```sql
alter index IX_ImportantIndex on dbo.ImportantTable resume;
```

## Resumable index rebuild recommendations

First of all - use this everywhere.  There are almost no situations in which you don't want to use resumable index rebuilds (this will be easier in SQL 2019 when you can set the options `ELEVATE_ONLINE` and `ELEVATE_RESUMABLE`).  Even outside of an AG or high-volume scenario, why would you want to block log truncation, or put yourself at risk of losing the rebuild because your network drops (or because SSMS crashed...).

The new risk that resumable rebuilds bring is that you'll end up with a database full of paused rebuilds, all of which are using up additional space and adding overhead to all the DML against their target indexes.  I'd recommend at minimum an agent job that looks for any paused indexes which were paused more than N hours ago and aborts them.

In our environment we're currently exploring a solution that gives us much finer grained control over index maintenance by leveraging the `MAX_DURATION` option.  This allows us to tell the rebuild to abort after N minutes, and via an agent job we can optionally choose to resume the rebuild, wait a while, or abort it.  We're hoping to use this to better leverage available CPU/IO capacity across the cluster and ramp up/down operations with capacity.  Did I mention that you can resume operations with a different `MAXDOP`?

>It's still early days for our experimentation, but the ability to dial index rebuilds up/down depending on how the cluster reacts to the current `MAXDOP` is almost as awesome as the ROIR feature itself.

[automatic plan correction]: https://docs.microsoft.com/en-us/sql/relational-databases/automatic-tuning/automatic-tuning#automatic-plan-correction
[excellent paper detailing ROIR]: http://www.vldb.org/pvldb/vol10/p1742-antonopoulos.pdf
[managed lock priority]: https://blogs.msdn.microsoft.com/sql_shep/2014/04/30/sql-server-2014-managed-lock-priority-for-partition-switch-and-online-reindex/