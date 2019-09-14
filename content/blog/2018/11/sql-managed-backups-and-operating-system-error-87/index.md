---
layout: post
title: SQL Managed Backups and Operating System Error 87
share-img: https://tjaddison.com/assets/2018/2018-11-03/SQLManagedBackup.png
tags: [SQL, Azure]
---

We use [SQL Managed backups] for our on-premises SQL Servers, and have been very impressed with it (from a speed, management, and cost perspective).  Shortly after deploying the solution though the SQL error logs started to log errors when attempting to read managed backups:

```
BackupIoRequest::ReportIoError: read failure on backup device
'https://allthebackups.blob.core.windows.net/ServerOne/LongFileName.log'.
Operating system error 87(The parameter is incorrect.).
```

Nothing suggested there were any issues - backups were still being taken, our backup chain wasn't broken (restores were fine) - but this error was being logged all the time.

Understanding where the error came from and how to fix it required a better understanding of exactly how managed backup works.
<!--more-->

## How does managed backup know what backups are available?

> The backip in question was from an availability group - the replica the backup runs from frequently changes, but managed backup (via msdb) always has a full list of available backups for the database.

This doesn't appear to be documented anywhere, but we were able (through a combination of reasoning and monitoring) to establish the following set of operations happens to maintain the list of 'what backups exist for this database':

- Managed backup gets a list of files in the target container
- Managed backup performs a [restore headeronly] on each file, to get metadata about that file
- Managed backup uses this information to determine what it needs to do (delete old backups, create a new full backup, create a transaction log backup)

## Why do we get operating system error 87?

After downloading the file that was generating the error and attempting to restore it, we realised the backup was corrupt.  The file size tipped us off to the fact this was probably a partially complete backup (kilobytes rather than megabytes).  We were able to generate our own 'corrupt' backups by killing an in-flight backup operation, which generated a partial (and corrupt) backup in blob storage.

Although managed backup will delete backups that are outside of the retention period, in the case of a corrupt backup it has no idea what database it belongs to, nor how old it is.  As such it won't delete the file, and it'll sit there in the blob storage container forever.

The key thing we came to understand is that there is no central on-premises list of 'what backups I have taken', and that each instance/replica is responsible for interrogating Azure storage to establish what files exist.

> This behavious is actually a pretty neat feature - unlike relying on information in msdb for prior backups (which could have been deleted, corrupted, etc.) managed backup actually interrogates the backup target to determine what is there.

## How do I fix it?

The fix is to delete the corrupted backup file from Azure storage.  We currently do this manually (as it happens so rarely) but it could be automated to react to the message in the SQL error log.  In the future something like [automated storage lifecycle management] would allow us to set a policy to automatically delete blobs that exceed our maximum retention period, meaning this error would auto-heal after the retention period.

The root cause of the corrupt backup for us was a (planned!) failover.  It's also feasible a network blip could terminate an in-progress backup, or perhaps good old-fashioned storage corruption (which is something we really would care about, especially if every backup became corrupt).

Outside of some rather sparse documentation (if we'd known how managed backup worked we'd have figured this out a lot faster) managed backup is something we've been really impressed with - so if you're hitting this scenario you now know how to fix it.

>A big thanks to my colleague Jose for getting to the bottom of this one

[SQL managed backups]: https://docs.microsoft.com/en-us/sql/relational-databases/backup-restore/sql-server-managed-backup-to-microsoft-azure
[restore headeronly]: https://docs.microsoft.com/en-us/sql/t-sql/statements/restore-statements-headeronly-transact-sql
[automated storage lifecycle management]: https://docs.microsoft.com/en-us/azure/storage/common/storage-lifecycle-managment-concepts