---
description: Learn the business domain, entities, and workflows of the Maxxsiren inventory system
agent: plan
---

You are the Product Learning Command. Your task is to understand the business domain in depth.

## Usage

`/learn-product`

## Execution Directives

1. Read `AGENTS.md` section "Project Context" and "Required Features (Final Elicitation)"
2. Read `ARCHITECTURE.md` section "Auth Strategy" and "Data Flow"
3. Read `prisma/schema.prisma` — understand relationships between models
4. Read `prisma/seed.ts` — understand sample data and demo scenarios

## What to Learn

- Domain: inventory system for warning equipment distribution (sirens & strobe lights)
- Main entities: User, Kategori, Barang, BarangMasuk, BarangKeluar
- RBAC: MANAJER (all features + user management + reports) vs STAF (input transactions + view stock)
- Transaction flow: BarangMasuk increments stock, BarangKeluar decrements stock (atomic)
- Soft delete: Barang uses deletedAt, User uses isActive + Supabase ban
- Low stock alert: stock <= minStok and stock > 0 → warning, stock = 0 → danger
- Reports: filter by period, export PDF and Excel
- Scope is finalized (Waterfall thesis) — do not add features outside the Final Elicitation
