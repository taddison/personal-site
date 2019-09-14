---
layout: post
title: Auto deflating Event Hubs with a function app
share-img: http://tjaddison.com/assets/2017/2017-12-10/FunctionOutput.png
tags: [Azure, EventHubs, C#, Function Apps]
---
EventHubs have supported [auto-inflate/scale-up](https://docs.microsoft.com/en-us/azure/event-hubs/event-hubs-auto-inflate) for a while now, but don't come with an equivalent to auto deflate/scale-down.  If your workload doesn't have sustained throughput requirements you'll probably benefit from periodically scaling back.

Assuming you allow your hub to inflate to 10 throughput units but most of the time you only need 1, at current pricing that represents an overpayment of $0.27/hour, or $2,300/year.  Over multiple hubs (don't forget your dev/test instances!) it quickly adds up.

Doing this manually is possible (and right now the [comments on the auto-inflate article](https://docs.microsoft.com/en-us/azure/event-hubs/event-hubs-auto-inflate) suggest this is the way to go), though we can build and deploy a simple function app to take care of all of our eventhubs periodically.  The great thing about auto-inflate is that if we do scale back and the workload needs more throughput, it'll scale right back up again.

![Namespace configuration](/assets/2017/2017-12-10/AutoInflate.png)

*Where is the auto deflate checkbox?*

<!--more-->

## Pre-requisites

In order to deploy the solution we'll need:

- Visual Studio 2017 with Azure Development workload (Community edition is fine)
- A app service to deploy a function app to
- A service principal which has owner permissions on the resource group(s) containing the namespaces we want to scale down
- Details of your tenant, subscription, and resource group(s)

### Function App

The [Azure documentation](https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-first-azure-function) will take you through creating a function app if you don't already have one (which will create the required app service).

Once the function app is created grab the values for **AzureWebJobsStorage** and **AzureWebJobsDashboard** from the application settings (they're both the same value).  These are needed for you to test your function locally.

![Configuration details](/assets/2017/2017-12-10/FunctionAppApplicationSettings.png)

### Service Principal

To create the service principal we're going to use [Azure Powershell](https://docs.microsoft.com/en-us/powershell/azure/create-azure-service-principal-azureps?view=azurermps-5.0.0), though you can also use the Azure portal.

The script below has been adapted from the [Azure authentication for dotnet SDK article](https://docs.microsoft.com/en-us/dotnet/azure/dotnet-sdk-azure-authenticate).

>We're granting ourselves the right to modify a single resource group in the example below - if you want the app to modify Event Hub namespaces in multiple resource groups you need to grant the 'Scaler' app Owner rights on each resource group

```powershell
$subscriptionName = "<your subscription name>"
$appDisplayName = "Scaler" # This can be anything you want
$appPassword = "<a strong password for your app>"

$resourceGroupName = "<resource group containing your eventhub>"

Login-AzureRmAccount # You'll be prompted to login
Select-AzureRmSubscription -SubscriptionName $subscriptionName

$sp = New-AzureRmADServicePrincipal -DisplayName $appDisplayName -Password $appPassword
New-AzureRmRoleAssignment -ServicePrincipalName $sp.ApplicationId -RoleDefinitionName Owner -ResourceGroupName $resourceGroupName

$sp | Select DisplayName, ApplicationId # You'll need the ApplicationId later
```

While you're connected you can use the following command to get the values you need for TentantId and SubscriptionId:

```powershell
Get-AzureRmSubscription | Select-Object SubscriptionId, TenantId, SubscriptionName
```

## Configuring the app for local testing

Clone the application from the [ScaleDownEventHubs repository](https://github.com/taddison/ScaleDownEventHubs/tree/aedbb76b40c0acd9a5a9bb952280f4d6e614093e) on GitHub.

Once cloned modify your *local.settings.json* file to look like the example file, using the values you acquired in the previous steps.

Your **ClientId** is the ApplicationId, and the **ClientSecret** is the password you used.

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "<your connection string>",
    "AzureWebJobsDashboard": "<your connection string>",
    "ClientId": "<your client id>",
    "ClientSecret": "<your client secret>",
    "TenantId": "<your tenant id>"
  }
}
```

You can now add one or more eventhub namespaces to the function (in *ScaleDown.cs*).

```csharp
var namespaces = new List<EventhubNamespace>
{
    new EventhubNamespace("<subscription id>", "<resource group>", "<namespace>", 1)
};
```

When the function runs it will use the credentials from your *local.settings.json* file to compare each namespace against the target capacity (the last argument - 1 in the example above), and if the namespace has a higher throughput it will reduce it.

>In the portal you'll see reference to Throughput or Throughput Units - in the SDK this is captured by the Capacity property.  For more information on the library we're using to manage the Event Hubs you can read the [Event Hubs management libraries](https://docs.microsoft.com/en-us/azure/event-hubs/event-hubs-management-libraries) documentation.

To test this without making any changes you can comment out the update line, or set the capacity numbers to 20 (if the target capacity is higher than the current capacity it will not attempt to scale up - that is what auto-inflate is for!).

By default the function is set to run once a day at 01:30.  For testing purposes you'll probably want to change it to run every minute.

```csharp
// Default - daily at 01:30
public static void Run([TimerTrigger("0 30 1 * * *")]TimerInfo myTimer, TraceWriter log)

// For testing - every minute
public static void Run([TimerTrigger("* */1 * * * *")]TimerInfo myTimer, TraceWriter log)
```

For more examples of how to specify the frequency see the [timer documentation](https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-timer).

If you run the example locally you should see output similar to the below, where we can see our namespace is currently at 5 Throughput units, so we take no action (as the target was 20).

![Function app output](/assets/2017/2017-12-10/FunctionOutput.png)

## Deploying the app

Publishing the app from Visual Studio will only deploy the function - by default the settings won't get deployed.  You can either use the function CLI to deploy your settings, or add them in the portal.  The portal will already have the storage account settings, so the key settings you need to add are **ClientId**, **TenantId** and **ClientSecret**.

Once published the app will start executing on the timer you have specified.

You can monitor execution through the function app logs, Application Insights (if you add the [required integration](https://docs.microsoft.com/en-us/azure/azure-functions/functions-monitoring)),  or the [Azure activity log](https://docs.microsoft.com/en-us/azure/monitoring-and-diagnostics/monitoring-overview-activity-logs).  Every time the capacity of the namespace is changed there will be entries in the operational logs.