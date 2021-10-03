---
date: "2021-09-30T00:00:00.0Z"
title: Run Pester 5 tests in Azure Pipelines and publish test results
shareimage: "./shareimage.png"
tags: [PowerShell, Pester, DevOps, Azure]
# cSpell:words
# cSpell:ignore
---

The brevity of the [Migrating from Pester v4 to v5] documentation belies just how much has changed - something that took a fair bit of trial and error for me was getting [Pester] 5 tests published in an Azure Pipelines run. Assuming you have your tests located in a `CI` folder, the script to invoke the tests should look like this:

```powershell
# /ci/RunTests.ps1
Import-Module Pester

Invoke-Pester -CI
```

Specifying `-CI` will save test results (defaulting to NUnit) in the same folder. It will also set the exit code of the process to the number of failed tests, and any non-zero exit code will abort the pipeline by default. As we want our pipeline to continue we specify `ignoreLASTEXITCODE` on the [PowerShell task], and then if there are any failed tests we abort the pipeline using the `failTaskOnFailedTests` property of the [Publish Test Results task].

```yaml
# /pipelines/azure-pipelines.yml
pool:
  vmImage: windows-2019

- task: PowerShell@2
  displayName: 'Run Pester tests'
  inputs:
    filePath: './ci/RunTests.ps1'
    ignoreLASTEXITCODE: true

- task: PublishTestResults@2
  inputs:
    testResultsFormat: 'NUnit'
    testResultsFiles: '**/Test-*.xml'
    failTaskOnFailedTests: true
    testRunTitle: 'Validate Task Files'
```

In the example code, I'm running the [Test-FolderTask] function of [tSqlScheduler], and as you can see when I break the pipeline on purpose, the tests fail 😊.

![Test Results](./testresults.png)

[migrating from pester v4 to v5]: https://pester.dev/docs/migrations/v4-to-v5
[azure pipelines]: https://azure.microsoft.com/en-us/services/devops/pipelines/
[pester]: https://pester.dev/
[powershell task]: https://docs.microsoft.com/en-us/azure/devops/pipelines/tasks/utility/powershell
[publish test results task]: https://docs.microsoft.com/en-us/azure/devops/pipelines/tasks/test/publish-test-results
[test-foldertask]: https://github.com/DBTrenches/tsqlscheduler/blob/master/src/tsqlScheduler/Public/Test-FolderTasks.ps1
[tsqlscheduler]: https://github.com/DBTrenches/tsqlscheduler
