# Architecture — Maxxsiren Inventory System

## Philosophy

This system is a **single Next.js 15 project** with App Router. There is no monorepo, no separate backend. The separation between client and server code is achieved through:

1. **Folder conventions** — server-only code is collected in specific locations
2. **File naming conventions** — explicit signals for what is client and what is server
3. **Import rules** — server code must not be imported by client code
4. **React directives** — `"use client"` and `"use server"` as explicit boundaries

Core principle: **`app/` is routing only, business logic lives in `features/`, server infrastructure lives in `server/`.**

---

## Directory Structure

```
maxxsiren-inventory/
├── src/
│   │
│   ├── app/                              # ROUTING LAYER — thin, no business logic
│   │   ├── (auth)/                       # Route group: public pages
│   │   │   └── login/
│   │   │       └── page.tsx
│   │   ├── (dashboard)/                  # Route group: protected pages
│   │   │   ├── layout.tsx                # Layout + middleware auth check
│   │   │   ├── page.tsx                  # /dashboard
│   │   │   ├── barang/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── barang-masuk/
│   │   │   │   └── page.tsx
│   │   │   ├── barang-keluar/
│   │   │   │   └── page.tsx
│   │   │   ├── stok/
│   │   │   │   └── page.tsx
│   │   │   ├── laporan/
│   │   │   │   └── page.tsx
│   │   │   └── pengguna/
│   │   │       └── page.tsx
│   │   ├── api/                          # API Routes (only when needed)
│   │   │   └── laporan/
│   │   │       └── route.ts             # For PDF/Excel export via download
│   │   ├── layout.tsx
│   │   └── globals.css
│   │
│   ├── features/                         # FEATURE LAYER — all business logic
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   └── LoginForm.tsx
│   │   │   ├── actions/
│   │   │   │   └── auth.actions.ts
│   │   │   ├── hooks/
│   │   │   │   └── useSession.ts
│   │   │   └── index.ts                 # Public API — the only exit point
│   │   │
│   │   ├── barang/
│   │   │   ├── components/
│   │   │   │   ├── TabelBarang.tsx
│   │   │   │   ├── FormTambahBarang.tsx
│   │   │   │   └── FormEditBarang.tsx
│   │   │   ├── actions/
│   │   │   │   └── barang.actions.ts
│   │   │   ├── queries/
│   │   │   │   └── barang.queries.ts
│   │   │   ├── hooks/
│   │   │   │   └── useBarang.ts
│   │   │   ├── types.ts                 # Local types for this feature
│   │   │   └── index.ts
│   │   │
│   │   ├── barang-masuk/
│   │   │   ├── components/
│   │   │   │   ├── TabelBarangMasuk.tsx
│   │   │   │   └── FormBarangMasuk.tsx
│   │   │   ├── actions/
│   │   │   │   └── barang-masuk.actions.ts
│   │   │   ├── queries/
│   │   │   │   └── barang-masuk.queries.ts
│   │   │   ├── hooks/
│   │   │   └── index.ts
│   │   │
│   │   ├── barang-keluar/               # Identical structure to barang-masuk
│   │   │
│   │   ├── stok/
│   │   │   ├── components/
│   │   │   │   ├── TabelStok.tsx
│   │   │   │   └── BadgeLowStock.tsx
│   │   │   ├── queries/
│   │   │   │   └── stok.queries.ts
│   │   │   ├── hooks/
│   │   │   │   └── useStokMonitor.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── laporan/
│   │   │   ├── components/
│   │   │   │   ├── FormFilterLaporan.tsx
│   │   │   │   └── PreviewLaporan.tsx
│   │   │   ├── actions/
│   │   │   │   └── laporan.actions.ts
│   │   │   ├── generators/              # PDF & Excel logic
│   │   │   │   ├── pdf.generator.ts
│   │   │   │   └── excel.generator.ts
│   │   │   ├── queries/
│   │   │   │   └── laporan.queries.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── dashboard/
│   │   │   ├── components/
│   │   │   │   ├── KartuRingkasan.tsx
│   │   │   │   ├── GrafikPergerakan.tsx
│   │   │   │   └── TabelTransaksiTerkini.tsx
│   │   │   ├── queries/
│   │   │   │   └── dashboard.queries.ts
│   │   │   └── index.ts
│   │   │
│   │   └── pengguna/
│   │       ├── components/
│   │       │   ├── TabelPengguna.tsx
│   │       │   └── FormPengguna.tsx
│   │       ├── actions/
│   │       │   └── pengguna.actions.ts
│   │       ├── queries/
│   │       │   └── pengguna.queries.ts
│   │       └── index.ts
│   │
│   ├── components/                       # SHARED UI — components without business logic
│   │   ├── ui/                           # Shadcn UI primitives (do not modify)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── table.tsx
│   │   │   └── ...
│   │   ├── layout/                       # Global layout components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── PageHeader.tsx
│   │   └── common/                       # Common cross-feature components
│   │       ├── LoadingSpinner.tsx
│   │       ├── EmptyState.tsx
│   │       └── ConfirmDialog.tsx
│   │
│   ├── server/                           # SERVER-ONLY INFRASTRUCTURE
│   │   ├── db.ts                         # Prisma client singleton
│   │   ├── supabase.ts                   # Supabase server client
│   │   └── auth.ts                       # Auth helper (getSession, requireAuth)
│   │
│   └── lib/                              # SHARED UTILITIES (safe for client & server)
│       ├── supabase/
│       │   └── client.ts                 # Supabase browser client
│       ├── validations/                  # Zod schemas (used by actions + forms)
│       │   ├── barang.schema.ts
│       │   ├── barang-masuk.schema.ts
│       │   ├── barang-keluar.schema.ts
│       │   └── pengguna.schema.ts
│       ├── types/                        # Global TypeScript types
│       │   ├── index.ts
│       │   └── roles.ts
│       ├── constants/                    # Application constants
│       │   └── index.ts
│       └── utils.ts                      # Pure functions (date formatting, etc.)
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── public/
├── .env.local
├── middleware.ts                         # Route protection (Supabase Auth)
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Layer Definitions

### `app/` — Routing Layer

**Responsibility**: Define URLs and assemble components from `features/`.

**Rules:**
- Files here should only: `import` from `features/`, render components, and define `metadata`.
- **Prohibited**: writing database queries, business logic, or state management directly here.
- `page.tsx` is a Server Component by default. Use it to fetch initial data, then pass it to components.

```typescript
// CORRECT — app/(dashboard)/barang/page.tsx
import { TabelBarang } from "@/features/barang";
import { getBarangAktif } from "@/features/barang";

export default async function BarangPage() {
  const barang = await getBarangAktif();
  return <TabelBarang data={barang} />;
}

// WRONG — do not query Prisma directly in page.tsx
import { prisma } from "@/server/db";
export default async function BarangPage() {
  const barang = await prisma.barang.findMany(); // ❌
}
```

---

### `features/` — Feature Layer

**Responsibility**: All business logic, queries, mutations, and domain-specific UI.

Each feature has a consistent internal structure:

| Sub-folder | Type | Contents |
|---|---|---|
| `components/` | Client/Server | Feature-specific UI components |
| `actions/` | **Server only** | Server Actions with `"use server"` |
| `queries/` | **Server only** | Data fetching functions (called from Server Components) |
| `hooks/` | **Client only** | Custom hooks with `"use client"` |
| `types.ts` | Isomorphic | Local TypeScript types for the feature |
| `index.ts` | Public API | Public exports for the feature |

**Rules:**
- One feature **must not directly import** from another feature — use `lib/` or `shared/` as a bridge.
- `index.ts` is the **only** export gateway. Importing from within the feature folder from outside is prohibited.

```typescript
// CORRECT
import { TabelBarang, getBarangAktif } from "@/features/barang";

// WRONG — violates feature encapsulation
import { TabelBarang } from "@/features/barang/components/TabelBarang"; // ❌
import { getBarangAktif } from "@/features/barang/queries/barang.queries"; // ❌
```

---

### `server/` — Server Infrastructure Layer

**Responsibility**: Initialization and configuration of tools that **only run on the server**.

**Rules:**
- Files in this folder **must only** be imported from: `features/*/actions/`, `features/*/queries/`, and `app/api/`.
- **Strictly prohibited** to import from `server/` in Client Components or hooks.
- Next.js will throw a build error if violated — this is an automatic safety guardrail.

```typescript
// server/db.ts — Prisma singleton
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

```typescript
// server/auth.ts — Auth helpers
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function requireAuth() {
  const supabase = createServerClient(...);
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/login");
  return session;
}
```

---

### `lib/` — Shared Utilities Layer

**Responsibility**: Code that is **safe to use on both client and server** — must not have side effects, must not have database calls.

**Allowed contents:**
- Zod schemas (used for validation in actions AND in forms)
- Global TypeScript types and interfaces
- Pure functions (currency formatting, date formatting, calculations)
- Application constants
- Supabase browser client

**Rules:**
- Must not import from `server/` or `features/`.
- Must not contain business logic — pure utilities only.

---

### `components/` — Shared UI Layer

**Responsibility**: Visual components that are **not bound to any business domain**.

**Rules:**
- Must not import from `features/` or `server/`.
- May import from `lib/` (for types and utils).
- `components/ui/` is the output from the Shadcn CLI — **do not edit manually** unless absolutely necessary.

---

## Import Rules (Diagram)

```
app/
 └─── can import ──► features/ (index.ts only)
 └─── can import ──► components/
 └─── can import ──► lib/

features/*/actions/ and features/*/queries/
 └─── can import ──► server/    (Prisma, Supabase server)
 └─── can import ──► lib/       (validations, types, utils)
 └─── PROHIBITED from importing ◄── components/ui/

features/*/components/ and features/*/hooks/
 └─── can import ──► components/
 └─── can import ──► lib/
 └─── PROHIBITED from importing ◄── server/

components/
 └─── can import ──► lib/
 └─── PROHIBITED from importing ◄── features/
 └─── PROHIBITED from importing ◄── server/

lib/
 └─── PROHIBITED from importing ◄── all other layers
```

**Valid import direction summary:**

```
app → features → server
app → features → lib
app → components → lib
```

---

## File Naming Conventions

### Client vs Server Signals

| Signal | Meaning |
|---|---|
| `"use client"` on the first line | This file is a Client Component/hook |
| `"use server"` on the first line | This file is a Server Action |
| No directive | Server Component by default |
| Located in `server/` | Server-only, will error if imported by client |
| Located in `features/*/queries/` | Server-only, no directive but called from Server Components |

### File Naming

| Type | Convention | Example |
|---|---|---|
| React Component | PascalCase | `TabelBarang.tsx` |
| Server Action file | `[name].actions.ts` | `barang.actions.ts` |
| Query file | `[name].queries.ts` | `barang.queries.ts` |
| Zod schema | `[name].schema.ts` | `barang.schema.ts` |
| Hook | `use[Name].ts` | `useBarang.ts` |
| Public API | `index.ts` | `index.ts` |

---

## Server Action Anatomy

All data mutations must go through Server Actions. Return type must be `ActionResult<T>` (see Mandatory Pattern #4). Standard pattern:

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

## Query Anatomy (Server-Side Data Fetching)

```typescript
// features/barang/queries/barang.queries.ts
// No need for "use server" — this is not an action, it is a regular function
// called only from Server Components or Server Actions

import { prisma } from "@/server/db";
import type { Barang } from "@prisma/client";

export async function getBarangAktif(): Promise<Barang[]> {
  return prisma.barang.findMany({
    where: { deletedAt: null },
    include: { kategori: true },
    orderBy: { namaBarang: "asc" },
  });
}

export async function getBarangById(id: string): Promise<Barang | null> {
  return prisma.barang.findUnique({ where: { id } });
}
```

---

## Feature Public API Anatomy (`index.ts`)

```typescript
// features/barang/index.ts
// Only export what the outside world needs to know

// Components (for use in app/*/page.tsx)
export { TabelBarang } from "./components/TabelBarang";
export { FormTambahBarang } from "./components/FormTambahBarang";

// Queries (for use in app/*/page.tsx as Server Components)
export { getBarangAktif, getBarangById } from "./queries/barang.queries";

// Actions (for use in form components)
export { tambahBarang, updateBarang, arsipkanBarang } from "./actions/barang.actions";

// Types (for use anywhere that needs them)
export type { BarangFormValues } from "./types";
```

---

## Data Flow

### Read (Reading Data)

```
User opens a page
    -> app/*/page.tsx (Server Component)
    -> calls query from features/*/queries/
    -> query accesses prisma from server/db.ts
    -> data returned to page.tsx
    -> page.tsx passes data to Client component via props
    -> Client component renders data
```

### Write (Data Mutation)

```
User fills form and submits
    -> features/*/components/Form*.tsx (Client Component)
    -> calls Server Action from features/*/actions/
    -> action validates input with Zod from lib/validations/
    -> action checks auth via server/auth.ts
    -> action executes prisma.$transaction() via server/db.ts
    -> action calls revalidatePath()
    -> Next.js refreshes related Server Component data
    -> UI updates
```

---

## Auth Strategy

### Role Source of Truth

User role (`MANAJER` / `STAF`) is stored in **`app_metadata`** on the Supabase Auth JWT — **not in a database table**. `app_metadata` can only be modified from the server side via the Supabase Admin API, so it cannot be forged by the client.

Role checking is done directly from the JWT session without additional database queries:

```typescript
const { data: { session } } = await supabase.auth.getSession()
const role = session?.user.app_metadata.role as "MANAJER" | "STAF" | undefined
```

### Prisma User Table Purpose

The `User` table in Prisma **does not have a `role` field**. Its purpose is purely for:
1. Transactional data relations — recording who created `BarangMasuk`/`BarangKeluar` via `userId`
2. Storing display data: `nama`, `email`
3. Mirroring Supabase active status via `isActive`

The `supabaseId` field links Prisma `User` to Supabase `auth.users`. Always unique and immutable.

### New User Creation (Dual-Write)

Manager creates user -> Server Action calls `supabase.auth.admin.createUser` (with `app_metadata.role`) then `prisma.user.create`. Must use the Orphan Rollback pattern (see Mandatory Pattern #1).

### User Management Page

Since role is not in Prisma, the user list page must join data from two sources:

```typescript
export async function getDaftarPengguna() {
  const { data: authUsers } = await supabase.auth.admin.listUsers()
  const prismaUsers = await prisma.user.findMany()

  return prismaUsers.map((u) => {
    const authUser = authUsers.users.find((a) => a.id === u.supabaseId)
    return {
      ...u,
      role: authUser?.app_metadata.role as "MANAJER" | "STAF",
      bannedUntil: authUser?.banned_until,
    }
  })
}
```

### User Deactivation

Deactivate users via Supabase ban (`ban_duration: "876000h"`), not delete. `isActive` in Prisma is updated as a mirror. See Mandatory Pattern #3 for implementation.

---

## Mandatory Patterns

The following six patterns must be followed throughout the codebase. Violating these patterns will cause subtle, hard-to-debug bugs.

### 1. Orphan Rollback (Dual-Write Auth + Database)

When creating a new user, Supabase Auth and the Prisma User table must be consistent. If the dual-write fails midway, perform manual compensation.

```typescript
const { data: created, error } = await supabase.auth.admin.createUser({
  email,
  password,
  user_metadata: { nama },
  app_metadata: { role },
})
if (error || !created.user) throw new Error("Failed to create auth account")

try {
  await prisma.user.create({
    data: {
      supabaseId: created.user.id,
      nama,
      email,
      isActive: true,
    },
  })
} catch (err) {
  await supabase.auth.admin.deleteUser(created.user.id)
  throw err
}
```

### 2. Stock Concurrency Guard

When items go out, check stock inside the transaction before decrement. Never calculate stock in code (`oldStock - quantity`) — always use the atomic `decrement` operator.

```typescript
await prisma.$transaction(async (tx) => {
  const barang = await tx.barang.findUnique({
    where: { id: barangId },
    select: { stok: true },
  })
  if (!barang || barang.stok < jumlah) {
    throw new Error("Insufficient stock")
  }
  await tx.barangKeluar.create({
    data: { barangId, userId, jumlah, keterangan },
  })
  await tx.barang.update({
    where: { id: barangId },
    data: { stok: { decrement: jumlah } },
  })
})
```

### 3. Force Logout When Role Changes or User is Deactivated

The JWT held by the user contains a snapshot of the role/status at login time. When the role is changed or the user is deactivated, force logout so the user gets a new JWT on next login.

```typescript
export async function ubahRolePengguna(userId: string, newRole: "MANAJER" | "STAF") {
  await supabase.auth.admin.updateUserById(userId, {
    app_metadata: { role: newRole },
  })
  await supabase.auth.admin.signOut(userId)
}

export async function nonaktifkanPengguna(userId: string) {
  await supabase.auth.admin.updateUserById(userId, {
    ban_duration: "876000h",
  })
  await prisma.user.update({
    where: { supabaseId: userId },
    data: { isActive: false },
  })
}
```

### 4. Discriminated Union Return from Server Action

Server Actions MUST NOT throw errors for business errors (insufficient stock, validation failed). Use a discriminated union so the client can pattern-match. Throw only for system errors (DB down, network).

```typescript
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

export async function tambahBarangKeluar(formData: unknown): Promise<ActionResult> {
  await requireAuth()
  const parsed = barangKeluarSchema.safeParse(formData)
  if (!parsed.success) {
    return { success: false, error: "Invalid data" }
  }
  try {
    await prisma.$transaction(async (tx) => {
      // stock concurrency guard here
    })
    revalidatePath("/barang-keluar")
    revalidatePath("/stok")
    return { success: true, data: undefined }
  } catch (err) {
    if (err instanceof Error && err.message === "Insufficient stock") {
      return { success: false, error: err.message }
    }
    throw err
  }
}
```

### 5. Default Soft Delete Filter

Every `Barang` query MUST include a `deletedAt: null` filter except for historical/past period report contexts. Create a `getBarangAktif()` helper as the default access method.

```typescript
export async function getBarangAktif() {
  return prisma.barang.findMany({
    where: { deletedAt: null },
    include: { kategori: true },
    orderBy: { namaBarang: "asc" },
  })
}
```

Exceptions (allowed without `deletedAt: null` filter):
- BarangMasuk/BarangKeluar history tables when joining Barang — display a "(deleted)" label if `deletedAt != null`
- Past period reports

### 6. Pagination Pattern (Server-Side, Offset-Based)

All queries that return a list of data must support pagination. Default page size 10, options 10/25/50.

```typescript
export type PaginatedResult<T> = {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export async function getRiwayatBarangMasuk(page = 1, pageSize = 10): Promise<PaginatedResult<BarangMasuk>> {
  const skip = (page - 1) * pageSize
  const [data, total] = await Promise.all([
    prisma.barangMasuk.findMany({
      include: { barang: true, user: { select: { nama: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.barangMasuk.count(),
  ])
  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }
}
```

---

## Prohibited Anti-Patterns

```typescript
// ❌ Querying Prisma directly in page.tsx
import { prisma } from "@/server/db";
export default async function Page() {
  const data = await prisma.barang.findMany();
}

// ❌ Importing server/ in a Client Component
"use client";
import { prisma } from "@/server/db"; // Build error

// ❌ Importing directly into a feature folder (bypassing index.ts)
import { TabelBarang } from "@/features/barang/components/TabelBarang";

// ❌ Feature importing directly from another feature
// features/barang-masuk/components/Form.tsx
import { getSemuaKategori } from "@/features/barang/queries/..."; // ❌
// Solution: export through index.ts and import from "@/features/barang"

// ❌ useState/useEffect in Server Component (without "use client")
export default async function Page() {
  const [open, setOpen] = useState(false); // Build error
}

// ❌ Updating stock without an atomic transaction
await prisma.barangMasuk.create({ data });       // ❌ Not atomic
await prisma.barang.update({ data: { stok } }); // ❌ Can fail midway

// ✅ Always use transactions
await prisma.$transaction(async (tx) => {
  await tx.barangMasuk.create({ data });
  await tx.barang.update({ data: { stok: { increment: jumlah } } });
});
```

---

## Middleware (Route Protection)

```typescript
// middleware.ts (project root, alongside src/)
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Check Supabase session
  // Redirect to /login if not authenticated
  // Check role for pages that require MANAJER
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
```

---

## Additional Rules

1. **One Prisma transaction per business operation** — do not allow stock and transactions to become out of sync.
2. **Zod schemas are defined in `lib/validations/`** — used by Server Actions (input validation) AND Client Components (form validation before submit).
3. **No manual `fetch()` to API Routes for internal data** — use query functions called directly from Server Components.
4. **API Routes (`app/api/`)** are only used for file download needs (PDF/Excel) that require binary responses — not for data CRUD.
5. **Every folder structure change** must be updated in this document and in `docs/PRODUCT_PACKAGE_STRUCTURE.md`.
