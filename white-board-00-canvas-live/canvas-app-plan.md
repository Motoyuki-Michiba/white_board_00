# White Board 00 — post authoring edit plan

## Requirement Coverage

| Requested noun / interaction | Visible affordance | Owner |
|---|---|---|
| New authoring screen `scrPost` | New Post screen with title, form and actions | `scrPost` |
| New post heading | `lblPostHeading` reads `New post` | `scrPost` |
| Cancel to board | `btnPostCancel` resets the form and navigates to `scrBoard` | `scrPost` |
| New-mode edit form | `frmPost`, bound to `White Board Posts`, `DefaultMode=FormMode.New` | `scrPost` |
| Required fields | Nine labeled DataCards in `frmPost` | `scrPost` |
| Draft default and save | Draft-only Status card and `btnPostSaveDraft` | `scrPost` |
| Return only on successful save | `frmPost.OnSuccess` refreshes data, stores receipt, resets and navigates | `scrPost` |
| Existing New post entry | Existing `Button1` opens a reset New form | `scrBoard` |

## Required Record Fields

| Screen | Record surface | Stable key | Required field | Bound control / formula | Visibility / layout |
|---|---|---|---|---|---|
| scrPost | frmPost | `frmPost.LastSubmit.mtl_whiteboardpostid` after save | Title | `dcPostTitle` → `dciPostTitle.Text`; `Update=dciPostTitle.Text` | Always visible, first form card |
| scrPost | frmPost | same | Message | `dcPostMessage` → `dciPostMessage.Text`; `Update=dciPostMessage.Text` | Always visible, multiline card |
| scrPost | frmPost | same | Category | `dcPostCategory` option-set input; `Update` selected option | Always visible |
| scrPost | frmPost | same | Priority | `dcPostPriority` option-set input; `Update` selected option | Always visible |
| scrPost | frmPost | same | Is Pinned | `dcPostPinned` yes/no input; `Update` selected Boolean | Always visible |
| scrPost | frmPost | same | Publish From | `dcPostPublishFrom` date/time input; `Update` selected value | Always visible |
| scrPost | frmPost | same | Expires On | `dcPostExpiresOn` date/time input; `Update` selected value | Always visible |
| scrPost | frmPost | same | Status | `dcPostStatus`, fixed `Draft`; `Update='Status (White Board Posts)'.Draft` | Always visible and read-only to prevent accidental publishing |
| scrPost | frmPost | same | Attachment | `dcPostAttachment` file input; `Update` attachment value | Always visible |
| scrBoard | save receipt | `varPostSaveReceipt.mtl_whiteboardpostid` | saved title/status | `lblBoardSaveReceipt.Text = "Draft saved: " & varPostSaveReceipt.mtl_title & " (Draft)"` | Visible only while receipt is nonblank, below header and above gallery |

## Action Contracts

| Action | Owner / entry | Precondition and source / identity | Event and exact transition | Write set / proof set | Postcondition, observer, evidence |
|---|---|---|---|---|---|
| Start new post | scrBoard / `Button1` | Board is visible; no record is created. | `Set(varPostSaveReceipt,Blank()); ResetForm(frmPost); NewForm(frmPost); Navigate(scrPost,ScreenTransition.None)` | None / none | `frmPost.Mode=FormMode.New`; blank New post form is visible. |
| Cancel authoring | scrPost / `btnPostCancel` | `scrPost` is visible; form may contain unsaved input. | `ResetForm(frmPost); Navigate(scrBoard,ScreenTransition.None)` | None / none | No submit occurs; board is visible and unsaved input is cleared. |
| Save draft | scrPost / `btnPostSaveDraft` | `scrPost` visible and `frmPost.Valid`; source is new `White Board Posts` record. | Button calls `SubmitForm(frmPost)`. Status card’s `Update` is exactly `'Status (White Board Posts)'.Draft`; it is therefore the submitted status. `frmPost.OnSuccess` runs `Set(varPostSaveReceipt,frmPost.LastSubmit); Refresh('White Board Posts'); ResetForm(frmPost); Navigate(scrBoard,ScreenTransition.None)`. `OnFailure` leaves user on form and shows `Notify(frmPost.Error,NotificationType.Error)`. | Changed: Title, Message, Category, Priority, Is Pinned, Publish From, Expires On, Status=Draft, Attachment. Proof: `frmPost.LastSubmit` held in `varPostSaveReceipt`, including each readable field in the form before submit and title/status board receipt after success. | Only a successful submit returns to board. Board receipt reads the same returned stable ID/title/status; source refreshed before navigation. |

## Mutation Lifecycle Evidence

| Mutation | Receipt | Canonical source / same stable ID | Requested destination and synchronization |
|---|---|---|---|
| Save draft | `varPostSaveReceipt=frmPost.LastSubmit`; board receipt displays title/status | `White Board Posts`; `varPostSaveReceipt.mtl_whiteboardpostid` | `Refresh('White Board Posts')` occurs after success and before `Navigate(scrBoard,...)`; board receipt is immediately visible. |

## Mutation Field Ledger

| Mutation | Changed fields (write + proof) | Preserved fields / evidence |
|---|---|---|
| Save draft | `mtl_title`, `mtl_message`, `mtl_category`, `mtl_priority`, `mtl_ispinned`, `mtl_publishfrom`, `mtl_expireson`, `mtl_status=Draft`, `mtl_attachment`: each has a labeled card and contributes through its card `Update`; title/status are repeated by the success receipt. | System identity and audit fields are not supplied by the form and remain Dataverse-managed; returned `LastSubmit` is the post-save evidence. |

## Functional Test Matrix

| ID | Given | When | Then / evidence |
|---|---|---|---|
| FT-01 | `scrBoard` is open. | Select New post. | `scrPost` opens; `frmPost.Mode=FormMode.New` and all cards are blank/default, with Status Draft. |
| FT-02 | A user has entered values in `frmPost`. | Select Cancel. | `scrBoard` appears; no `SubmitForm` call occurs and reopening starts a reset New form. |
| FT-03 | Form has valid required values and Status shows Draft. | Select Save draft. | `SubmitForm(frmPost)` writes exactly the nine declared fields; before success the screen remains `scrPost`. |
| FT-04 | FT-03 persistence succeeds. | `frmPost.OnSuccess` fires. | Data source is refreshed, then board appears; `lblBoardSaveReceipt` reads returned title and Draft for `varPostSaveReceipt.mtl_whiteboardpostid`. |
| FT-05 | Form is invalid or submission fails. | Attempt Save draft / trigger OnFailure. | User remains on `scrPost`; error is visible; no navigation and no success receipt occur. |
| FT-06 | Existing board is loaded. | No authoring action. | Existing gallery continues to filter Published, in-date posts and preserves its source/order behavior. |

Runtime test status: **NOT RUN** — user explicitly prohibits creating Dataverse records. These scenarios are symbolic acceptance checks only.

## App Changes

### Before builders

None. No app-level variables, collections, or formulas are required; `varPostSaveReceipt` is created by control behavior formulas.

### After builders

None.

## Editor State Changes

Final `Screens` order: `scrBoard`, `scrPost`.

## Dispatch

| Action | Screen | Target File | YAML Key | Name Prefix | Screen Brief |
|---|---|---|---|---|---|
| Modify | scrBoard | `C:\\Users\\michiba.motoyuki\\OneDrive - SHIMIZU CORPORATION\\Codex\\white_board_00\\white-board-00-canvas-live\\scrBoard.pa.yaml` | scrBoard | Board | `C:\\Users\\michiba.motoyuki\\OneDrive - SHIMIZU CORPORATION\\Codex\\white_board_00\\white-board-00-canvas-live\\scrBoard.screen-plan.md` |
| Create | scrPost | `C:\\Users\\michiba.motoyuki\\OneDrive - SHIMIZU CORPORATION\\Codex\\white_board_00\\white-board-00-canvas-live\\scrPost.pa.yaml` | scrPost | Post | `C:\\Users\\michiba.motoyuki\\OneDrive - SHIMIZU CORPORATION\\Codex\\white_board_00\\white-board-00-canvas-live\\scrPost.screen-plan.md` |
