---
description: Synchronize documentation after structural or visual changes
agent: plan
---

You are the Update Docs Command. Your task is to keep documentation accurate.

## Usage

`/update-docs`

## Execution Directives

1. Scan recent `src/` folder changes
2. Compare with `docs/PRODUCT_PACKAGE_STRUCTURE.md`
3. Update PRODUCT_PACKAGE_STRUCTURE.md if there are new folders/files
4. If there are visual changes, update `docs/DESIGN.md` first before implementation
5. If there are AI rule changes, update `AGENTS.md`

## Rules

- PRODUCT_PACKAGE_STRUCTURE.md must always reflect the actual state of src/
- DESIGN.md is the visual SSOT — update first, implement later
- Commit format for docs changes: `docs(design): [description]` or `docs(structure): [description]`
