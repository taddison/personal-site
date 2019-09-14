---
layout: post
title: Auto scale down all Event Hub namespaces with Azure Functions
share-img: https://tjaddison.com/assets/2019/2019-02-28/CodeSnippet.png
tags: [Azure, EventHubs, C#, PowerShell, Function Apps]
---

A little over a year ago I lamented the lack of an auto-deflate feature for Event Hubs, and offered a way to [programatically scale down your namespaces][ScaleDown Blog].  That solution still works, but requires a redeploy each time you wanted to add a namespace.  Today we'll look at an upgraded function app which  programatically discovers and scales-down all Event Hub namespaces it has access to.

With the addition of a PowerShell script to grant the appropriate permissions to all of your namespaces, you can be up and running (or deflating) in a matter of minutes.

<!--more-->
## Function App

The source code for the function app can be found on GitHub in the [ScaleDownEventHubs repo].  This is an Azure Functions v2 app which is by default configured to run every six hours.  When executed the function will:

- Discover all Event Hub namespaces it has access to
- Query each namespace to check if auto-inflate is enabled
  - If auto-inflate is disabled it skips this namespace (assume that the throughput units should be static)
- Query each namespace for a tag called `ScaleDownTUs`
  - If this tag is present the value is used as the target to scale down to, if it is not present then the default is 1
- Compare the current capacity (Throughput Units) to the target, and if the capacity is higher than the target then reduce the capacity

In order to _function_ (no pun intended!) the app requires the following three variables to be available - this would typically be in the form of an application setting:

```csharp
var clientId = config["ClientId"];
var clientSecret = config["ClientSecret"];
var tenantId = config["TenantId"];
```

`TenantId` is your Azure Active Directory tenant.  The other values come from the service principal you use to run the app, which we'll create in the next section.

![App settings after deployment](/assets/2019/2019-02-28/AppSettingsFunctionApp.png)

> Note that the function does quite a lot of logging - if you configure Application Insights for your function app you'll be able to monitor what your function gets up to over time

## Service Principal

The script below will create a [service principal] - this is what we'll be granting permissions to so that it can perform operations on our Event Hub namespaces.

```powershell
Login-AzAccount

$sp = New-AzADServicePrincipal -DisplayName "EventHubScaler"
$applicationId = $sp.ApplicationId

$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($sp.Secret)
$password = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
[Runtime.InteropServices.Marshal]::ZeroFreeBSTR($BSTR)

Write-Output "ClientId: $applicationId"
Write-Output "ClientSecret: $password"
```

If you set the `ClientId` and `ClientSecret` application settings you'll now be able to run your function app.  If you want to test locally you can put these into a file called `local.settings.json` - an example is included in the function's git repo (`local.settings.json.example`).

> Note when testing locally you'll want to change the cron string of the `TimerTrigger` to something more frequent than every six hours - using 0 */1 * * * will have the function run every minute.

## Permissions

By default the new service principal has no permissions.  In order to let it do something useful we're going to assign it `Contributor` permissions on all namespaces we have access to.

The below script looks pretty daunting, though by default it will do nothing as `$WhatIf` is set to `$true` - when running the script it will echo what it *would* do.  If there is no work to do it will echo the status of each Event Hub namespace it discovers, as shown in the screenshot below.  When you're ready to add permissions set `$WhatIf` to `$false`.

> This script will only assign the service principal to namespaces which have auto-inflate set to true.

![App settings after deployment](/assets/2019/2019-02-28/AssignPowerShell.png)

```powershell
Login-AzAccount

$appName = "EventHubScaler"
$appRole = "Contributor"
$WhatIf = $true # set to false to add role

$applicationId = (Get-AzADServicePrincipal -DisplayName $appName).ApplicationId
$subs = Get-AzSubscription
foreach($sub in $subs) {
    Set-AzContext $sub | Out-Null
    Write-Output "Context set to $($sub.Name)"

    $hubs = Get-AzEventHubNamespace
    foreach($hub in $hubs) {
        $hubName = $hub.Name
        $capacity = $hub.Sku.Capacity
        $autoInflate = $hub.IsAutoInflateEnabled
        $maxCapacity = $hub.MaximumThroughputUnits

        $assignments = Get-AzRoleAssignment -Scope $hub.Id `
            -RoleDefinitionName $appRole `
            -ServicePrincipalName $applicationId

        if($null -eq $assignments) {
            $assignString = ""
        } else {
            $assignString = "[$appName ASSIGNED]"
        }
        
        if($autoInflate) {
            Write-Output "Namespace:$hubName :: TU:$capacity/$maxCapacity $scaleDownTUs $assignString"

            if($null -eq $assignments) {
                if($WhatIf -eq $false) {
                    Write-Output "Adding $appRole role for $appName on $hubName"
                    New-AzRoleAssignment -Scope $hub.Id `
                        -RoleDefinitionName $appRole `
                        -ApplicationId $applicationId | Out-Null
                } else {
                    Write-Output "[WHATIF] Adding $appRole role for $appName on $hubName"
                }
            }
        } else {
            Write-Output "Namespace:$hubName :: TU:$capacity $assignString"
        }
    }
}
```

## Conclusion

If you deployed Application Insights you'll be able to see what your scaler is up to over time with a query like this:

```kql
traces
| where message startswith "Updating"
| parse message with "Updating Namespace:" namespace:string "in RG:" resourcegroup:string "from:" fromTU:int  "to:" toTU:int
| extend Op = "ScaleDown"
| union (
traces
| where message startswith "Namespace:" 
| extend Op = ""
| parse message with "Namespace:" namespace:string "in RG:" resourcegroup:string "already at or below target capacity (Current:" fromTU:int  "Target:" toTU:int *
)
| order by timestamp desc
| project timestamp, Op, resourcegroup, namespace, fromTU, toTU 
```

One example result set is shown below - this shows multiple namespaces surviving the scaler unscathed (unscaled?), and a couple which were scaled-in.  You can also see that there a few namespaces which don't scale down to 1 - these have `ScaleDownTUs` set on them.

![Scaler query result](/assets/2019/2019-02-28/ScaleDownQuery.png)

[ScaleDown Blog]: https://tjaddison.com/2017/12/10/Auto-deflating-Event-Hubs-with-a-function-app
[ScaleDownEventHubs repo]: https://github.com/taddison/ScaleDownEventHubs
[service principal]: https://docs.microsoft.com/en-us/azure/active-directory/develop/app-objects-and-service-principals