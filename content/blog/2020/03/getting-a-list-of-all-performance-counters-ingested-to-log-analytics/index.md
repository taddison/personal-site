---
title: Getting a list of all performance counters ingested to Log Analytics
shareimage: "./results.png"
tags: [PowerShell, Log Analytics]
date: "2020-03-31T00:00:00.0Z"
---

Log Analytics is a great product - easy to get data ingested, and easy to query it.  With the power to easily ingest data, comes the power to easily...run up a pretty sizeable bill.  It's a good habit to regularly review what makes up the overall ingestion, which I typically do with the following query on a per-workspace basis:

```kql
Usage
| where TimeGenerated > ago(30d)
| where IsBillable == true
| summarize TotalVolumeGB = sum(Quantity) / pow(1024, 3) by Solution, DataType
| order by TotalVolumeGB desc
```

You'll get to know which solutions are data heavy pretty fast (I'm looking at you WireData and DNSAnalytics).  Something I've recently spent some time on is performance counters - after the `Perf` data type crept to the top of the list, so I drilled into that with the `_BilledSize` property:

```kql
Perf
| where TimeGenerated > ago(30d)
| summarize TotalVolumeGB = sum(_BilledSize) / pow(1024, 3) by ObjectName, CounterName // Computer
| order by TotalVolumeGB desc
```

Doing this on a couple of workspaces revealed a fair amount of overlap - my suspicion was that we were ingesting the same counters in multiple workspaces.  The following script will dump all counters ingested to any workspace, along with their instance and frequency.  A reliable way to really drive up your ingestion costs are the `Process/% Processor Time` counter ingested for every instance (`*`) at a frequency of 10 seconds.

We got rid of that one pretty fast.

```powershell
Import-Module Az

Connect-AzAccount

$allPerfCounters = @()

$subscriptions = Get-AzSubscription
foreach ($subscription in $subscriptions) {
  $subscription | Set-AzContext

  $workspaces = Get-AzOperationalInsightsWorkspace

  foreach ($workspace in $workspaces) {

    $perfCounters = Get-AzOperationalInsightsDataSource -Kind WindowsPerformanceCounter -Workspace $workspace

    foreach ($counter in $perfCounters) {
      $allPerfCounters += [pscustomobject]@{
        Subscription  = $subscription.Name
        ResourceGroup = $counter.ResourceGroupName
        Workspace     = $counter.WorkspaceName
        ObjectName    = $counter.Properties.ObjectName
        InstanceName  = $counter.Properties.InstanceName
        CounterName   = $counter.Properties.CounterName
        Interval      = $counter.Properties.IntervalSeconds
      }
    }
  }
}
$allPerfCounters | Format-Table
```

![Example Results](./results.png)

Along with a bit of Excel and the results from the earlier queries, it was easy to work through the list and cut down on ingestion costs.