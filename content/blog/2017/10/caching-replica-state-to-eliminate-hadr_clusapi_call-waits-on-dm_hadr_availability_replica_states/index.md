---
layout: post
title: Caching replica state to eliminate HADR_CLUSAPI_CALL waits on dm_hadr_availability_replica_states
share-img: http://tjaddison.com/assets/2017/2017-10-04/Blocking2.png
tags: [SQL]
---

We use [tsqlscheduler](https://github.com/taddison/tsqlScheduler) to manage most of our SQL Jobs (a few hundred jobs in a several overlapping AGs), and when lots of schedules overlap (e.g. many concurrent jobs kick off on the hour) we saw waits and blocking on the function that was attempting to determine whether or not the server was the primary replica:

![Blocking](/assets/2017/2017-10-04/Blocking2.png)

This function queries the DMV [sys.dm_hadr_availability_replica_states](https://docs.microsoft.com/en-us/sql/relational-databases/system-dynamic-management-views/sys-dm-hadr-availability-replica-states-transact-sql), and we found that this DMV doesn't perform so well when the cluster size, number of AGs, and number of concurrent queries against the DMV rises.

**Querying for the replica's role**
```sql
select      @role = ars.role_desc
from        sys.dm_hadr_availability_replica_states ars
inner join  sys.availability_groups ag
on          ars.group_id = ag.group_id
where       ag.name = @availabilityGroupName
and         ars.is_local = 1;
```

Under the hood this DMV is calling into the Windows clustering APIs to determine the current status of the replica.  There isn't a tonne of information out there - some comments on this [SO answer](https://dba.stackexchange.com/a/131636) confirm what the DMV is doing, and [this MSFT post](https://blogs.msdn.microsoft.com/sqlmeditation/2017/08/18/what-really-happens-when-hadr_clusapi_call-wait-type-is-set/) adds a little more detail.  After checking some of the obvious items listed in the second post I decided that maybe we shouldn't be querying the DMV quite so often, and given how rarely the information changes ("is my node the primary replica?") caching this information seemed like a good fit.

<!--more-->
## Implementing caching

Caching of the replica state is available in any release of [tsqlscheduler](https://github.com/taddison/tsqlScheduler) starting with [1.1](https://github.com/taddison/tsqlScheduler/releases/tag/1.1).  Each task now specifies whether or not it uses the cached replica check or not - most tasks should use the cached replica check, with the exception of the task which keeps the cache updated.

The caching is implemented by a task that persists all replica states for the given AG, and is queried by the GetCachedAvailabilityGroupRole function.

**Update replica status**
```sql
create or alter procedure scheduler.UpdateReplicaStatus
as
begin
    set nocount on;
    set xact_abort on;
    
    declare  @availabilityGroup nvarchar(128);

    select 	@availabilityGroup = ag.AvailabilityGroup
    from 	scheduler.GetAvailabilityGroup() as ag;

    merge scheduler.ReplicaStatus as rs
    using (
        select      ar.replica_server_name, ars.role_desc
        from        sys.dm_hadr_availability_replica_states ars
        inner join  sys.availability_groups ag
        on          ars.group_id = ag.group_id
        join        sys.availability_replicas as ar
        on          ar.replica_id = ars.replica_id
        where       ag.name = @availabilityGroup
    ) as src
    on src.replica_server_name = rs.HostName
    and	src.role_desc = @availabilityGroup
    when matched then 
        update
            set rs.AvailabilityGroupRole = src.role_desc
    when not matched then
        insert ( AvailabilityGroup, HostName, AvailabilityGroupRole )
        values ( @availabilityGroup, src.replica_server_name, src.role_desc )
    when not matched by source
        then delete; 
end
```

**Get cached role**
```
create or alter function scheduler.GetCachedAvailabilityGroupRole
(
	@availabilityGroupName nvarchar(128)
)
returns nvarchar(60)
as
begin
	declare @role nvarchar(60);

	select 	@role = rs.AvailabilityGroupRole
	from 	scheduler.ReplicaStatus as rs
	where	rs.AvailabilityGroup = @availabilityGroupName
	and	rs.HostName = host_name();

	return coalesce(@role, N'');
end
```

Deploying these changes eliminated the blocking behaviour, and we've seen the back of some fairly spectacular blocking chains we were able to produce when a server was under heavy load (yes, that is almost 3 minutes waiting to decide if the task can even run or not!).

![Much More Blocking](/assets/2017/2017-10-04/Blocking.png)