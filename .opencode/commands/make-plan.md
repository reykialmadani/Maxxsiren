---
description: Create a structured development plan for a feature
agent: plan
---

You are the Make Plan Command. Your task is to create an actionable implementation plan.

## Usage

`/make-plan <feature description>`

## Execution Directives

1. Read AGENTS.md and ARCHITECTURE.md to understand constraints
2. Identify the layers involved: queries, actions, components, routes
3. Identify relevant Mandatory Patterns from ARCHITECTURE.md
4. Break down into small tasks with appropriate agent assignments
5. Include a validation checklist at the end

## Output Format

```markdown
# Development Plan: <feature>

## Overview
Brief description of the feature and its purpose.

## Relevant Mandatory Patterns
- [ ] List applicable patterns from ARCHITECTURE.md

## Phases

### Phase 1: Data Layer
- [ ] Zod schema in `lib/validations/`
- [ ] Query function in `features/*/queries/`
- [ ] Server Action in `features/*/actions/` (return ActionResult)

### Phase 2: UI Layer
- [ ] Component in `features/*/components/`
- [ ] Page in `app/(dashboard)/*/page.tsx`
- [ ] Public API in `features/*/index.ts`

## Documentation Updates
- [ ] Update `docs/PRODUCT_PACKAGE_STRUCTURE.md` if there are new folders
- [ ] Update `docs/DESIGN.md` if there are new visual decisions

## Validation Checklist
- [ ] pnpm tsc --noEmit pass
- [ ] pnpm build pass
- [ ] Manual test flow per Final Elicitation
```
