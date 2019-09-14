---
layout: post
title: Keeping Application Insights Costs Under Control
share-img: https://tjaddison.com/assets/2019/2019-05-31/AppInsightsDefaultCap.png
tags: [Azure, Application Insights, PowerShell]
---

Application Insights (now part of [Azure Monitor]) uses a [pay-per-GB-ingested model][AppInsights Pricing], and charges $2.30 per-GB once you exceed the monthly free limit of 5GB.  It may surprise you (it certainly surprised me!) to see that by default an Application Insights resource doesn't deploy with a daily cap of 0.161GB (5GB/month), but actually deploys with a [daily cap][AppInsights Cap Management] of 100GB!

![Application Insights default cap](/assets/2019/2019-05-31/DailyCap.png)

Left unchecked each resource like this could end up costing you a cool **$7,118.50 per month**.

In order to vet your estate and bring it under control, the PowerShell script below will check every Application Insights resource you have deployed against a limit you set, and optionally reduce anything exceeding that limit to a more reasonable cap.

![Lower that daily cap](/assets/2019/2019-05-31/AppInsightsDefaultCap.png)

In the above example I ran the script against a newly deployed resource, configured to reduce anything with a cap greater than 10GB down to 1GB.

<!--more-->

## Script Details

The script has three different configuration options:

- `$CAP_CUTOFF` - the daily GB cap at which to take action - any resources beyond this will be capped to the `$CAP_TO` value
- `$CAP_TO` - the daily limit to set for anything exceeding the `$CAP_CUTOFF` value
- `$ignoreResources` - An array of resources to ignore.  These resources will appear in the report, but no action will be taken

> If you don't want the script to make any changes to your environment append `-WhatIf` to the `Set-AzApplicationInsightsDailyCap` command, or comment it out entirely

Once the script executes you'll be asked to authenticate to Azure, and it will then enumerate all subscriptions and all Application Insights resources in those subscriptions.

Once complete the script will report a list of all actions (either Ignore, Under Cap, or Reduce To X) for each resource it encountered.  The example below shows this running against an environment where there is a single resource ignored, and then others are all under the cap - in this case set to 10GB.

![Script results](/assets/2019/2019-05-31/AppInsightsResults.png)

## The Script

```powershell
Import-Module Az
Connect-AzAccount

$CAP_CUTOFF = 10 ## Free tier = 0.161 - 5GB/month
$CAP_TO = 1
$ignoreResources = @("Subscription.Resource Group.Resource")

$subscriptions = Get-AzSubscription

$actions = @()
foreach($sub in $subscriptions) {
    $subscriptionName = $sub.Name
    $sub | Set-AzContext

    $appInsightResources = Get-AzApplicationInsights

    $aiResources = @()
    foreach($ai in $appInsightResources) {
        $aiResources += Get-AzApplicationInsights -ResourceGroupName $ai.ResourceGroupName -Name $ai.Name -IncludeDailyCap
    }

    foreach($ai in $aiResources) {
        $identifier = "$($subscriptionName).$($ai.ResourceGroupName).$($ai.Name)"

        if($ai.Cap -gt $CAP_CUTOFF) {
            if($ignoreResources -contains $identifier) {
                $action = "Ignore"
            } else {
                $action = "Reduce to $CAP_TO"
                Set-AzApplicationInsightsDailyCap -ResourceGroupName $ai.ResourceGroupName -Name $ai.Name -DailyCapGB $CAP_TO
            }
        } else {
            $action = "Below $CAP_CUTOFF"
        }
        
        $actions += [PSCustomObject]@{
            Subscription = $subscriptionName
            ResourceGroup = $ai.ResourceGroupName
            ResourceName = $ai.Name
            Cap = $ai.Cap
            MonthlyCost = (($ai.Cap * 31) - 5) * 2.3
            Action = $action
        }
    }
}

$actions | Sort-Object -Property MonthlyCost -Descending | Format-Table
```

I hope this script helps you keep your Application Insights spend under control!

[Azure Monitor]: https://docs.microsoft.com/en-us/azure/azure-monitor/overview
[AppInsights Pricing]: https://azure.microsoft.com/en-us/pricing/details/monitor/
[AppInsights Cap Management]: https://docs.microsoft.com/en-us/azure/azure-monitor/app/pricing