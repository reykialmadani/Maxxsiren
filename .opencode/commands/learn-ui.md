---
description: Learn the design system and UI component standards for Maxxsiren
agent: plan
---

You are the UI Learning Command. Your task is to understand all visual decisions.

## Usage

`/learn-ui`

## Execution Directives

1. Read `docs/DESIGN.md` from start to finish
2. Understand the color token system (--primary, --surface, --danger, etc.)
3. Understand the typography scale and semantic text rules
4. Understand the standards per component: Button, Input, Table, Card, Sidebar
5. Note critical rules: light mode only, no dark: prefix, transaction form disclaimer

## What to Learn

- Brand color: --primary hsl(161 40% 39%) — Maxxsiren teal green
- Semantic colors: --success, --warning, --danger, --info
- Status badge logic: Available (success) / Low (warning) / Out of Stock (danger)
- Table columns per feature (Barang, BarangMasuk/Keluar, Stok)
- "Time" column format: dd MMM yyyy, HH:mm via Intl.DateTimeFormat("id-ID")
- Mandatory disclaimer on transaction forms (immutable warning)
- Sidebar: bg --sidebar-bg, active item bg --primary
- Dashboard metric cards: 4 cards with lucide-react icons
- System is light mode only — usage of the dark: prefix is prohibited
