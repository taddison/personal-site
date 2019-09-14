---
layout: post
title: Checking SQL Agent job ownership with Pester
share-img: http://tjaddison.com/assets/2017/2017-04-22/PesterFailure.png
tags: [PowerShell, Pester, SQL]
---

Ensuring your jobs are all owned by SA is a best practice I've used to help minimise the chance of an SA job not running correctly due to the owners login being disabled, or there being an issue with authentication.

There are plenty of ways of going about this, though the most flexible I've found so far is making it an automated infrastructure test with Pester.  If you're not familiar with Pester I encourage you to check out the [Pester Github site](https://github.com/pester/Pester), and then for more SQL specific details browse the Pester category of posts by [SQL DBA With a Beard](https://sqldbawithabeard.com/tag/pester/).
<!--more-->

Once Pester is configured, the simplest way to execute a test is to run the following.

```powershell
$query = "select count(*) as Jobs from msdb.dbo.sysjobs as j where j.owner_sid <> 0x01"

Describe "SQL Agent on localhost" {
    It "has jobs only owned by sa" {
        (Invoke-Sqlcmd -ServerInstance localhost -Query $query).Jobs | Should Be 0
    }
}
```

This executes the query against our localhost, and compares the result (count(*) aliased as Jobs) against the expected value of 0.  When it works we get the following output:

![Successful Pester test](/assets/2017/2017-04-22/PesterSuccess.png)

If there are any jobs which are not owned by SA then we'll be told how many there are.

![Failed Pester test](/assets/2017/2017-04-22/PesterFailure.png)

To really leverage this you'll want to target multiple servers.  To do that from a single script we can provide a hard-coded list of servers and then call the test in a loop.

```powershell
$query = "select count(*) as Jobs from msdb.dbo.sysjobs as j where j.owner_sid <> 0x01"
$servers = @('localhost','.')

foreach($server in $servers) {
    Describe "SQL Agent on $server" {
        It "has jobs only owned by sa" {
            (Invoke-Sqlcmd -ServerInstance localhost -Query $query).Jobs | Should Be 0
        }
    }
}
```

![Multiple Pester tests](/assets/2017/2017-04-22/PesterMultipleSuccess.png)

The list of servers could come from a text file, or a [CMS Server](https://docs.microsoft.com/en-us/sql/relational-databases/administer-multiple-servers-using-central-management-servers).

## Moving from a single script to a solution

As you go on to write more tests you will probably want to take advantage of Pester's ability to isolate tests in test files (with the .tests.ps1 extension) and want to run them all.  Typically you'll want to manage the list of servers you execute the test against outside of the test itself.  What I suggest is making the server list a common parameter for all your SQL test files, and then populating the server list in a 'runner' class.

In the below example you'll see we connect to a CMS to pull the list of servers to execute against (based on a group called 'Instances to Test').  The query has also been modified to ignore jobs in the 'Report Server' category, which is what SSRS uses when it creates jobs to support subscriptions (none of which are ever owned by SA).

**RunTests.ps1**
```powershell
$cms = "localhost\CMS"
 
$servers = invoke-sqlcmd -Server $cms -Query "
SELECT ssrsi.server_name
from msdb.dbo.sysmanagement_shared_registered_servers_internal as ssrsi
join msdb.dbo.sysmanagement_shared_server_groups_internal as sssgi
on sssgi.server_group_id = ssrsi.server_group_id
where sssgi.name = 'Instances to Test'" | Select-Object -ExpandProperty server_name

invoke-pester -Script @{Path='.';Parameters= @{serverList=$servers}}
```

**SQLAgent.tests.ps1**
```powershell
Param(
    [object]$servers
)

$query = "
select count(*) as Jobs 
from msdb.dbo.sysjobs as j 
join msdb.dbo.syscategories as c 
on c.category_id = j.category_id 
where j.owner_sid <> 0x01 
and c.Name <> 'Report Server'"

foreach($server in $servers) {
    Describe "SQL Agent on $server" {
        It "has jobs only owned by sa" {
            (Invoke-Sqlcmd -ServerInstance $server -Query $query).Jobs | Should Be 0
        }
    }
}
```

As you create additional infrastructure tests you can drop them in the folder and Pester will automatically run them on your list of target servers.  I've got a repository which contains some example tests on [Github](https://github.com/taddison/SQLInfrastructureTests).

Note that the test we have coded for looks to ensure all jobs are owned by SA.  To workaround the issues described at the start of the post (e.g. can't authenticate a user account to run a job) we should say that *user accounts* shouldn't own jobs.  In my current environment that translates to all jobs must be owned by SA.  In your environment you might have a dedicated SQL account for jobs (or something similar), and so you may wish to modify this check.

## Additional Reading

[sp_Blitz](https://www.brentozar.com/blitz/) One of the checks sp_Blitz currently implements is [Jobs Owned by User Accounts](https://www.brentozar.com/blitz/jobs-owned-by-user-accounts/).  If you're running this regularly it'll help catch the SQL Agent job issue, as well as many others.

[Format-Pester](https://github.com/equelin/Format-Pester) Take the output of Invoke-Pester and produce self-contained HTML summary pages.

[tSQLScheduler](https://github.com/taddison/tsqlScheduler) Github project used to create agent jobs automatically from data, ensuring they're always created as SA.