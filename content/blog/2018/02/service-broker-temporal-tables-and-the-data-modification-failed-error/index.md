---
layout: post
title: Service Broker, Temporal Tables, and the 'Data modification failed' error
share-img: http://tjaddison.com/assets/2018/2018-02-17/ErrorSlug.png
tags: [SQL, "Service Broker", "Temporal Tables"]
---

[Temporal tables](https://docs.microsoft.com/en-us/sql/relational-databases/tables/temporal-tables) are a fantastic feature which we've enjoyed rolling out to replace some hand-rolled logging.  Adding system versioning to a table has been mostly straightforward, though last week one of my colleagues saw some really odd behaviour that took the team a while to debug.  Now we've understood the problem we're able to reproduce it 100% of the time (and subsequently come up with a workaround), though it definitely had us scratching our heads for a while - thanks for a super-interesting problem Ola!

We've previously had experience with highly concurrent modifications to a single row causing a data-modification error, and in every case we'd end up tracking down a bug which was causing unnecessary concurrent modifications.

```
Msg 13535, Level 16, State 0, Procedure HandleProcessPayment, Line 20 [Batch Start Line 0]
Data modification failed on system-versioned table 'TemporalBroker.dbo.Payment' because transaction time was earlier than period start time for affected records.
```

What had us really confused this time was that this was a very low-volume process, and we didn't observe any concurrency around the insert/update activity for the single row (confirmed with exhaustive XEvent-ing!).

## The Setup
One of our applications uses service broker fairly heavily, the simplified flow looks something like this:

- Web app inserts a payment record in state 'ready to pay'
- Web app queues a message on service broker with the instruction to pay
- Payments app is listening on that queue for instructions
- Payments app receives the message in a transaction
- Payments app requests a payment
- Payments app updates the status of the payment to 'requested'
- Payments app commits the transaction

After implementing system versioning on the table we started to see errors on the step which updated the payment.

The transactional flow (shown by time T, and session S - in this case session 1 is the payments app, session 2 is the web app) looks something like this:

- T1, S1 - Begin Tran
- T2, S1 - [Waitfor receive](https://docs.microsoft.com/en-us/sql/t-sql/statements/receive-transact-sql)...
- T3, S2 - Insert Payment
- T4, S2 - Queue PaymentProcess message
- T4, S1 - Receive PaymentProcess message
- T5, S1 - Update Payment - error

The clue was sitting in the error message -  `transaction time was earlier than period start time for affected records`.  At time T5 when the update happens the row is stamped with the time from T1, not T5.  Because we use a transaction to pop messages and wait for one to arrive, we can end up processing the message at a timestamp before the Payment record is inserted.  This behaviour is by design - and is called out pretty clearly in the [official docs](https://docs.microsoft.com/en-us/sql/relational-databases/tables/temporal-tables#how-does-temporal-work):

> The times recorded in the system datetime2 columns are based on the begin time of the transaction itself. For example, all rows inserted within a single transaction will have the same UTC time recorded in the column corresponding to the start of the SYSTEM_TIME period.

As well as in the [ISO technical report on SQL Support for Time-Related Information](http://standards.iso.org/ittf/PubliclyAvailableStandards/c060394_ISO_IEC_TR_19075-2_2015.zip):

>An UPDATE statement on a system-versioned table first inserts a copy of the old row with its system-time period end time set to the transaction timestamp, indicating that the row ceased to be current as of the transaction timestamp. It then updates the row while changing its system-period start time to the transaction timestamp, indicating that the updated row to be the current system row as of the transaction timestamp.

In all of our previous troubleshooting we were dealing with very short (typically implicit) transactions, and so we were incorrectly thinking about concurrency at the statement level, rather than the transaction level.

## Repro
>If you'd like to try this repro out yourself you can download [this script](/assets/2018/2018-02-17/createobjects.sql) to create the database and all objects required.

The two procedures we'll be looking at are the one which inserts the payment request:

```sql
create or alter procedure dbo.RequestPayment
as
begin
	insert into dbo.Payment
	( PaymentStateId )
	values
	( 1 );

	declare @paymentId int = scope_identity();
	declare @message xml = 
            N'<ProcessPayment><PaymentId>' 
            + cast( @paymentId as nvarchar(10) ) 
            + '</PaymentId></ProcessPayment>'
	declare @dialogId uniqueidentifier;
	
	begin dialog @dialogId
	from service PaymentProcessService
	to service 'PaymentProcessService'
	on contract PaymentContract
	with encryption = off;

	send on conversation @dialogId
	message type ProcessPayment
	( @message );
end
```

And the procedure which processes the payment:

```sql
create or alter procedure dbo.HandleProcessPayment
as
begin
	set nocount on;
	declare @message xml;

	begin tran;
		waitfor (
			receive top(1) @message = message_body
			from dbo.PaymentQueue
		), timeout 10000;

		if @message is null
		begin
			commit;
			return;
		end

		declare @paymentId int = @message.value('(/ProcessPayment/PaymentId)[1]','int');

		update dbo.Payment
			set PaymentStateId = 2
		where PaymentId = @paymentId;
	commit;
end
```

In this trivialised example the procedure does all the work, in the actual environment there was a single transaction and multiple commands executed (as well as the third-party calls to actually initiate a payment!).

To reproduce the error, execute `dbo.HandleProcessPayment` in one session (which will wait up to 10 seconds for a message to arrive), and then run `dbo.RequestPayment` in another session - you'll see the HandleProcessPayment procedure error out.

## Workarounds

Depending on what you can change there are a few ways to work around this that can work:

- Remove the timeout from the waitfor (if there is no sleep in the application you'll end up calling this a lot)
- Remove the timeout from the waitfor and add a sleep (this increases average time to respond to a message)
- Add a wait between inserting the Payment and sending the message (this also increases average time to respond)
- Retry on receiving the error (in our case we hit this edge case 100% of the time on the first attempt to process)
- Don't use system versioning (a trigger based solution with getutcdate() doesn't have this problem)

None of these are great options (in the end we lowered the waitfor timeout to a few hundred milliseconds and added the same delay before queueing the message - this eliminated all the errors), and we'll be considering what changes we could make to our messaging in the future to remove the requirement for a workaround.  The current favoured option is a switch away from service broker where we don't need all the complexity and polling from the app.