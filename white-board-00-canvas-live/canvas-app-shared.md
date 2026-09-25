# Shared Canvas App Contract — White Board 00

## Visual system

- Preserve the existing PowerAppsTheme / white page and primary blue `RGBA(56,96,178,1)`.
- Use existing classic Label/Button visual language where matching `scrBoard`; do not introduce a second palette.
- Page title: 24px Open Sans bold; body/field labels: Open Sans 14px or greater. Primary actions are 44px minimum height.
- Desktop page gutters are 40–60px. At narrow widths the authoring root must scroll vertically and use 16px gutters. No action may be clipped.

## Data contract

Canonical writable source: `'White Board Posts'` (Dataverse CDS). Fields: `mtl_title`, `mtl_message`, `mtl_category`, `mtl_priority`, `mtl_ispinned`, `mtl_publishfrom`, `mtl_expireson`, `mtl_status`, `mtl_attachment`.

Option set status literal is exactly `'Status (White Board Posts)'.Draft`. Form identity after create is `frmPost.LastSubmit.mtl_whiteboardpostid`. Do not Patch, Remove, Collect, or use any data write other than `SubmitForm(frmPost)`.

## Navigation contract

- `Button1` on `scrBoard`: `Set(varPostSaveReceipt,Blank()); ResetForm(frmPost); NewForm(frmPost); Navigate(scrPost,ScreenTransition.None)`.
- `btnPostCancel`: `ResetForm(frmPost); Navigate(scrBoard,ScreenTransition.None)`.
- `frmPost.OnSuccess`: `Set(varPostSaveReceipt,frmPost.LastSubmit); Refresh('White Board Posts'); ResetForm(frmPost); Navigate(scrBoard,ScreenTransition.None)`.
- `frmPost.OnFailure`: `Notify(frmPost.Error,NotificationType.Error)` only; it must not navigate.

## Accessibility and responsive rules

Every interactive and input control has an accurate AccessibleLabel. Every visible text input has a persistent human-readable label. Form content must be within a single responsive root container (no screen-level siblings); it is vertically scrollable/reachable on phone layouts. The Cancel and Save draft controls remain at least 44px high and reachable after the attachment card.
