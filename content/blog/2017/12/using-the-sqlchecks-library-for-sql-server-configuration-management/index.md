---
layout: post
title: Using the SQLChecks library for SQL Server configuration management
share-img: http://tjaddison.com/assets/2017/2017-12-03/LocalhostTests.png
tags: [PowerShell, Pester, SQL, SQLChecks]
---
Getting started with configuration management can be pretty daunting.  The number of frameworks/tools and their complexity can end up being a significant barrier to actually getting started (requiring you to answer both 'which framework should I use' and then 'how do I actually use it').  The key to making progress is to start small and make configuration management part of your daily/weekly checks.

To this end I built the [SQLChecks](https://github.com/taddison/SQLChecks) library to make it easy to get started checking your SQL Server configuration, and start implementing the patterns that the bigger frameworks will require.

This post will walk through how to set up a basic configuration management process to record and check the state of your SQL Server instances using [Pester](https://github.com/pester/Pester) and SQLChecks.  Once built you can run it interactivley (reporting to the console as shown below), or as part of a schedule to produce a report.

![Pester Tests](/assets/2017/2017-12-03/LocalhostTests.png)

*In this example we've failed one of the tests that is checking that the right trace flags are set on the server (and both of them are missing!)*

<!--more-->

## Specifying your desired instance configuration

One of the key activities to onboard a server/service into configuration management is to specify what that configuration should look like.  SQLChecks currently focuses on SQL instance configuration, and at the time of writing allows us to specify:

- The value of any sp_configure configuration values
- Any global trace flags (including checking that there are no global trace flags)
- The number of SQL Server error logs

For each server you want to check you'll need a file that describes the instance configuration.  Only the **ServerInstance** property is mandatory - everything else can be omitted, as only the listed properties will be checked.  By convention this file should be named instance.config.json.

**localhost.config.json**
```json
{
    "ServerInstance":"localhost",
    "SpConfig": {
        "MaxDegreeOfParallelism":0,
        "XpCmdShellEnabled":0,
        "ShowAdvancedOptions":0
    },
    "NumErrorLogs": 14,
    "TraceFlags":[3226,7412]
}
``` 

The SpConfig property is actually a collection of properties, and you can discover all the available options (as well as their current values) by executing the following command against one of your servers.  This requires you have the [DBATools](https://dbatools.io/) module installed.

```powershell
Get-DbaSpConfigure -SqlInstance localhost | Out-GridView
```

![SpConfigure Options](/assets/2017/2017-12-03/SpConfigureGridview.png)

>The **ConfigName** is what you need to use in your SpConfig section.  For every value you want to check, list the ConfigName and value you expect.

You can put these text files anywhere, though I would suggest creating a private git repository for them.  This will allow you to keep a history of your configuration changes, and require changes to be committed along with any explanations that may help later debugging (e.g. 'Adding TF3459 to benchmark redo performance for a week').  Changing the values first in source and then on the server is a great habit to get into (especially if you later leverage more fully-featured frameworks).

Once you have your config file(s) you're ready to see if reality matches the plan.

## Installing SQLChecks

SQLChecks requires DBATools, so if you've not already you need to [install that](https://dbatools.io/download/).

Once you've got DBATools you'll need to clone SQLChecks (you can also [download a zip from Github](https://github.com/taddison/SQLChecks/archive/master.zip)).  Once cloned you need to import the SQLChecks module.

```powershell
c:\src>git clone https://github.com/taddison/SQLChecks.git
c:\src>Import-Module .\SQLChecks\src\SQLChecks -Force -Verbose
```

We're now ready to 'test' our configs - to make this easier I'd suggest creating a PowerShell script that will test one or more of your files.  Examples of these can be found in the [SQLChecks repo](https://github.com/taddison/SQLChecks/tree/master/examples) - included below is a file that will test a single config.

>Note that we're referencing a folder we cloned as part of SQLChecks (c:\src\SQLChecks\tests), as well as a configuration file (localhost.config.json) - update the names/paths accordingly.

**RunChecks.ps1**
```powershell
#Requires -Modules DBATools, SQLChecks

[string]$data = Get-Content -Path .\localhost.config.json -Raw
$data | ConvertFrom-Json -OutVariable configs | Out-Null

Invoke-Pester -Script @{Path='c:\src\SQLChecks\tests';Parameters= @{configs=$configs}}
```

You can then run the checks by executing the PowerShell file:

```powershell
c:\src\SQLInstanceConfigs>.\RunChecks.ps1
```

If you've configured everything correctly you should see Pester start to run tests against your server.

## What is happening

The high level flow for what happens when you execute RunChecks.ps1 is:

- Checks to see if the DBATools and SQLChecks modules are available
- Extract the contents of the specified file (localhost.config.json) to a variable called $data, using -Raw as we want it as a whole string rather than as a collection of lines (which we'd get by default)
- Convert the $data string to Json, and store the result in a variable called $configs.  We use Out-Null to suppress console output
- Run Pester and complete all the tests (files with .tests.ps1 extensions) in the specified folder (c:\src\SQLChecks\tests), passing the $configs parameter to each test file

If we're executing tests against a folder full of config files the main change is that we're looping through files to extract configs (and then testing all of them), rather than testing a single file.

Right now there is only a single test file in the tests folder, which contains multiple tests for the SQL Instance.  In the future you can expect to see files which perform tests against availability groups, databases, and Windows server.

## Generating reports

In order to generate a report we're going to leverage [Format-Pester](https://github.com/equelin/Format-Pester) to run all of our tests, and output them into a self-contained HTML report.  This can then be saved for future reference or distributed via email/fileshare/etc.

You'll need to install both [Format-Pester](https://github.com/equelin/Format-Pester) and [PScribo](https://github.com/iainbrighton/PScribo) (used by Format-Pester) to execute this script.

**GenerateReport.ps1**
```powershell
#Requires -Modules DBATools, SQLChecks, Format-Pester, PScribo

$instances = Get-ChildItem -Path c:\src\SQLInstanceConfigs -Filter *.config.json
$configs = @()

foreach($instance in $instances) {
    [string]$configData = Get-Content -Path $instance.PSPath -Raw
    $configData | ConvertFrom-Json -OutVariable +configs
}
Invoke-Pester -Script @{Path='c:\src\SQLChecks\tests';Parameters= @{configs=$configs}} -PassThru | Format-Pester -Format HTML -Path c:\reports
```

>This example pulls all configuration files from the specified folder (c:\src\SQLInstanceConfigs) and outputs the report to a target folder (c:\reports)

## When configs don't match reality

A key part of configuration management is dealing with settings that don't match their configuration value.  If you run your tests and discover that the MAXDOP setting isn't correct you might want that to be automatically handled.  This isn't something that this solution handles (though you could easily extend it to do so!).

[DSC](https://docs.microsoft.com/en-us/powershell/dsc/overview) has a very simple (yet powerful) model for thinking about configuration management that helps highlight the core difference between this solution and what I'd consider 'full' configuration management.  Every resource in DSC (which could be something like an sp_configure value) supports three operations:

- Get the value
- Test the value against config
- Set the value to something

You can see that we've got something that deals with the first two (get, test) only.

Though it might seem we're missing out on the most important part of configuration management by not implementing the 'set' functionality, that actually sits at the top of the pyramid.  Knowing what your server configuration is supposed to look like and being able to verify it does or does not match are definitely where you should be starting.

## Further reading

For a SQL specific solution to the problem of configuration you can look at [Policy Based Management](https://docs.microsoft.com/en-us/sql/relational-databases/policy-based-management/administer-servers-by-using-policy-based-management).

For something that supports the full set of operations (get, test, and set) I'd suggest starting with [DSC](https://docs.microsoft.com/en-us/powershell/dsc/overview).  There are some promising developments in [ReverseDSC](https://github.com/Microsoft/ReverseDSC) that might make getting started with DSC for SQL Server much easier.

[Puppet](https://puppet.com/docs/puppet/5.3/architecture.html) and [Chef](https://docs.chef.io/chef_overview.html) are also worth looking at - particularly the similarities and differences between their architectures (though the implementations differ Puppet, Chef, and DSC have a lot in common).

Finally, some books I'd recommend on engineering operations (including Configuration Management falls) are [Web Operations: Keeping the Data On Time](https://www.amazon.co.uk/Web-Operations-Keeping-Data-Time/dp/1449377440) and [Site Reliability Engineering](https://landing.google.com/sre/book.html).