---
layout: post
title: Changing the owner of an SSRS subscription with PowerShell
share-img: http://tjaddison.com/assets/2018/2018-01-24/Script.png
tags: [SQL, SSRS, PowerShell]
---

If you're responsible for an SSRS instance you've probably got a script somewhere to handle changing the owner of a subscription (typically done when a user leaves/changes role and they've got subscriptions that need to keep running).

The official docs do provide a [PowerShell script](https://docs.microsoft.com/en-us/sql/reporting-services/subscriptions/manage-subscription-owners-and-run-subscription-powershell#bkmk_change_all_1_subscription) you can use to do this, though it is a little inefficient if you've got any latency between you and your instance and/or you have a lot of reports (it gets all reports, and then for each one gets all subscriptions).

SSRS exposes an API which lets you get all subscriptions in one go, which is much faster.  The script below will take all subscriptions owned by Tim and assign them to Tom.

```powershell
$oldOwner = "foocorp\tim.addison"
$newOwner = "foocorp\tom.addison"

$rs2010 = New-WebServiceProxy -Uri "http://localhost/ReportServer/ReportService2010.asmx" -Namespace SSRS.ReportingService2010 -UseDefaultCredential

$subsToMove = $rs2010.ListSubscriptions("/") | Where-Object { $_.Owner -like $oldOwner }

$subsToMove | ForEach-Object { $rs2010.ChangeSubscriptionOwner($_.SubscriptionID, $newOwner) }
$subsToMove | Select-Object Path, Report | Format-Table
```

>You'll need to update the Uri in the above example if your report server is anywhere other than localhost.

The script will also output the list of subscriptions that have been modified.
<!--more-->
Since late 2016 there has been a [PowerShell module](https://www.powershellgallery.com/packages/ReportingServicesTools) available that has started to provide a comprehensive set of SSRS administration functions, though at the time of writing it has the same items-then-subscriptions pattern which makes it much slower than the above script.

Finally, it's worth noting that if you only manage a small number of instances (or perhaps you're just more comfortable in T-SQL) there is [a simple script](https://blogs.msdn.microsoft.com/miah/2008/07/10/tip-change-the-owner-of-sql-reporting-services-subscription/) that has been around since at least 2008 that lets you do this.

*Big thanks to Jim for nudging me in the PowerShell direction on this one - what a fantastic little cmdlet New-WebServiceProxy is!*