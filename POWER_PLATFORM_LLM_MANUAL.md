# Power Platform Development Manual for an LLM

This document is an operating manual for an AI agent that is asked to develop or maintain a Microsoft Power Platform application. It is written for this repository, but its working method applies to similar solution-based projects.

## 1. Mission and boundaries

Build Power Platform components that are reliable, solution-aware, deployable, and safe to operate. Prefer a small, verified change over a broad redesign.

The components normally involved are:

- **Dataverse**: tables, columns, choices, relationships, security roles, and views.
- **Canvas apps**: user interface and Power Fx formulas.
- **Power Automate cloud flows**: scheduled or event-driven automation.
- **Solutions**: the deployable container for the above components.
- **PCF controls** (optional): custom controls written in TypeScript.

Do not:

- Send real emails, change production data, import a solution, delete a component, or change security roles unless the user has explicitly asked for it.
- Put passwords, access tokens, connection credentials, personal data, or tenant-specific secrets in source files, logs, or documentation.
- Assume that the currently active Power Platform CLI authentication profile targets the desired environment.
- Make a non-solution-aware app, flow, connection reference, or environment variable when it is intended for deployment.

## 2. Repository context

This repository currently contains a solution project named `MailSchedulerSolution`.

| Item | Value |
| --- | --- |
| Solution project | `MailSchedulerSolution/MailSchedulerSolution.cdsproj` |
| Source folder | `MailSchedulerSolution/src` |
| Dataverse table | `mtl_scheduledemail` (`Scheduled Email`) |
| Publisher prefix | `mtl` |
| Development environment | `Estimation Dev` (`https://org0e46434e.crm7.dynamics.com/`) |
| Existing functional specification | `README.md` |

Treat the URL above as development-only context, not as permission to deploy. Read `README.md` and inspect the existing solution before changing its schema or automation.

## 3. Required tools and sign-in

Use PowerShell from the repository root. Confirm that the Power Platform CLI is available:

```powershell
pac --version
pac help
```

Create or select an authentication profile, then verify the selected identity and environment before any operation that reads or writes remotely:

```powershell
pac auth list
pac auth create --environment "https://org0e46434e.crm7.dynamics.com/"
pac auth who
```

When several profiles exist, select deliberately by name or index:

```powershell
pac auth select --name "Estimation Dev"
pac auth who
```

Never run `pac auth token` merely to inspect the session; it prints a bearer token. Never copy CLI credentials to Git.

## 4. The standard workflow

Follow this sequence for every change.

1. **Understand the request.** State the component, expected behavior, data involved, users affected, and acceptance test. Ask for a decision only when it materially changes behavior or reaches beyond the requested scope.
2. **Inspect first.** Read `README.md`, inspect the project tree, check Git status, and discover the target environment and solution. Preserve unrelated local changes.
3. **Design in the solution.** Decide the required tables/columns, app screens, flows, connection references, environment variables, security roles, and dependencies. Use the existing publisher prefix (`mtl`) for new schema names in this solution.
4. **Build in a development environment.** Create all deployable components inside `MailSchedulerSolution`. Use descriptive display names and stable logical names; changing a logical name later is costly.
5. **Export/clone and version source.** Retrieve the source representation, review the diff, and keep it in Git. Do not treat a local ZIP as the only source of truth.
6. **Validate.** Perform focused functional tests with non-production data; test negative paths, permissions, time zones, and duplicate-trigger behavior where relevant.
7. **Package and hand off.** Build the solution ZIP, record what changed and how it was tested, then ask before importing into another environment or production.

## 5. Working with solutions and source control

Solutions are the unit of application lifecycle management. Put solution-aware flows, canvas apps, Dataverse schema, connection references, and environment variables in the same solution.

For a project already represented as `*.cdsproj`, build it from its folder:

```powershell
Set-Location .\MailSchedulerSolution
dotnet build
```

For an exported/unpacked solution, use the CLI pack operation. Use a clearly named output that is not confused with the source directory:

```powershell
pac solution pack --folder .\src --zipfile ..\MailSchedulerSolution-unmanaged.zip --packagetype Unmanaged
```

Before importing, inspect what will be used and run solution checking when it is available for the intended package:

```powershell
pac solution check --path .\MailSchedulerSolution-unmanaged.zip --outputDirectory .\solution-check
```

Importing changes a remote environment and requires explicit user authorization:

```powershell
pac solution import --path .\MailSchedulerSolution-unmanaged.zip --publish-changes
```

For repeatable deployments, create a deployment-settings JSON file and use it to map **connection references** and **environment variables** per environment. Do not hard-code endpoints, mailboxes, SharePoint sites, or API keys into an app or flow.

Use Git checkpoints:

```powershell
git status --short
git diff -- .
```

Do not overwrite or discard another person's existing changes. A successful pack is not proof that every component was included: confirm that the app/flow/schema source files exist and that the expected solution components are present.

## 6. Dataverse design rules

### Naming and schema

- Use the publisher prefix: for example, `mtl_scheduledemail` and `mtl_scheduledfor`.
- Give each column a clear display name, description, datatype, requiredness, maximum length, and ownership model.
- Choose types intentionally: Date and Time behavior affects user-visible time; Choice is preferable to free text for a fixed status set; lookups are preferable to repeating the same business data in text fields.
- Avoid changing the data type or deleting a released column. Add a replacement column and plan a migration instead.
- Use relationships, alternate keys, and server-side validation where data consistency matters.

### Security

- Apply least privilege using Dataverse security roles, teams, and row ownership.
- Do not rely solely on hiding a canvas-app control to protect data; users need appropriate table privileges.
- Test with an account that has normal end-user permissions, not only an administrator account.

### Example: current scheduled-email table

The existing specification uses `mtl_scheduledemail` with fields such as recipients, subject, body, `mtl_scheduledfor`, `mtl_status`, attachment, and error detail. Keep its status transitions explicit:

```text
Scheduled -> Sending -> Sent
                    -> Failed
```

The `Sending` state is a lock. A flow must set it before sending, so overlapping recurrence runs cannot send the same message twice.

## 7. Canvas app rules

- Build or add the canvas app inside the solution; then add its data sources through the solution-aware experience.
- Use forms (`NewForm`, `EditForm`, `SubmitForm`) for standard Dataverse create/update patterns. Put validation messages near the controls and avoid relying only on `Notify`.
- Use explicit loading, success, and error states. Check `Form.Error`/`Errors()` after writes when handling custom Patch logic.
- Keep formula names readable and use `With()`/`Set()` sparingly. Do not store secrets in variables or collections.
- Use delegation-friendly formulas for large Dataverse tables. A yellow delegation warning is a functional risk, not cosmetic noise.
- Make date/time behavior deliberate. Store and compare timestamps in a consistent basis; verify users in Singapore and other time zones see the intended send time.
- Test create, edit, cancel, blank/invalid input, denied access, attachment limits, and narrow/mobile layouts.

Use `pac canvas download` to retrieve an app artifact when necessary. The CLI `pack`/`unpack` commands are preview/deprecated for source control; prefer the platform's native Dataverse Git integration for ongoing canvas-app source control. Do not edit a downloaded `.msapp` as if it were a ZIP file.

## 8. Power Automate flow rules

- Create the cloud flow inside the solution. Use solution connection references and environment variables.
- Make flows idempotent: a retry or repeated trigger must not create duplicate business effects.
- For any action with an external side effect (email, payment, document creation), write a lock/state change before the action and a success/failure result afterward.
- Scope failure handling using **Configure run after**. Capture a concise, safe error message in a support field or log; do not expose secrets or recipient data unnecessarily.
- Do not enable automatic retry for email-like operations until the duplicate-delivery behavior is understood. A provider may accept an operation yet return an ambiguous failure.
- Set recurrence time zone intentionally. `utcNow()` is UTC; evaluate the stored date/time behavior and test at a time-zone boundary.
- Bound List rows queries with OData filters, select only needed columns, enable pagination only when justified, and set concurrency deliberately.
- Test with a harmless recipient/account and a scheduled time at least several minutes in the future.

For the current mail scheduler, the baseline query is conceptually:

```text
mtl_status eq 'Scheduled' and mtl_scheduledfor le <current UTC timestamp>
```

Use the Dataverse connector's actual expression field and test its final saved form. Never assume a copied OData expression is valid without running the flow.

## 9. PCF controls (only when a standard control is insufficient)

Use a PCF control only when the requirement cannot be cleanly met with standard Power Apps controls. Keep the control focused, accessible, and isolated from business logic.

Typical loop:

```powershell
pac pcf init --namespace MikeTools --name FiveMinuteTimePicker --template field
npm install
npm run build
```

Before pushing or importing a control, build it and use the solution project to package it. Treat direct `pcf push` as a development-environment action; obtain approval before using it against a shared environment.

## 10. Verification checklist

Before reporting a change as complete, verify the applicable items:

- [ ] Correct CLI authentication profile and target environment confirmed.
- [ ] All new artifacts are inside the intended solution.
- [ ] Logical names use the correct publisher prefix and no released schema was destructively changed.
- [ ] Connection references and environment variables replace environment-specific values.
- [ ] A normal user can perform the intended action and cannot access restricted data.
- [ ] Canvas app has no unresolved formula/delegation issue affecting the scenario.
- [ ] Flow succeeds once, fails safely, and cannot duplicate an external side effect on overlap/retry.
- [ ] Date, time zone, validation, and attachment/error edge cases were tested.
- [ ] Solution builds/packs successfully; source and package contents were reviewed.
- [ ] Git diff contains only intended changes.
- [ ] No production deployment or real external side effect was performed without approval.

## 11. Useful diagnostic commands

```powershell
# Local project and Git state
git status --short
rg --files .\MailSchedulerSolution

# CLI authentication and available solutions
pac auth list
pac auth who
pac solution list

# Command-specific help is more reliable than remembered flags
pac solution pack --help
pac solution import --help
pac canvas --help
pac pcf --help
```

If an operation fails, capture the command, safe error summary, component name, and environment name. First check authentication profile, solution dependencies, connection references, permissions, and whether the component is actually solution-aware. Do not solve an authentication or dependency failure by deleting components or forcing an import without user approval.

## 12. Completion report template

Use this concise format when handing work back to the user:

```markdown
Implemented: <plain-language change>.

Changed: <solution/app/flow/table/control and files>.
Verified: <commands/tests and outcome>.
Not performed: <deployment, real send, or other action needing approval>.
Next approval needed: <only if applicable>.
```

## 13. Official references

- [Power Platform CLI overview and authentication](https://learn.microsoft.com/power-platform/developer/cli/introduction)
- [`pac auth` command reference](https://learn.microsoft.com/power-platform/developer/cli/reference/auth)
- [`pac solution` command reference](https://learn.microsoft.com/power-platform/developer/cli/reference/solution)
- [`pac canvas` command reference](https://learn.microsoft.com/power-platform/developer/cli/reference/canvas)
- [Power Apps CLI reference](https://learn.microsoft.com/power-apps/developer/code-apps/reference/cli)
- [Dataverse development tools and Solution Packager](https://learn.microsoft.com/power-apps/developer/data-platform/download-tools-nuget)

These services evolve frequently. When a command, UI field, licensing condition, connector behavior, or deployment option matters to the task, consult the relevant Microsoft Learn page and run `pac <group> <command> --help` before acting.
