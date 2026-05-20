# AI Agent Development Guidelines — Maxxsiren Inventory System

## Project Context

A web-based Inventory Information System for **Maxxsiren**, a distribution business for warning equipment (sirens & strobe lights). This system replaces manual record-keeping with a centralized digital system that covers item management, incoming/outgoing transaction recording, real-time stock monitoring, and automated reporting.

Developed as a Final Year Thesis using the **Waterfall** method. All functional requirements are finalized — **do not add features outside the Final Elicitation without explicit instructions**.

---

## Environment

**PowerShell only** — do not use Unix/Linux commands.

| Wrong | Correct |
|---|---|
| `rm -rf node_modules` | `Remove-Item -Recurse -Force node_modules` |
| `ls -la` | `Get-ChildItem` |
| `mkdir -p src/components` | `New-Item -ItemType Directory -Path src/components` |
| `grep "useState"` | `Select-String "useState"` |
| `cd src && pnpm dev` | Use the `workdir` parameter |

---

## Build Commands

```powershell
pnpm dev          # Run Next.js development server
pnpm build        # Production build for Next.js
pnpm start        # Run production build

pnpm prisma generate        # Generate Prisma Client (required after schema changes)
pnpm prisma migrate dev     # Create and run a new migration (development)
pnpm prisma migrate deploy  # Run migrations in production
pnpm prisma studio          # Open Prisma Studio for data inspection
pnpm prisma db seed         # Run initial data seed
```

**Required sequence after modifying `prisma/schema.prisma`:**
1. `pnpm prisma migrate dev --name <migration_name>`
2. `pnpm prisma generate`
3. Restart `pnpm dev`

Never directly edit files in `node_modules/@prisma/client`.

---

## Tech Stack (Do Not Deviate)

| Category | Technology | Version |
|---|---|---|
| Core Framework | Next.js (App Router) | 15.2.6 |
| Database | PostgreSQL via Supabase | — |
| ORM | Prisma | latest |
| Auth | Supabase Auth | — |
| Styling | Tailwind CSS | v4 |
| UI Components | Shadcn UI | latest |
| Validation | Zod | latest |
| Forms | react-hook-form | latest |
| Icons | lucide-react | latest |
| Notifications | Sonner | latest |
| PDF Export | jsPDF | latest |
| Excel Export | SheetJS (xlsx) | latest |

**Adding new dependencies without explicit user confirmation is strictly prohibited.**

If a requirement seems to need a new library, propose it first and wait for approval. Do not just `pnpm add`.

---

## Architecture

### Main Pattern: Feature-Sliced Design (FSD)

```
src/
├── app/                    # Next.js App Router — routing & layout only
│   ├── (auth)/             # Route group: public pages (login)
│   └── (dashboard)/        # Route group: protected pages
├── features/               # Business logic per domain
│   ├── auth/
│   ├── barang/             # Master item data & categories
│   ├── barang-masuk/       # Incoming item transactions
│   ├── barang-keluar/      # Outgoing item transactions
│   ├── stok/               # Real-time stock monitoring
│   ├── laporan/            # Report generation & export
│   ├── dashboard/          # Summary & statistics
│   └── pengguna/           # User account management
├── components/
│   └── ui/                 # Shadcn UI primitives — do not place business logic here
├── server/                 # Server-only infrastructure
│   ├── db.ts              # Prisma client singleton
│   ├── supabase.ts        # Supabase server client
│   └── auth.ts            # Auth helper (getSession, requireAuth)
├── lib/
│   ├── supabase/
│   │   └── client.ts      # Supabase browser client
│   ├── validations/        # Zod schemas
│   ├── types/              # Global TypeScript types
│   ├── constants/          # Application constants
│   └── utils.ts
└── prisma/
    ├── schema.prisma
    ├── migrations/
    └── seed.ts
```

### Architecture Layer Rules

- **`app/`**: Only contains layout, loading, error boundary, and thin page components. **No business logic allowed.**
- **`features/`**: All business logic, hooks, server actions, and domain-specific components.
- **`components/ui/`**: Shadcn UI primitives only. Must not import from `features/`.
- **`lib/`**: Pure utilities, client configuration, and helpers without business logic.

---

## Data Layer: Prisma + Supabase

### Prisma Client Singleton

Always use the singleton from `server/db.ts`. Never create a `new PrismaClient()` instance directly in other files.

```typescript
// server/db.ts — THE ONLY instance
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

### Database Query Rules

- All database queries **must only exist in Server Components, Server Actions, or Route Handlers** — never in Client Components.
- Use `prisma.$transaction()` for operations involving more than one table (e.g., record incoming item + update stock simultaneously).
- The `stok` field on the `Barang` table must always be updated through an atomic transaction together with the recording in the `BarangMasuk` or `BarangKeluar` table.

### Server Action Pattern Example

```typescript
// features/barang-masuk/actions/barang-masuk.actions.ts
"use server";

import { prisma } from "@/server/db";
import { requireAuth } from "@/server/auth";
import { barangMasukSchema } from "@/lib/validations/barang-masuk.schema";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/lib/types";

export async function tambahBarangMasuk(formData: unknown): Promise<ActionResult> {
  await requireAuth();

  const parsed = barangMasukSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: "Invalid data" };
  }

  await prisma.$transaction(async (tx) => {
    await tx.barangMasuk.create({ data: parsed.data });
    await tx.barang.update({
      where: { id: parsed.data.barangId },
      data: { stok: { increment: parsed.data.jumlah } },
    });
  });

  revalidatePath("/barang-masuk");
  revalidatePath("/stok");
  return { success: true, data: undefined };
}
```

---

## Authentication & RBAC

### Two User Roles

| Role | Code | Access Rights |
|---|---|---|
| Manager / Business Owner | `MANAJER` | Full access: all features + user management + reports |
| Inventory Staff | `STAF` | Daily operations: input incoming/outgoing items, view stock |

### Auth Rules

- Use **Supabase Auth** for sessions and authentication. Do not build a custom authentication system.
- Next.js Middleware (`middleware.ts`) must protect all routes under `(dashboard)/`.
- Role checking is done in **Server Components or Server Actions** — not only on the client side.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client. This key is for server-side only.

### Development Seed Accounts

| Username | Password | Role |
|---|---|---|
| `manajer@maxxsiren.com` | `admin123` | `MANAJER` |
| `staf@maxxsiren.com` | `staf123` | `STAF` |

---

## Code Conventions

### Naming

- **React Components**: PascalCase — `TabelBarang.tsx`, `FormBarangMasuk.tsx`
- **Server Actions**: camelCase with verbs — `tambahBarang`, `updateStok`, `generateLaporan`
- **Hook files**: prefix with `use` — `useBarangList.ts`, `useStokMonitor.ts`
- **UI Language**: All interface text in **Bahasa Indonesia (Indonesian)**
- **Code Language**: Variable names, functions, and comments in **English**

### TypeScript

- Zero `any` — use `unknown` with validation if the type is unknown.
- Define types for all component props explicitly.
- Use Prisma-generated types (`Prisma.BarangGetPayload<...>`) as database data types, rather than redefining them manually.

### Server vs Client Components

- **Default**: All components are Server Components.
- Add `"use client"` **only if** the component requires: `useState`, `useEffect`, or interactive event handlers.
- Do not add `"use client"` preemptively "just in case".

---

## Required Features (Final Elicitation)

The following is the list of features that **must** be implemented. Do not reduce or add without instructions.

**Functional:**
- [ ] Login page with authentication
- [ ] Different access rights between Staff and Manager
- [ ] CRUD master item data
- [ ] CRUD item category data
- [ ] Incoming item recording with transaction details
- [ ] Outgoing item recording with transaction details
- [ ] Real-time item stock display
- [ ] Low stock alert notification (stock below minimum threshold)
- [ ] Incoming and outgoing item transaction history
- [ ] Item search and filter (name, category, code)
- [ ] Generate inventory reports by period
- [ ] Export reports to PDF and Excel
- [ ] Dashboard summary (total items, critical stock, recent transactions)
- [ ] System user management (add, edit, deactivate)
- [ ] Logout

**Non-Functional:**
- [ ] Accessible via browser without additional installation
- [ ] Responsive on desktop, laptop, tablet, smartphone
- [ ] User-friendly interface
- [ ] All UI in Bahasa Indonesia (Indonesian)
- [ ] Username & password authentication
- [ ] Data integrity and consistency in database
- [ ] Fast response performance
- [ ] High availability during operational hours
- [ ] Modular and maintainable architecture
- [ ] Consistent interface appearance across all pages

---

## General AI Agent Rules

1. **Do not commit, push, or create PRs** unless there are explicit instructions.
2. **Do not add dependencies** without confirmation. Propose first, wait for an answer.
3. **Do not be overly proactive** — do what is asked, not what "might be needed".
4. **Do not modify `prisma/schema.prisma`** without explicit instructions as it directly impacts the database.
5. **Always run `pnpm build`** after completing a phase of work to ensure there are no compilation errors.
6. **If there is ambiguity**, ask before executing — do not assume.
7. **No emojis or icons** in source code and comments.
8. **No code comments** that only explain what the code does (code should be self-explanatory). Comments are only for explaining *why* something is done a certain way.
9. **Do not use the dark: prefix in Tailwind classes. The system is light mode only.**
10. **Transactions (BarangMasuk/BarangKeluar) are immutable — there are no edit or delete features.**
11. **Do not query prisma.barang.findMany without a deletedAt: null filter except for history/report contexts.**

---

## Documentation

- **[README.md](README.md)**: Project overview, setup, and how to run.
- **[CONTRIBUTING.md](CONTRIBUTING.md)**: Git workflow and coding standards.
- **[docs/DESIGN.md](docs/DESIGN.md)**: Single source of truth for all UI/visual decisions — color tokens, component hierarchy, spacing, layout, and page templates. **Read this before working on any UI.**
- **[docs/PRODUCT_PACKAGE_STRUCTURE.md](docs/PRODUCT_PACKAGE_STRUCTURE.md)**: Complete project directory structure.

### Documentation Update Rules

If making structural changes to the project:
1. Update `docs/PRODUCT_PACKAGE_STRUCTURE.md` first.
2. Then update other affected documentation.

If making UI/visual changes:
1. Update `docs/DESIGN.md` first.
2. Commit format: `docs(design): [change description]`
3. Then implement the changes.
