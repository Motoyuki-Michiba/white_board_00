Runtime evaluation: NOT RUN

Plugin root: C:\Users\michiba.motoyuki\.codex\plugins\cache\power-platform-skills\canvas-apps\3.0.3
Source revision: unavailable

## Action Contract Acceptance

| Action | Entry control | Event formula | Source / stable ID | Observer formula | Reachability | Result |
| --- | --- | --- | --- | --- | --- | --- |
| Start new post | `Button1` | `Button1.OnSelect: =Set(varPostSaveReceipt, Blank()); ResetForm(frmPost); NewForm(frmPost); Navigate(scrPost, ScreenTransition.None)` | No write / no prior ID | `frmPost.DefaultMode: =FormMode.New` | 120x44 Board header button | PASS |
| Cancel authoring | `btnPostCancel` | `btnPostCancel.OnSelect: =ResetForm(frmPost); Navigate(scrBoard, ScreenTransition.None)` | No write / no prior ID | `scrBoard` is navigation destination | 120x44 Post header button | PASS |
| Save draft | `btnPostSaveDraft` | `btnPostSaveDraft.OnSelect: =SubmitForm(frmPost)`; `frmPost.OnSuccess: =Set(varPostSaveReceipt, frmPost.LastSubmit); Refresh('White Board Posts'); ResetForm(frmPost); Navigate(scrBoard, ScreenTransition.None)` | `'White Board Posts'` / `frmPost.LastSubmit.mtl_whiteboardpostid` | `lblBoardSaveReceipt.Text: '="Draft saved: " & varPostSaveReceipt.mtl_title & " (Draft)"'` | full-width 44px button in scrollable Post root | PASS |

## Mutation Lifecycle Evidence

| Action | Receipt binding | Canonical source / observer | Requested destination / observer | Stable ID continuity | Synchronization | Focus | Result |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Save draft | `varPostSaveReceipt=frmPost.LastSubmit` | `'White Board Posts'`; returned `mtl_whiteboardpostid` | `scrBoard` / `lblBoardSaveReceipt` reads `varPostSaveReceipt.mtl_title` | `frmPost.LastSubmit.mtl_whiteboardpostid` retained in `varPostSaveReceipt` | `Refresh('White Board Posts')` before Navigate | N/A; receipt is immediate destination evidence | PASS |

## Mutation Field Evidence

| Action | Field | Classification | Canonical pre-state or input | Write / preservation formula | Receipt / proof binding | Post-state observer | Result |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Save draft | mtl_title | Changed | `txtPostTitle.Text` | `dcPostTitle.Update: =txtPostTitle.Text` | labeled `lblPostTitle` / `txtPostTitle` form field; returned title in `lblBoardSaveReceipt` | `varPostSaveReceipt.mtl_title` | PASS |
| Save draft | mtl_message | Changed | `txtPostMessage.Text` | `dcPostMessage.Update: =txtPostMessage.Text` | labeled `lblPostMessage` / `txtPostMessage` form field | `frmPost.LastSubmit.mtl_message` | PASS |
| Save draft | mtl_category | Changed | `cmbPostCategory.Selected.Value` | `dcPostCategory.Update: =cmbPostCategory.Selected.Value` | labeled `lblPostCategory` / `cmbPostCategory` form field | `frmPost.LastSubmit.mtl_category` | PASS |
| Save draft | mtl_priority | Changed | `cmbPostPriority.Selected.Value` | `dcPostPriority.Update: =cmbPostPriority.Selected.Value` | labeled `lblPostPriority` / `cmbPostPriority` form field | `frmPost.LastSubmit.mtl_priority` | PASS |
| Save draft | mtl_ispinned | Changed | `radPostPinned.Selected.Value` | `dcPostPinned.Update: =radPostPinned.Selected.Value = "Yes"` | labeled `lblPostPinned` / `radPostPinned` form field | `frmPost.LastSubmit.mtl_ispinned` | PASS |
| Save draft | mtl_publishfrom | Changed | `dtePostPublishFrom.SelectedDate` | `dcPostPublishFrom.Update: =dtePostPublishFrom.SelectedDate` | labeled `lblPostPublishFrom` / `dtePostPublishFrom` form field | `frmPost.LastSubmit.mtl_publishfrom` | PASS |
| Save draft | mtl_expireson | Changed | `dtePostExpiresOn.SelectedDate` | `dcPostExpiresOn.Update: =dtePostExpiresOn.SelectedDate` | labeled `lblPostExpiresOn` / `dtePostExpiresOn` form field | `frmPost.LastSubmit.mtl_expireson` | PASS |
| Save draft | mtl_status | Changed | fixed Draft literal | `dcPostStatus.Update: ='Status (White Board Posts)'.Draft` | labeled `lblPostStatus`; Draft receipt | `varPostSaveReceipt.mtl_status` | PASS |
| Save draft | mtl_attachment | Changed | `attPostAttachment.Attachments` | `dcPostAttachment.Update: =attPostAttachment.Attachments` | labeled `lblPostAttachment` / `attPostAttachment` form field | `frmPost.LastSubmit.mtl_attachment` | PASS |

## Required Record Field Evidence

| Field key | Bound control | Exact formula | Record hierarchy | Visibility and layout evidence | Result |
| --- | --- | --- | --- | --- | --- |
| Title | `txtPostTitle` | `Default: =Parent.Default` | `frmPost > dcPostTitle > txtPostTitle` | 44px input below persistent Title label | PASS |
| Message | `txtPostMessage` | `Default: =Parent.Default` | `frmPost > dcPostMessage > txtPostMessage` | 92px multiline input below persistent Message label | PASS |
| Category | `cmbPostCategory` | `Items: =Choices('White Board Posts'.mtl_category)` | `frmPost > dcPostCategory > cmbPostCategory` | 44px input below persistent Category label | PASS |
| Priority | `cmbPostPriority` | `Items: =Choices('White Board Posts'.mtl_priority)` | `frmPost > dcPostPriority > cmbPostPriority` | 44px input below persistent Priority label | PASS |
| Is Pinned | `radPostPinned` | `Items: =["Yes", "No"]` | `frmPost > dcPostPinned > radPostPinned` | 44px input below persistent Is Pinned label | PASS |
| Publish From | `dtePostPublishFrom` | `DefaultDate: =Parent.Default` | `frmPost > dcPostPublishFrom > dtePostPublishFrom` | 44px input below persistent Publish From label | PASS |
| Expires On | `dtePostExpiresOn` | `DefaultDate: =Parent.Default` | `frmPost > dcPostExpiresOn > dtePostExpiresOn` | 44px input below persistent Expires On label | PASS |
| Status | `cmbPostStatus` | `DisplayMode: =DisplayMode.Disabled` | `frmPost > dcPostStatus > cmbPostStatus` | 44px input below persistent Status label; fixed Draft update | PASS |
| Attachment | `attPostAttachment` | `Items: =Parent.Default` | `frmPost > dcPostAttachment > attPostAttachment` | 92px input below persistent Attachment label | PASS |

## Data Entry Label Evidence

| Control | Visible label binding | Shared layout region |
| --- | --- | --- |
| txtPostTitle | `lblPostTitle.Text: ="Title"` | dcPostTitle |
| txtPostMessage | `lblPostMessage.Text: ="Message"` | dcPostMessage |
| cmbPostCategory | `lblPostCategory.Text: ="Category"` | dcPostCategory |
| cmbPostPriority | `lblPostPriority.Text: ="Priority"` | dcPostPriority |
| radPostPinned | `lblPostPinned.Text: ="Is Pinned"` | dcPostPinned |
| dtePostPublishFrom | `lblPostPublishFrom.Text: ="Publish From"` | dcPostPublishFrom |
| dtePostExpiresOn | `lblPostExpiresOn.Text: ="Expires On"` | dcPostExpiresOn |
| cmbPostStatus | `lblPostStatus.Text: ="Status"` | dcPostStatus |
| attPostAttachment | `lblPostAttachment.Text: ="Attachment"` | dcPostAttachment |

## Functional Test Matrix Results

| Scenario | Static trace result | Evidence |
| --- | --- | --- |
| FT-01 | PASS | Button1 resets form, NewForm establishes New mode, and all nine cards have Draft Status. |
| FT-02 | PASS | Cancel calls ResetForm and Navigate only; no SubmitForm/Patch call exists. |
| FT-03 | PASS | Save draft is valid-gated and calls SubmitForm only; Status card Update is Draft. |
| FT-04 | PASS | OnSuccess captures LastSubmit, refreshes source, then navigates; board receipt reads returned title/Draft. |
| FT-05 | PASS | OnFailure only Notify; navigation is exclusive to OnSuccess. |
| FT-06 | PASS | Existing Board gallery filter/order formula is preserved. |

## Screen QA Evidence

| Screen | Coverage | Repairs | N/A |
| --- | --- | --- | --- |
| scrBoard | 1-44 COMPLETE | QACHK-MISSING-FORMULA-PREFIX FIXED(14); QACHK-TEXT-PADDING FIXED(4); QACHK-MANUAL-BOUNDS FIXED(1); QACHK-TEXT-CONTENT-FIT FIXED(1); QACHK-ACTION-CONTRACT FIXED(2); QACHK-MUTATION-OUTCOME FIXED(1); QACHK-SHARED-SOURCE-DERIVATION FIXED(1) | QACHK-CONTAINER-MIN-SIZE; QACHK-CROSS-AXIS-ALIGNMENT; QACHK-FILLPORTIONS-DEFAULT; QACHK-SCROLL-TRAP; QACHK-FILLPORTIONS-HEIGHT-CONFLICT; QACHK-FILLPORTIONS-WIDTH-CONFLICT; QACHK-ROOT-CONTAINMENT; QACHK-TIMER-LIFECYCLE; QACHK-READ-ONLY-ANCESTOR; QACHK-HORIZONTAL-BUDGET; QACHK-CORE-VISUALIZATION; QACHK-LIFECYCLE-IDENTITY |
| scrPost | 1-44 COMPLETE | QACHK-NO-HEIGHT-TRAP FIXED(1) | QACHK-GALLERY-TEMPLATE-LAYOUT; QACHK-GALLERY-ROW-FITS-CONTENT; QACHK-GRID-CONTRACT; QACHK-DUPLICATE-GRID-SEARCH; QACHK-TIMER-LIFECYCLE; QACHK-HIDDEN-BOUNDED-LIST; QACHK-MANUAL-BOUNDS; QACHK-CORE-VISUALIZATION |

## Layout Budget Evidence

| Screen / container | QACHK | Branch / width source | Available size | Required-size arithmetic | Protected controls | Result |
| --- | --- | --- | --- | --- | --- | --- |
| scrPost / conPostHeader | QACHK-HORIZONTAL-BUDGET | `Parent.Width`; narrow root width W-32 | 288px at 320px canvas | heading 152 + Cancel 120 + gap 16 = 288 | heading, Cancel | PASS |
| scrPost / conPostRoot | QACHK-PRIMARY-ACTION-REACHABILITY | `LayoutOverflowY: =LayoutOverflow.Scroll` | viewport height | header 56 + gap 16 + form 952 + gap 16 + action 44; overflow scrolls | Attachment, Save draft | PASS |
