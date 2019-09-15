create database TemporalBroker;
go
use TemporalBroker;
go
alter database current set recovery simple;
alter database current set enable_broker;
create master key encryption by password = 'secure';
go
create table dbo.Payment
(
	PaymentId int identity( 1, 1 ) not null
	,PaymentStateId tinyint not null
	,SysStartTime datetime2 generated always as row start not null
	,SysEndTime datetime2 generated always as row end not null
	,period for system_time ( SysStartTime, SysEndTime )
	,constraint PK_Payment primary key clustered ( PaymentId )
)
with 
( 
	system_versioning = on ( history_table = dbo.PaymentHistory ) 
);
go
create queue dbo.PaymentQueue;
create message type ProcessPayment validation = well_formed_xml;
create contract PaymentContract ( ProcessPayment sent by any );
create service PaymentProcessService on queue dbo.PaymentQueue ( PaymentContract );
go
create or alter procedure dbo.RequestPayment
as
begin
	insert into dbo.Payment
	( PaymentStateId )
	values
	( 1 );

	declare @paymentId int = scope_identity();
	declare @message xml = N'<ProcessPayment><PaymentId>' + cast( @paymentId as nvarchar(10) ) + '</PaymentId></ProcessPayment>'
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
go
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
go