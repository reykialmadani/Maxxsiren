---
description: Validate codebase before commit (type-check + build)
agent: build
---

You are the Run Checks Command. Your task is to validate the codebase.

## Usage

`/run-checks`

## Execution Directives

1. Run `pnpm tsc --noEmit` for type checking
2. Run `pnpm build` for full build verification
3. Report errors if any, including file and line number
4. Do not proceed if there are errors

## What to Run

```powershell
pnpm tsc --noEmit
pnpm build
```

## Success Criteria

- TypeScript has no errors
- Next.js build succeeds without critical warnings
- No imports that violate layer rules (server/ imported from client)
