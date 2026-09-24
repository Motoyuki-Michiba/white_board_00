# White_board_00 Agent Instructions

## Purpose

Build and maintain **White_board_00**, an internal information-sharing Power Platform app for the Estimation team.

## Target environment and solution

- Development environment only: `https://org0e46434e.crm7.dynamics.com/` (**Estimation Dev**).
- Solution unique name: `WhiteBoard00Solution`.
- Publisher prefix: `mtl`.
- Use `mtl_` logical names for new Dataverse schema. The planned post table is `mtl_whiteboardpost`.
- Never deploy to production, import into another environment, send email, or alter unrelated solutions without explicit user approval.

## Dataverse safety gate

The workspace Dataverse MCP may target a different environment than the active Power Platform CLI profile. Do not use it for writes unless its endpoint has been verified as:

```text
https://org0e46434e.crm7.dynamics.com/api/mcp
```

Before any Dataverse write, perform and report this read-only canary against the explicit Estimation Dev URL:

```text
mtl_scheduledemail exists
```

For direct Dataverse CLI/API requests, always pin the environment explicitly to `https://org0e46434e.crm7.dynamics.com` and use this solution header for White Board components:

```text
MSCRM.SolutionUniqueName:WhiteBoard00Solution
```

Create new tables from inside `WhiteBoard00Solution` when possible. Before saving, confirm that the generated schema name has the `mtl_` prefix.

## MVP scope

- Canvas App backed by Dataverse.
- Team posts with title, message, category, priority, pinned flag, publish/expiry dates, status, and optional attachment.
- Status values: Draft, Published, Archived.
- Search, filtering, author edit/archiving, and Dataverse-based access control.
- Speech-to-text is permitted in scope following IT approval, but must use a secure Microsoft/Azure configuration and let users edit recognised text before saving.

## Working rules

- Read `README.md` and `POWER_PLATFORM_LLM_MANUAL.md` before making functional changes.
- Inspect Git status and preserve unrelated user changes.
- Keep all deployable artifacts solution-aware and versioned in this repository.
- Use environment variables and connection references for environment-specific values; never store keys, tokens, or credentials in source.
- Do not delete Dataverse data, tables, solution components, or files without explicit user approval.
- Validate changes with focused non-production tests and report what was changed, tested, and deliberately not performed.
