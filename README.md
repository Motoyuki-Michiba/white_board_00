# Mail Scheduler

Power Platform solution for scheduling email delivery from `michiba.motoyuki@shimz.biz`.

## Deployed foundation

- Environment: **Estimation Dev** (`https://org0e46434e.crm7.dynamics.com/`)
- Solution: `MailSchedulerSolution`
- Dataverse table: `mtl_scheduledemail` (Scheduled Email)
- Single attachment: `mtl_attachment`, maximum 10 MB

| App field | Dataverse column |
| --- | --- |
| Email name | `mtl_name` |
| To | `mtl_torecipients` |
| CC | `mtl_ccrecipients` |
| BCC | `mtl_bccrecipients` |
| Subject | `mtl_subject` |
| Message body | `mtl_body` |
| Send at | `mtl_scheduledfor` |
| Status | `mtl_status` |
| Attachment | `mtl_attachment` |
| Error detail | `mtl_errormessage` |

## Canvas App

Create a blank Canvas App called **Mail Scheduler** in `MailSchedulerSolution`, add the `Scheduled Emails` Dataverse table, and create an edit screen containing the first nine fields in the table above. Use `TextInput` controls for recipients, subject, and body; a date picker and time dropdown for `Send at`; and an attachment/file control bound to `mtl_attachment`.

Save button formula, after binding controls to the form:

```powerfx
SubmitForm(frmScheduledEmail);
Notify("Email scheduled.", NotificationType.Success);
Back()
```

Set the default value of the Status data card to:

```powerfx
"Scheduled"
```

The browse gallery should filter out completed mail by default:

```powerfx
Filter('Scheduled Emails', mtl_status <> "Sent")
```

## Cloud flow: Send due scheduled emails

Create an automated cloud flow in the same solution named **Send due scheduled emails**.

1. Trigger: **Recurrence**, every 1 minute, time zone `Singapore Standard Time`.
2. Dataverse **List rows** from `Scheduled Emails`, with Filter rows:

   ```text
   mtl_status eq 'Scheduled' and mtl_scheduledfor le @{utcNow()}
   ```

3. For each result, immediately update Status to `Sending`. This is the send lock and prevents a second recurrence from delivering the same item.
4. Use **Download a file or an image** for `mtl_attachment` when an attachment exists.
5. Use **Office 365 Outlook – Send an email (V2)**:
   - To: `mtl_torecipients`
   - CC: `mtl_ccrecipients`
   - BCC: `mtl_bccrecipients`
   - Subject: `mtl_subject`
   - Body: `mtl_body`
   - Is HTML: Yes
   - Attachment Name: `mtl_attachment_name`
   - Attachment Content: file content from step 4
6. On success, update Status to `Sent` and clear Error detail.
7. Configure a **run-after** branch for failure; update Status to `Failed` and set Error detail to the failed action's message.

Do not add an automatic retry for failed messages until the first production test is complete; a mail provider can accept a message but return an ambiguous failure, which could cause a duplicate email.

## Security and operating guardrails

- The Outlook connection must be owned by Mike's Shimizu Microsoft 365 account.
- Start with a test recipient and a send time at least five minutes ahead.
- Restrict table access to the people who are allowed to send mail as this account.
- The first release supports one attachment per scheduled email. Multiple attachments can be added later with a child `Email Attachment` table.
