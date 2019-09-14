---
layout: post
title: Setting sp_configure values with SQLChecks
share-img: http://tjaddison.com/assets/2018/2018-05-31/SetSpConfigFunction.png
tags: [PowerShell, SQL, SQLChecks]
---

As of v1.0 SQLChecks now contains the `Set-SpConfig` command that allows you to take a file that documents a server configuration (specifically sp_configure values) and apply that configuration to a server.  The configuration file is the same one used by Pester tests ([perhaps in combination with something like dbachecks](https://github.com/taddison/dbachecks-wrapper)), which means you now have a mechanism to document, test, and set your server's configuration.

In order to apply the configuration to a single server you would run the following PowerShell (note that SQLChecks configuration files contain the instance name, which is why we don't have to specify a server):

```powershell
  Read-SqlChecksConfig "c:\configs\localhost.config.json" `
  | Set-SpConfig -Verbose
```

Running in verbose means that it'll output progress as it changes a value, as well as a summary as it finishes (x/y config values updated).

>Note the command compares the configured value against the expected value - if the configured value is correct but the runtime value is wrong then this will neither fail the Pester tests, nor update the value when using `Set-SpConfig`.

<!--more-->

You can easily apply changes to a whole estate of servers by using the below script, which will find every config file in a folder (or subfolder) and apply the `sp_configure` values to the servers.

```powershell
Get-ChildItem -Filter *.config.json -Recurse `
  | Read-SqlChecksConfig `
  | Set-SpConfig -Verbose
```

Under the hood this command leverages the [dbatools](https://dbatools.io/) library, specifically the commands [Get-DbaSpConfigure](https://dbatools.io/functions/get-dbaspconfigure/) and [Set-DbaSpConfigure](https://dbatools.io/functions/set-dbaspconfigure/).  These commands both end up creating SMO objects which are pretty costly in terms of time compared to a hand-rolled T-SQL solution to check/set these values.

There is a [GitHub issue around performance](https://github.com/sqlcollaborative/dbachecks/issues/316), and Microsoft have said to 'expect dramatic improvement in the coming months' in [this UserVoice issue related to SMO](https://feedback.azure.com/forums/908035-sql-server/suggestions/33535612-smo-enumerations-slow-with-hundreds-of-databases).  If the performance improvements don't arrive or are not dramatic enough, adding some custom commands will probably be worth doing (especially if you are checking a lot of values over a lot of servers).