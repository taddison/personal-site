---
layout: post
title: Using the SQL Infrastructure Tests repo in your environment
tags: [PowerShell, Pester, SQL]
---
>Update 2017-03-12: The [SQLChecks](https://github.com/taddison/SQLChecks) library builds on the ideas in this post and delivers an upgraded version of SQLInfrastructureTests.  [This blog post](/2017/12/03/Using-the-SQLChecks-library-for-SQL-Server-configuration-management) discusses how to use the library.

The [SQL Infrastructure Tests](https://github.com/taddison/SQLInfrastructureTests) repo is generic and knows nothing about your infrastructure.  This makes it very easy to clone and use anywhere, but also means you need to provide some configuration information to actually make it useful in your environment.  Typically you want that environment specific information to also be in source control, you might be tempted to create a fork of the repo and make customisations for your environment.

This nearly always ends in pain when you need to pull updates from the repository.  A better pattern is to create helper repositories (which would be privately version controlled).  These are where you make all your environment specific changes (your server names, etc.).  This has the added advantage of making it much harder to accidentally publish environment specific information to GitHub (say if you were to accidentally create a PR of your private fork…).

The public repo we're consuming is [SQLInfrastructureTests](https://github.com/taddison/SQLInfrastructureTests), and the private repository that we'll be using is [SQLInfrastructureTests-Helper](https://github.com/taddison/SQLInfrastructureTests-Helper).
<!--more-->
The Install.ps1 script lives in our helper and will either clone the repository (if it doesn't exist), or update it if does.

**Install.ps1**
```powershell
$repoName = "SQLInfrastructureTests"
$repoUri = "https://github.com/taddison/$repoName.git"

if(!(Test-Path -path "../$repoName")) {
    git clone $repoUri "../$repoName"
} else {
    Set-Location -Path "../$repoName"
    git pull
}
```

The RunTests.ps1 script then executes the pester tests that exist in the public repository.  Because this file lives in our private repository, you would be able to use your own server names (or pull them from a CMS), and optionally specify subsets of tests to execute against different servers.

**RunTests.ps1**
```powershell
$servers = @('localhost','.')
$repoName = "SQLInfrastructureTests"

# Run all the tests
Invoke-Pester -Script @{Path="../$repoName";Parameters= @{servers=$servers}}

# Run a single test
Invoke-Pester -Script @{Path="../$repoName";Parameters= @{servers=$servers}} `
              -TestName "*SQL Agent*"
```

The final line of the script above shows how you can use the TestName parameter of [Invoke-Pester](https://github.com/pester/Pester/wiki/Invoke-Pester) to limit the tests which are executed.  Pester also supports tagging your tests, and this can be combined with name filtering to give your even more fine grained control over what you want to execute.

The idea of using helper repos can be applied fairly generally, and is useful anywhere you want to consume an open source project (and get the latest updates easily).  I've also used this technique to have a single 'SQL Tools' repo in version control, which any developer can check out and run the install script on to get the latest version of SQL scripts & tools like the [First Responder Toolkit](https://github.com/BrentOzarULTD/SQL-Server-First-Responder-Kit).