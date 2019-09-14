---
layout: post
title: Cleaning up database mail profiles and accounts
share-img: http://tjaddison.com/assets/2018/2018-04-24/mailboxes.jpg
tags: [SQL, "Database Mail"]
---

You know that dev server you've got lying around that has about half a dozen database mail profiles on?  Maybe one account for every provider you've tested?  Or maybe it's even a production server that has had its profile faithfully updated to a new account each time your SMTP server moves but never had the old ones cleared out?

After recently moving all of our servers to use SendGrid SMTP for sending out database mail I decided to perform some long overdue spring cleaning.  In our case that included a couple of dev servers, as well as a production server from which you could divine the history of the company from the various database mail profiles and accounts it had.

>Your servers might have a legitimate reason to contain multiple mail profiles/accounts, so only run the below script on a server if you are sure you want to remove every account/profile except the default.

```sql
declare @defaultProfileId int;
select @defaultProfileId = pp.profile_id
from dbo.sysmail_principalprofile as pp
where pp.principal_sid = 0x0 /* Guest */
and pp.is_default = 1;

if @defaultProfileId is null
begin
	;throw 50000, 'No default profile set', 1;
	return;
end

/* Delete non-default profiles and their account mappings */
delete from dbo.sysmail_profileaccount where profile_id <> @defaultProfileId;
delete from dbo.sysmail_profile where profile_id <> @defaultProfileId;

/* Remove orphaned accounts */
with cte as (
	select a.account_id
	from dbo.sysmail_account as a
	where not exists (
		select *
		from dbo.sysmail_profileaccount as pa
		where pa.account_id = a.account_id
	)
)
delete from cte;
```

For an example script which configures the default profile and account to use a SendGrid SMTP profile, see [this gist](https://gist.github.com/taddison/bad62ea292a395b1e86f967dd265f04f).  Plug in in your SendGrid [API key](https://sendgrid.com/docs/Classroom/Send/How_Emails_Are_Sent/api_keys.html)) and you're good to go.