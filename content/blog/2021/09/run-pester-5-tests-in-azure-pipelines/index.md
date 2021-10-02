---
date: "2021-09-30T00:00:00.0Z"
title: Run Pester 5 tests in Azure Pipelines
#shareimage: "./shareimage.png"
tags: [PowerShell, Pester]
# cSpell:words
# cSpell:ignore
---

```powershell
# /ci/RunTests.ps1
Import-Module Pester

Invoke-Pester -CI
```

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

If you use -CI (https://pester.dev/docs/commands/Invoke-Pester#-ci) will enable an exit code equal to the number of failed tests. We need to `ignoreLASTEXITCODE` to not stop the pipeline.

https://docs.microsoft.com/en-us/azure/devops/pipelines/tasks/utility/powershell?view=azure-devops

Demo using https://github.com/DBTrenches/tsqlscheduler/blob/master/src/tsqlScheduler/Public/Test-FolderTasks.ps1

- https://gaunacode.com/pester-test-results-on-azure-devops
- https://devopsjournal.io/blog/2021/05/25/Moving-pester-to-version-5
- https://dina-muscanell.com/blog/run-pester-using-azure-pipelines/
- https://www.jenx.si/2020/04/17/custom-git-clone-on-azure-devops-build-pipeline/
- https://docs.microsoft.com/en-us/azure/devops/pipelines/build/variables?view=azure-devops&tabs=yaml
- https://markwarneke.me/2019-08-23-Azure-DevOps-Test-Dashboard/
- https://github.com/pester/Pester/issues/1621#issuecomment-666455365
