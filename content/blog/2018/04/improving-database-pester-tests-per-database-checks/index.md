---
layout: post
title: Improving database Pester tests - per-database checks
share-img: http://tjaddison.com/assets/2018/2018-04-08/TestDatabases.png
tags: [PowerShell, Pester, SQL, SQLChecks]
---
When we first started putting tests together for [SQLChecks](https://github.com/taddison/SQLChecks) we naively/optimistically thought we'd mostly be seeing a sea of green, with failures being rare.  This influenced the way we developed 'database' tests, so that when you test an instance for 'databases with files too full', the test gives you a pass/fail for the entire instance.

This is fine when the test passes, but as soon as it fails it is spectacularly unhelpful in figuring out what broke.

![Something is wrong](/assets/2018/2018-04-08/TestInstance.png)

Arriving in the morning to discover one (or more) databases on an instance have a problem isn't particularly actionable, and so I've recently started to move all SQLChecks tests over to per-database, which is a lot more helpful.

![Some specific database is wrong](/assets/2018/2018-04-08/TestDatabases.png)

The rest of this post covers what the changes looked like, and talk a little more about the benefits of structuring tests this way.
<!--more-->

## Test changes
The original test is shown below, which produces a single result for the whole instance.

```powershell
Describe "Data file space used" -Tag MaxDataFileSize {
    foreach($config in $configs) {
        $serverInstance = $config.ServerInstance
        $MaxDataFileParams=@{
            ServerInstance = $serverInstance
            MaxDataFileSpaceUsedPercent = $maxDataConfig.SpaceUsedPercent
            WhiteListFiles = $maxDataConfig.WhitelistFiles
        }

        Context "Testing for data file space usage on $serverInstance" {
            It "$serverInstance has all databases under Max DataFile Space Used" {
                @(Get-DatabasesOverMaxDataFileSpaceUsed @MaxDataFileParams).Count | Should Be 0
            }
        }
    }
}
```

In order to move the test to report per-database:
- The `Get-DatabasesOverMaxDataFileSpaceUsed` function is replaced with a new one that no longer iterates over all databases in the SQL query, and instead executes against a single database, returning all files that are larger than the space used configuration value
- A list of database to run the check against is obtained by using `Get-DatabasesToCheck`, ignoring any replica databases
- A new test (It) is executed for each database - note the database name is updated in the hashtable each iteration

The formatting of the Context/It block was also changed to support easier consumption in the [dbachecks](https://github.com/sqlcollaborative/dbachecks) Power BI dashboard (which expects instance name to be in specific places).

```powershell
Describe "Data file space used" -Tag MaxDataFileSize {
    foreach($config in $configs) {
        $serverInstance = $config.ServerInstance   
        $spaceUsedPercentLimit = $maxDataConfig.SpaceUsedPercent
        $MaxDataFileParams=@{
            ServerInstance = $serverInstance
            MaxDataFileSpaceUsedPercent = $spaceUsedPercentLimit
        }

        $databases = Get-DatabasesToCheck -ServerInstance $serverInstance -PrimaryOnly

        Context "Testing for data file space usage on $serverInstance" {
            foreach($database in $databases) {
                It "$database files are all under $spaceUsedPercentLimit% full on $serverInstance" {
                    $MaxDataFileParams.Database = $database
                    @(Get-DatabaseFilesOverMaxDataFileSpaceUsed @MaxDataFileParams).Count | Should -Be 0
                }
            }
        }
    }
}
```

> Note that these tests have had code removed that isn't relevant to this example - you can see the full test in the [GitHub source](https://github.com/taddison/SQLChecks/blob/master/src/SQLChecks/Tests/Databases.tests.ps1).

## Appendix: Test code
The script to run a single test is shown below, and has an ad-hoc config built to test no database file on localhost is more than 90 percent full.

```powershell
Import-Module .\src\SQLChecks -Force

$configData = @'
{
    "ServerInstance": "localhost"
    ,"MaxDataFileSize": {
        "SpaceUsedPercent": 90
    }
}
'@
$config = $configData | ConvertFrom-Json

Invoke-SqlChecks -Config $config -Tag MaxDataFileSize
```