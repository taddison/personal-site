---
layout: post
title: View currently executing tasks in tsqlScheduler
share-img: http://tjaddison.com/assets/2017/2017-09-03/CurrentlyExecutingTasks.png
tags: [SQL, tsqlScheduler]
---
[tsqlScheduler 1.0](https://github.com/taddison/tsqlScheduler/releases/tag/1.0) was released today, and now contains a feature which allows you to view currently running tasks by storing information about that task in [context_info](https://docs.microsoft.com/en-us/sql/t-sql/functions/context-info-transact-sql).

The view **scheduler.CurrentlyExecutingTasks** can be queried and joined back to the core tables to produce results that tell us at a glance how long the task has been running for, and how long it took last time.

```sql
select	te.StartDateTime
		,datediff(second,te.StartDateTime, getutcdate()) as DurationSeconds
		,t.Identifier
		,lastResult.StartDateTime as LastStartTime
		,datediff(second,lastResult.StartDateTime, lastResult.EndDateTime) as LastDurationSeconds
		,lastResult.IsError as LastIsError
from	scheduler.CurrentlyExecutingTasks as cet
join    scheduler.GetInstanceId() as id
on      cet.Instanceid = id.Id
join	scheduler.Task as t
on		t.TaskId = cet.TaskId
join	scheduler.TaskExecution as te
on		te.ExecutionId = cet.ExecutionId
outer apply (
	select top 1 *
	from scheduler.TaskExecution as teh
	where teh.TaskId = t.TaskId
	and teh.ExecutionId <> te.ExecutionId
	order by ExecutionId desc
) as lastResult
```

![Currently executing tasks](/assets/2017/2017-09-03/CurrentlyExecutingTasks.png)

In this example there are four tasks which have been running for 55 seconds.  They normally take 60 seconds to run, and they last ran a minute ago (with no errors).

The rest of this post talks through how the mapping works.
<!--more-->

## Recap of tsqlScheduler

tsqlScheduler creates one SQL Agent job per entry in the *scheduler.Task* table.  The agent job calls the *scheduler.ExecuteTask* procedure, which eventually calls sp_executesql to run the TSQL specified by the entry in the task table.

The execution of of each task is logged in the *scheduler.TaskExecution* table.

## Storing information against each task

In order to tag each execution with the metadata we need to tie back to the task & execution data we use context_info.  This allows us to store up to 128 bytes of data against a session which can then be queried through the [dm_exec_requests](https://docs.microsoft.com/en-us/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-requests-transact-sql) and [dm_exec_sessions](https://docs.microsoft.com/en-us/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-sessions-transact-sql) DMVs.

The information we'll store against each execution are:

- The scheduler instance identifier
- The task id
- The execution id

Each instance when deployed has a unique guid generated that identifies that instance (returned via the function *scheduler.GetInstanceId*).  We need this as the task id is a number, and so for any SQL instance with multiple scheduler instances deployed (e.g. one standalone and multiple AGs) we use the instance id to disambiguate which instance the task belongs to.

Context info requires a binary payload, and rather than worrying about packing and unpacking a payload I've opted to use json to allow for a fairly flexible schema (I'd have preferred to use [session_context](https://docs.microsoft.com/en-us/sql/t-sql/functions/session-context-transact-sql) but you can't query that from other sessions at the moment).

As each task is executed the ExecuteTask procedure calls into the following procedure to build and store our json data:

```sql
create or alter procedure scheduler.SetContextInfo
    @instanceIdentifier uniqueidentifier
    ,@taskId int
    ,@executionId int
as
begin
    declare @descriptor varchar(128) = 
	    '{ "i":"' + cast(@instanceIdentifier as varchar(36)) 
	    + '","t":' + cast(@taskId as varchar(12)) 
	    + ',"e":' + cast(@executionId as varchar(12)) 
	    + '}';

    declare @binaryPayload varbinary(128) = cast(@descriptor as varbinary(128));
    set context_info @binarypayload;
end
```

SQL Agent does use pooled connections, though it resets each connection before each job is executed, which means that we don't have to worry about resetting the context_info after every execution.

## Viewing task information

The view *scheduler.CurrentlyExecutingTasks* returns one row for each task currently executing, regardless of the scheduler instance the task was deployed into.

```sql
select  tasks.InstanceId
        ,tasks.TaskId
        ,tasks.ExecutionId
from    sys.dm_exec_requests as r
cross apply (
    select try_cast(r.context_info as varchar(128)) as ContextInfo
) as i
cross apply openjson (i.ContextInfo, N'$')
	with (
		InstanceId uniqueidentifier	N'$.i'
		,Taskid int	N'$.t'
		,ExecutionId int N'$.e'
	) as tasks
where r.context_info <> 0x
and   isjson(i.ContextInfo) = 1
```

Most sessions have no context_info associated with them (0x) so we can ignore those.  For sessions which do have a payload we attempt to convert to varchar and then check if they're valid json.  We then extract the json and correctly type the values.

To filter the currently executing tasks for the current scheduler instance only (the database that contains the view), you can modify the query to join onto the function that returns the instance's unique Id:

```sql
select cet.*
from   scheduler.CurrentlyExecutingTasks as cet
join   scheduler.GetInstanceId() as id
on     cet.Instanceid = id.Id
```

This is the same join that is used in the monitoring query at the start of the post, and is essential in deployments where multiple scheduler schemas are concurrently executing.