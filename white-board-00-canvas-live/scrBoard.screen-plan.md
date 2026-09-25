# Builder brief — Modify scrBoard

Assignment: **Modify** `scrBoard` in `C:\Users\michiba.motoyuki\OneDrive - SHIMIZU CORPORATION\Codex\white_board_00\white-board-00-canvas-live\scrBoard.pa.yaml`. YAML key: `scrBoard`. Control prefix: `Board`.

## Preserve

Preserve the existing gallery, its `White Board Posts` Published/in-date/pinned-first ordering formula, and all existing controls/styles. Do not rename existing controls.

## Required actions

1. Start new post — modify only `Button1.OnSelect` to exactly `=Set(varPostSaveReceipt, Blank()); ResetForm(frmPost); NewForm(frmPost); Navigate(scrPost, ScreenTransition.None)`. Precondition: board visible. Source/identity: none. Postcondition: `frmPost.Mode=FormMode.New`, `scrPost` visible. Evidence: the blank form with Draft status.
2. Save receipt observer — add uniquely named `lblBoardSaveReceipt`, an existing-classic `Label`, below the header and above the gallery. `Visible: =!IsBlank(varPostSaveReceipt)`, `Text: ="Draft saved: " & varPostSaveReceipt.mtl_title & " (Draft)"`, with readable contrast and `AccessibleLabel: ="Saved draft confirmation"`. It observes the same returned ID held in `varPostSaveReceipt` following `frmPost.OnSuccess`.

## Required record field

The receipt must bind `varPostSaveReceipt.mtl_title` and describe Draft as the saved status. It must be visible in the normal board desktop layout without covering the gallery.

## Functional test scenarios

- FT-01: Given board open, When `Button1` selected, Then reset/new/navigate behavior exposes `frmPost` in New mode.
- FT-04: Given successful `frmPost.LastSubmit`, When its success formula navigates to board, Then `lblBoardSaveReceipt` visibly reads that returned title and Draft.
- FT-06: Given no authoring action, When gallery renders, Then its existing source/filter/order formula is unchanged.

## QA layout evidence

Button1 is already 120×44 at x=1210, y=35 on the existing 1366px canvas. Receipt is positioned in the 100px header/gap region without overlapping the gallery starting y=100; if its height changes the builder must shift gallery Y to maintain a ≥8px gap and preserve reachability. At phone width, receipt must use responsive bounds or the existing screen’s supported scroll strategy; no clipped new text. Report checks 1–44 exactly per QAChecks.
