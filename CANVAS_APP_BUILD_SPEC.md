# White Board 00 — Canvas App Build Specification

Use this specification only in the solution-aware Canvas App **White Board 00** (`mtl_whiteboard00_b585b`) in Estimation Dev. It is a build guide for the saved application—not an instruction to share, publish, or change Dataverse security.

## Data source and fields

Data source display name: `White Board Posts`.

| Field | Logical name | Use in app |
| --- | --- | --- |
| Title | `mtl_title` | Required gallery heading and form field |
| Message | `mtl_message` | Required gallery preview, detail, and form field |
| Category | `mtl_category` | Required category filter and form field |
| Priority | `mtl_priority` | Required priority filter and form field |
| Is Pinned | `mtl_ispinned` | Board ordering and form field |
| Publish From | `mtl_publishfrom` | Optional visibility schedule and form field |
| Expires On | `mtl_expireson` | Optional expiry schedule and form field |
| Status | `mtl_status` | Draft, Published, or Archived workflow |
| Attachment | `mtl_attachment` | Optional supporting file; maximum 10 MB |

## Screens and controls

### `scrBoard`

Keep the existing `galPosts` gallery. Add:

- `lblBoardTitle`: Text = `"Estimation White Board"`.
- `txtSearch`: input placeholder = `Search title or message`.
- `cmbCategory`: a single-select Combo box whose Items are `Choices('White Board Posts'.mtl_category)`; allow an empty selection.
- `cmbPriority`: a single-select Combo box whose Items are `Choices('White Board Posts'.mtl_priority)`; allow an empty selection.
- `btnNewPost`: Text = `New post`; OnSelect = `NewForm(frmPost); Navigate(scrPost, ScreenTransition.Cover)`.

Use the Gallery field picker to bind title, subtitle, and body to `Title`, `Category`, and `Message` respectively. Do not type display strings in place of data fields.

Use the saved baseline below for `galPosts.Items`. Confirm that Studio accepts the choice references; do not suppress any delegation warning.

```powerfx
SortByColumns(
    Filter(
        'White Board Posts',
        mtl_status = 'Status (White Board Posts)'.Published &&
        (IsBlank(mtl_publishfrom) || mtl_publishfrom <= Now()) &&
        (IsBlank(mtl_expireson) || mtl_expireson > Now()) &&
        (IsBlank(txtSearch.Text) ||
            StartsWith(mtl_title, txtSearch.Text) ||
            StartsWith(mtl_message, txtSearch.Text)) &&
        (IsBlank(cmbCategory.Selected) || mtl_category = cmbCategory.Selected) &&
        (IsBlank(cmbPriority.Selected) || mtl_priority = cmbPriority.Selected)
    ),
    "mtl_ispinned", SortOrder.Descending,
    "createdon", SortOrder.Descending
)
```

Set `galPosts.OnSelect` to:

```powerfx
Set(varSelectedPost, ThisItem);
Navigate(scrPostDetail, ScreenTransition.Cover)
```

If the Combo box records need their `.Value` field in the target Studio version, select the field from IntelliSense and retain the delegation warning check.

### `scrPostDetail`

Add a read-only detail screen bound to `varSelectedPost`. Show title, category, priority, publish/expiry dates, full message, attachment, author, and created date. Add:

- `btnBack`: `Back()`.
- `btnEdit`: use an author-only visibility formula only after confirming the Owner field's shape through Studio IntelliSense; OnSelect = `EditForm(frmPost); Navigate(scrPost, ScreenTransition.Cover)`.

Do not rely on this visibility condition as a security control. Dataverse privileges must enforce author-only updates.

### `scrPost`

Add `frmPost`, an Edit form with data source `White Board Posts`. Include all post fields except system-generated audit/owner fields. Its Item formula must be:

```powerfx
varSelectedPost
```

Add a nearby required-field error label that uses `frmPost.Error`. Set `frmPost.OnSuccess` to:

```powerfx
Set(varSelectedPost, frmPost.LastSubmit);
Navigate(scrPostDetail, ScreenTransition.Fade)
```

Add `btnCancel`: `ResetForm(frmPost); Back()`.

For lifecycle actions, set the Status data card's Update property before `SubmitForm(frmPost)`:

| Button | Status update | Purpose |
| --- | --- | --- |
| Save draft | `Draft` | Keep the post out of the board |
| Publish | `Published` | Make it visible when publish/expiry rules allow |
| Archive | `Archived` | Hide it without deleting it |

Use the Status choice supplied by Studio's IntelliSense—for example, `'Status (White Board Posts)'.Draft`—rather than a plain text string.

## Required acceptance checks

1. Create a harmless draft with title and message; it must not appear on `scrBoard`.
2. Publish it; it must appear on `scrBoard` and be found by title search and each filter.
3. Archive it; it must no longer appear on `scrBoard` and must remain in Dataverse.
4. Check blank required fields, expiry in the past, future publish dates, attachment above 10 MB, and narrow layout.
5. Test author-only update with a normal Estimation team user after Dataverse security roles are configured.

## Explicitly out of scope for this build step

- Publishing or sharing the app.
- Creating/altering security roles.
- Speech-to-text or Azure AI Speech configuration.
- Production deployment.
