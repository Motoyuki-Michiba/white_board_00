# White Board 00

Power Platform application for sharing timely information within the Estimation team.

## Current delivery scope

The first release will be a solution-aware Canvas App backed by Dataverse. It will let authorised team members create, find, read, update, and archive internal posts.

### Initial post fields

| User-facing field | Planned schema name | Purpose |
| --- | --- | --- |
| Title | `mtl_title` | Short, required summary of the information. |
| Message | `mtl_message` | Required rich-text post content. |
| Category | `mtl_category` | `General`, `Tender`, `Project`, `Meeting`, or `Reference`. |
| Priority | `mtl_priority` | `Normal`, `Important`, or `Urgent`. |
| Pinned | `mtl_ispinned` | Keeps important posts at the top of the board. |
| Publish from | `mtl_publishfrom` | Optional date/time when a post becomes visible. |
| Expires on | `mtl_expireson` | Optional date/time after which a post is hidden from the default board. |
| Status | `mtl_status` | `Draft`, `Published`, or `Archived`. |
| Attachment | `mtl_attachment` | Optional supporting file; file-size limit to be confirmed. |

The Dataverse table will be named `mtl_whiteboardpost` (`White Board Post`) and use user/team ownership. Dataverse-created fields provide the author and audit timestamps.

## Canvas app behaviour

- **Board:** Shows published, non-expired posts, ordered by pinned status then newest first. Users can search title/message and filter category and priority.
- **Post details:** Shows the full message and attachment.
- **Create/edit:** Authors can save a draft, publish, or archive their own post. Team administrators can moderate all posts once security roles are configured.
- **Speech-to-text:** Planned as an optional message-entry aid after IT approves Azure AI Speech. Users will review and edit the recognised text before saving.

## Security and operation

- Access is restricted to authorised Estimation team members using Dataverse privileges; hidden controls alone do not provide security.
- No external sharing, email sending, or production deployment is in scope for this initial release.
- The app and table must be built inside `WhiteBoard00Solution` with publisher prefix `mtl`.

## Acceptance test for the first release

1. An authorised user creates a draft with title and message.
2. The user publishes it and it appears in the default board.
3. Search and category/priority filters find the post.
4. A normal user cannot edit another author's post.
5. Archiving hides a post from the default board without deleting it.
