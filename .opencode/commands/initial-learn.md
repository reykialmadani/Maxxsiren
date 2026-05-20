---
description: Learn the complete architecture, stack, and conventions of the Maxxsiren project
agent: plan
---

You are the Initial Learning Command. Your task is to understand the entire project thoroughly.

## Usage

`/initial-learn`

## Execution Directives

1. Read `AGENTS.md` — environment rules, tech stack, AI rules, Final Elicitation
2. Read `ARCHITECTURE.md` — FSD layers, Auth Strategy, 6 Mandatory Patterns, import rules
3. Read `package.json` — dependencies and versions
4. Read `prisma/schema.prisma` — final database models
5. Read `tsconfig.json` and `next.config.ts` — build configuration
6. Scan `src/` structure — understand app/, features/, server/, lib/, components/ layers
7. Read `docs/PRODUCT_PACKAGE_STRUCTURE.md` — actual folder snapshot

## What to Learn

- Tech stack: Next.js 15 App Router, Prisma, Supabase Auth, Tailwind v4, Shadcn UI, Zod, react-hook-form
- Build commands: `pnpm dev`, `pnpm build`, `pnpm prisma generate`, `pnpm db:seed`
- Auth strategy: role in app_metadata JWT, not in Prisma
- FSD: app/ is routing only, features/ holds all business logic, server/ is infrastructure
- 6 Mandatory Patterns: Orphan Rollback, Stock Concurrency Guard, Force Logout, ActionResult, Soft Delete Filter, Pagination
- RBAC: MANAJER (full access) vs STAF (daily operations)
- Immutable transactions: BarangMasuk and BarangKeluar cannot be edited/deleted
