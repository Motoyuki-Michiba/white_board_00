# Builder brief — Create scrPost

Assignment: **Create** `scrPost` in `C:\Users\michiba.motoyuki\OneDrive - SHIMIZU CORPORATION\Codex\white_board_00\white-board-00-canvas-live\scrPost.pa.yaml`. YAML key: `scrPost`. Control prefix: `Post`.

## Required creation contracts

## Exact discovery packet

Use only the following discovered creation contracts and properties; no other creation keywords are permitted. `Form` is `Control: Form`, `Variant: Classic`, `Layout: Vertical`; it supports `DataSource`, `DefaultMode`, `Item`, `OnSuccess`, `OnFailure`, `Height`, `Width`, `X`, `Y`, `NumberOfColumns`, `SnapToColumns`, and `Fill`. `GroupContainer` is `Control: GroupContainer`, `Variant: AutoLayout`; it supports `LayoutDirection`, `LayoutAlignItems`, `LayoutGap`, `LayoutOverflowY`, `PaddingTop`, `PaddingRight`, `PaddingBottom`, `PaddingLeft`, `Height`, `Width`, `X`, `Y`, `LayoutMinWidth`, and `LayoutMinHeight`. `Label` is `Control: Label`; it supports `Text`, `Font`, `FontWeight`, `Size`, `Color`, `Height`, `Width`, `X`, `Y`, `Wrap`, `Role`, and padding properties (it does not support `AccessibleLabel`). `Classic/Button` is `Control: Classic/Button`; it supports `Text`, `OnSelect`, `DisplayMode`, `Font`, `FontWeight`, `Color`, `Fill`, `Height`, `Width`, `X`, `Y`, and padding properties.

Each card is a discovered `Control: TypedDataCard` with the exact required `Variant` named below. For the selected variants the card properties are `DataField`, `Default`, `DisplayMode`, `DisplayName`, `Height`, `Required`, `Update`, `Width`, `WidthFit`, `X`, and `Y`. The required field-entry types discovered for explicit child controls are `Classic/TextInput` (uses `Default`, `DisplayMode`, `Mode`, `Text`, `Height`, `Width`, `X`, `Y`), `Classic/ComboBox` (uses `DefaultSelectedItems`, `DisplayFields`, `Items`, `SelectMultiple`, `DisplayMode`, `Height`, `Width`, `X`, `Y`), `Classic/Radio` (uses `Default`, `Items`, `Layout`, `DisplayMode`, `Height`, `Width`, `X`, `Y`), `Classic/DatePicker` (uses `DefaultDate`, `DisplayMode`, `Height`, `Width`, `X`, `Y`), and `Attachments` (uses `Items`, `DisplayMode`, `Height`, `Width`, `X`, `Y`). Every explicit child input must use its exact discovered `Control:` keyword. Use card inputs only when the card's `Update` directly reads the discovered output (`Text`, `Selected`, `Value`, `SelectedDate`, or `Attachments`) and render a sibling Label from the discovered Label contract for each persistent visible field label.

Use the exact discovery contracts supplied with this task: `Control: Form` with `Layout: Vertical`; `Control: GroupContainer` with `Variant: AutoLayout`; existing classic `Label` and `Classic/Button`. Every DataCard uses `Control: TypedDataCard` with the discovered variant exactly: Title `ClassicTextualEdit`, Message `ClassicTextualMultilineEdit`, Category/Priority/Status `ClassicComboBoxOptionSetSingleEdit`, Is Pinned `ClassicYesNoRadioEdit`, Publish From/Expires On `ClassicDateTimeEdit`, Attachment `ClassicFileEdit`. Copy all required companion keywords and supported input property names verbatim from the discovery packet—do not invent properties or enum names.

## Hierarchy and layout

Create one root `conPostRoot` AutoLayout vertical container as the sole child of the screen. It is responsive and vertically scrollable/reachable, with `LayoutMinWidth=0`, `LayoutMinHeight=0`, stretch alignment, 16px narrow / 40px desktop padding and content-sized sections. Inside it create: a responsive header row containing `lblPostHeading` (`Text="New post"`) and `btnPostCancel`; `frmPost`; then an action row containing `btnPostSaveDraft`. Use unique names beginning `Post` for all new nonexisting controls (except required exact form name `frmPost`). Every input has a durable label in its DataCard and an AccessibleLabel. Do not add unrelated screen-level controls.

## Form binding and cards

`frmPost` has `DataSource: ='White Board Posts'`, `DefaultMode: =FormMode.New`, `Item: =Defaults('White Board Posts')`, `OnSuccess: =Set(varPostSaveReceipt, frmPost.LastSubmit); Refresh('White Board Posts'); ResetForm(frmPost); Navigate(scrBoard, ScreenTransition.None)`, and `OnFailure: =Notify(frmPost.Error, NotificationType.Error)`.

Cards are form children in this exact visible order and use the supplied logical DataField values:

1. `dcPostTitle` — `mtl_title`, Title, textual edit.
2. `dcPostMessage` — `mtl_message`, Message, multiline textual edit.
3. `dcPostCategory` — `mtl_category`, Category, option-set single edit.
4. `dcPostPriority` — `mtl_priority`, Priority, option-set single edit.
5. `dcPostPinned` — `mtl_ispinned`, Is Pinned, yes/no radio edit.
6. `dcPostPublishFrom` — `mtl_publishfrom`, Publish From, date/time edit.
7. `dcPostExpiresOn` — `mtl_expireson`, Expires On, date/time edit.
8. `dcPostStatus` — `mtl_status`, Status, option-set single edit; default and `Update` must be exactly `'Status (White Board Posts)'.Draft`. Make its input read-only/disabled so it cannot be changed from Draft.
9. `dcPostAttachment` — `mtl_attachment`, Attachment, file edit.

Each card binds its `Default` to its current `ThisItem` field, its label to the data source display name (or exact required display label), and its `Update` to its input. Do not use `Patch`; do not create a record while validating.

## Required actions

1. Cancel — `btnPostCancel` text `Cancel`, min 44px target, `OnSelect: =ResetForm(frmPost); Navigate(scrBoard, ScreenTransition.None)`. Precondition: form visible. It writes nothing, clears unsaved input, and evidence is board visible.
2. Save draft — `btnPostSaveDraft` text `Save draft`, min 44px target, `DisplayMode: =If(frmPost.Valid, DisplayMode.Edit, DisplayMode.Disabled)`, `OnSelect: =SubmitForm(frmPost)`. Precondition: valid new form. Submit writes all nine card updates, with status Draft. Only `frmPost.OnSuccess` stores returned stable identity, refreshes canonical source, resets and navigates. `OnFailure` retains form/error for correction. Evidence is `lblBoardSaveReceipt` bound to `varPostSaveReceipt` on board.

## Functional test scenarios

- FT-01 given board entry action, when form opens, then all nine labeled cards appear in New mode and status is Draft.
- FT-02 given unsaved entered data, when Cancel selected, then reset/navigation occurs with no submit.
- FT-03 given valid values, when Save draft selected, then only `SubmitForm(frmPost)` starts the save and status update is Draft; screen remains until success.
- FT-04 given successful submit, when form OnSuccess runs, then `LastSubmit` stable ID is retained, data source refreshed, and board receipt reads the returned title/Draft.
- FT-05 given invalid form or failure, when Save is attempted or failure callback runs, then form stays visible and shows error; it does not navigate.

## QA layout evidence

At desktop, root width is Parent.Width minus 80px gutters; vertical cards use full available width. Header: available width W−80; Cancel has 120px fixed width, heading has FillPortions=1/min 0, one 16px gap, so minimum required is 136px and fits phone usable width 288px (320−32). Action row: Save draft full root width, 44px high. The root’s content is scrollable; all cards are stacked with content heights and 12–16px gaps, so the Attachment and Save draft action remain reachable below viewport rather than clipped. Do not set `FillPortions=1` on a child inside a scroll container. Report checks 1–44 exactly per QAChecks; runtime record creation is N/A/prohibited.
