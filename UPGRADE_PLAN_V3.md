# Upgrade Plan V3 — Dashboard Overhaul, Barang Detail, Barcode & UX Improvements

> **Status**: Disetujui untuk eksekusi
> **Scope**: Dashboard informatif, merge Barang+Stok, detail barang + activity log, barcode label, dropdown satuan, gambar URL, responsive
> **Constraint**: Tidak mengubah palet warna, tidak mengubah RBAC, tidak mengubah arsitektur FSD

---

## 1. Ringkasan Perubahan

| # | Perubahan | Dampak |
|---|---|---|
| 1 | Dashboard overhaul — grafik tren 7 hari, breakdown kategori, top supplier, top barang keluar | 1 dependency baru: `recharts` |
| 2 | Merge menu Barang + Stok → single menu "Barang" dengan tabs di halaman | Sidebar berubah, 2 halaman jadi 1 |
| 3 | Halaman detail barang `/dashboard/barang/[id]` — activity log, breakdown supplier | 1 halaman baru |
| 4 | Barcode label (CODE128) — visual + print | 1 dependency baru: `react-barcode` |
| 5 | Dropdown satuan (strict list) | Perubahan form + constants |
| 6 | Field gambar barang (URL teks, opsional) | Schema + form + display |
| 7 | Responsive improvements | CSS adjustments |

---

## 2. Code Quality Rules (Strict Typing — Zero `any`)

> **Aturan ini berlaku untuk SEMUA kode di V3 dan upgrade plan selanjutnya.** Konsisten dengan `AGENTS.md` dan Biome config (`noExplicitAny: error`).

### 2.1 Larangan Mutlak

| Pola | Larangan | Solusi |
|---|---|---|
| `any` (eksplisit) | DILARANG di semua source code | Gunakan tipe spesifik atau `unknown` + validasi |
| `as any` (type assertion) | DILARANG | Gunakan `as unknown as TargetType` (last resort) atau perbaiki tipe sumber |
| `Function` type | DILARANG (terlalu lebar) | Gunakan signature spesifik: `(arg: T) => R` |
| `Object` / `{}` | DILARANG (terlalu lebar) | Gunakan `Record<string, unknown>` atau interface eksplisit |
| Implicit `any` (parameter tanpa tipe) | DILARANG | Selalu beri tipe parameter eksplisit |
| Untyped `JSON.parse` result | DILARANG | Validasi via Zod `safeParse` lalu cast |

### 2.2 Pola yang Wajib Dipakai

#### Untuk Data dari Database (Prisma)

```typescript
// CORRECT — gunakan Prisma generated types
import type { Prisma, Barang } from "@prisma/client"

type BarangWithKategori = Prisma.BarangGetPayload<{
  include: { kategori: true }
}>

// CORRECT — derive dari query function
type BarangAktif = Awaited<ReturnType<typeof getBarangAktif>>["data"][number]
```

#### Untuk Data dari User Input (unknown source)

```typescript
// CORRECT — Server Action pattern
export async function tambahBarang(formData: unknown): Promise<ActionResult> {
  const parsed = barangSchema.safeParse(formData)
  if (!parsed.success) return { success: false, error: "..." }
  // parsed.data sekarang fully typed dari Zod schema
}

// WRONG
export async function tambahBarang(formData: any) { ... }
```

#### Untuk Component Props

```typescript
// CORRECT — explicit type alias
type ProductCardProps = {
  product: BarangWithKategori
  onSelect?: (id: string) => void
}

export function ProductCard({ product, onSelect }: ProductCardProps) { ... }

// WRONG
export function ProductCard({ product, onSelect }: any) { ... }
```

#### Untuk Event Handlers

```typescript
// CORRECT — gunakan React event types
function handleSubmit(e: React.FormEvent<HTMLFormElement>) { ... }
function handleChange(e: React.ChangeEvent<HTMLInputElement>) { ... }
function handleClick(e: React.MouseEvent<HTMLButtonElement>) { ... }

// WRONG
function handleSubmit(e: any) { ... }
```

#### Untuk Generic Utility

```typescript
// CORRECT — pakai type parameter
function pickFirst<T>(arr: T[]): T | undefined {
  return arr[0]
}

// WRONG
function pickFirst(arr: any[]): any { ... }
```

#### Untuk Array Callback (map / filter / reduce)

```typescript
// CORRECT — TypeScript akan infer otomatis dari typed array
const data: BarangAktif[] = [...]
const names = data.map((item) => item.namaBarang)  // item: BarangAktif inferred
const ids = data.map((item, i) => `${i}: ${item.id}`)  // i: number inferred

// CORRECT — explicit kalau parameter generik atau ambigu
const rows = arr.map((item: BarangAktif, i: number) => ({ ... }))

// WRONG
const names = data.map((item: any) => item.namaBarang)
const ids = data.map((item, i: any) => `${i}: ${item.id}`)
```

#### Untuk External Library tanpa Types

```typescript
// CORRECT — buat interface lokal yang spesifik
interface BarcodeProps {
  value: string
  format?: "CODE128" | "EAN13"
  width?: number
  height?: number
}

// WRONG
import Barcode from "react-barcode" as any
```

### 2.3 Penggunaan `unknown` (Allowed)

`unknown` BOLEH dipakai sebagai gerbang masuk data eksternal yang belum tervalidasi:

```typescript
// CORRECT — input belum tervalidasi
async function handleAction(input: unknown): Promise<ActionResult> {
  const parsed = schema.safeParse(input)
  if (!parsed.success) return { success: false, error: "..." }
  // gunakan parsed.data yang sudah typed
}

// CORRECT — error catching
try {
  await something()
} catch (err: unknown) {
  if (err instanceof Error) {
    console.error(err.message)
  }
}
```

### 2.4 Penggunaan Type Assertion (Allowed Sparingly)

Type assertion BOLEH untuk:

1. **Konversi via `unknown`** (last resort untuk discriminated union edge cases):
   ```typescript
   reset(data as unknown as ReturInput)  // OK kalau memang perlu
   ```

2. **Casting `app_metadata` dari Supabase** (memang `Record<string, unknown>`):
   ```typescript
   const role = session.user.app_metadata.role as "MANAJER" | "STAF"
   ```

3. **Const assertion untuk literal types**:
   ```typescript
   const STATUSES = ["aktif", "nonaktif"] as const
   ```

DILARANG `as any` di semua skenario.

### 2.5 Non-null Assertion (`!`)

Saat ini Biome set `noNonNullAssertion: warn`. Pola yang ditolerir hanya untuk **environment variables yang dijamin ada saat build**:

```typescript
// TOLERATED (warning) — env vars
process.env.NEXT_PUBLIC_SUPABASE_URL!

// DISCOURAGED — gunakan optional chaining atau cek eksplisit
const name = user!.nama  // ❌ — gunakan user?.nama atau cek if (user)
```

### 2.6 Linter Enforcement

`biome.jsonc` sudah set:
```json
{
  "linter": {
    "rules": {
      "suspicious": {
        "noExplicitAny": "error"
      },
      "style": {
        "noNonNullAssertion": "warn"
      }
    }
  }
}
```

Setiap commit harus pass `pnpm biome check --write` tanpa error baru. Warning `noNonNullAssertion` ditolerir hanya untuk env vars existing.

### 2.7 Reviewer Checklist

Sebelum commit, cek:

- [ ] Tidak ada `: any` di parameter, return type, atau type alias
- [ ] Tidak ada `as any` (kecuali via `as unknown as ...`)
- [ ] Semua component props punya type alias eksplisit
- [ ] Semua Server Action input pakai `unknown` + Zod
- [ ] Tipe data DB pakai Prisma generated types (`Prisma.XxxGetPayload<...>` atau `Awaited<ReturnType<...>>`)
- [ ] Event handlers pakai React event types yang tepat
- [ ] Tidak ada `Function` atau `{}` sebagai type

---

## 3. Dependencies Baru (Perlu Approval)

| Package | Version | Ukuran | Alasan |
|---|---|---|---|
| `recharts` | latest | ~200KB gzipped | Chart library untuk dashboard |
| `react-barcode` | latest | ~10KB | Generate barcode CODE128 dari kode barang |

**Total 2 dependency baru.** Tidak ada yang menggantikan library existing.

---

## 4. Schema Changes

### 4.1 Modifikasi `Barang`


```prisma
model Barang {
  id          String    @id @default(cuid())
  kode        String    @unique
  namaBarang  String
  kategoriId  String
  kategori    Kategori  @relation(fields: [kategoriId], references: [id])
  stok        Int       @default(0)
  minStok     Int       @default(0)
  satuan      String
  gambarUrl   String?                    // BARU — URL gambar opsional
  deletedAt   DateTime?

  barangMasuk  BarangMasuk[]
  barangKeluar BarangKeluar[]
  retur        Retur[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Hanya 1 field baru: `gambarUrl String?` (nullable, opsional).

### 4.2 Migration

```powershell
pnpm prisma migrate dev --name add_gambar_url
pnpm prisma generate
```

Tidak perlu reset data — field nullable, backward compatible.

---

## 5. Dashboard Overhaul

### 5.1 Layout Baru (3 Baris)

```
┌─────────────────────────────────────────────────────────────────┐
│ Baris 1: 5 Metric Cards (existing, tidak berubah)               │
│ [Jenis Barang] [Total Stok] [Stok Rendah] [Supplier] [Transaksi]│
├─────────────────────────────────────────────────────────────────┤
│ Baris 2:                                                         │
│ ┌─────────────────────────────┐ ┌─────────────────────────────┐ │
│ │ Grafik Tren 7 Hari          │ │ Breakdown Stok per Kategori │ │
│ │ (BarChart: masuk vs keluar) │ │ (PieChart / BarChart)       │ │
│ │ xl:col-span-2               │ │ xl:col-span-1               │ │
│ └─────────────────────────────┘ └─────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│ Baris 3:                                                         │
│ ┌─────────────────────────────┐ ┌─────────────────────────────┐ │
│ │ Transaksi Terkini (existing)│ │ Stok Kritis (existing)      │ │
│ │ xl:col-span-2               │ │ + Top 5 Supplier            │ │
│ │                             │ │ + Top 5 Barang Keluar       │ │
│ └─────────────────────────────┘ └─────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Queries Baru untuk Dashboard

```typescript
// Tren 7 hari terakhir (per hari: total masuk, total keluar, total retur)
getTrenTransaksi7Hari(): { tanggal: string; masuk: number; keluar: number }[]

// Breakdown stok per kategori
getStokPerKategori(): { kategori: string; totalStok: number }[]

// Top 5 supplier (by jumlah transaksi masuk bulan ini)
getTopSupplier(limit = 5): { nama: string; totalTransaksi: number }[]

// Top 5 barang paling sering keluar (bulan ini)
getTopBarangKeluar(limit = 5): { namaBarang: string; totalKeluar: number }[]
```

### 5.3 Komponen Baru

| Komponen | Library | Lokasi |
|---|---|---|
| `GrafikTren7Hari.tsx` | recharts `BarChart` | `src/features/dashboard/components/` |
| `BreakdownKategori.tsx` | recharts `PieChart` | `src/features/dashboard/components/` |
| `TopSupplierCard.tsx` | Pure Shadcn (list) | `src/features/dashboard/components/` |
| `TopBarangKeluarCard.tsx` | Pure Shadcn (list) | `src/features/dashboard/components/` |

Semua chart components harus `"use client"` karena recharts butuh browser APIs.

### 5.4 Link "Lihat Semua"

Setiap section punya link ke halaman detail:
- Grafik Tren → `/dashboard/barang-masuk` dan `/dashboard/barang-keluar`
- Breakdown Kategori → `/dashboard/barang`
- Top Supplier → `/dashboard/supplier`
- Top Barang Keluar → `/dashboard/barang-keluar`
- Stok Kritis → `/dashboard/barang` (tab Stok)
- Transaksi Terkini → (tidak ada single page, sudah cukup)

---

## 6. Merge Barang + Stok (Tabs)

### 6.1 Sidebar

Hapus menu "Stok" terpisah. Menu "Barang" sekarang mengarah ke `/dashboard/barang` yang punya 2 tabs.

```
Sidebar sebelum:
  Barang            (Package)
  Stok              (Layers)

Sidebar sesudah:
  Barang            (Package)     ← single menu, tabs di halaman
```

### 6.2 Halaman `/dashboard/barang`

```
┌─────────────────────────────────────────────────────┐
│ PageHeader: icon Package, "Manajemen Barang"         │
├─────────────────────────────────────────────────────┤
│ [Tab: Barang] [Tab: Stok] [Tab: Kategori]           │
├─────────────────────────────────────────────────────┤
│ Tab Barang:                                          │
│   Search + Filter + Tambah Barang button             │
│   TabelBarang (existing + tombol Detail)             │
│                                                      │
│ Tab Stok:                                            │
│   Search                                             │
│   TabelStok (existing, read-only)                    │
│                                                      │
│ Tab Kategori:                                        │
│   KategoriSection (existing)                         │
└─────────────────────────────────────────────────────┘
```

Shadcn `Tabs` component digunakan. URL params `?tab=barang|stok|kategori` untuk deep-linking.

### 6.3 Hapus Route `/dashboard/stok`

Route `/dashboard/stok/page.tsx` dihapus. Redirect `/dashboard/stok` → `/dashboard/barang?tab=stok` via Next.js redirect.

---

## 7. Detail Barang + Activity Log

### 7.1 Route: `/dashboard/barang/[id]`

### 7.2 Layout

```
┌─────────────────────────────────────────────────────┐
│ Back button ← "Kembali ke Daftar Barang"            │
├─────────────────────────────────────────────────────┤
│ Header:                                              │
│ [Gambar thumbnail] [Kode] [Nama] [Kategori] [Badge] │
│ [Barcode CODE128]                                    │
│ [Tombol: Print Label]                                │
├─────────────────────────────────────────────────────┤
│ Card Ringkasan:                                      │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐       │
│ │ Stok │ │Min   │ │Total │ │Total │ │Total │       │
│ │ Saat │ │Stok  │ │Masuk │ │Keluar│ │Retur │       │
│ │ Ini  │ │      │ │      │ │      │ │      │       │
│ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘       │
├─────────────────────────────────────────────────────┤
│ Card Breakdown per Supplier:                         │
│ ┌───────────────────────────────────────────────┐   │
│ │ PT Supplier Utama    : 50 unit (3 transaksi)  │   │
│ │ CV Mitra Sirine      : 30 unit (1 transaksi)  │   │
│ └───────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────┤
│ Activity Log (tabel):                                │
│ Waktu | Tipe | Pihak | Jumlah | Keterangan | User   │
│ ─────────────────────────────────────────────────── │
│ 18 Mei | Masuk | PT Supplier A | +10 | Restock | Staf│
│ 15 Mei | Keluar | Toko B | -3 | Penjualan | Staf   │
│ 10 Mei | Retur+ | Customer C | +1 | Cacat | Staf   │
│ 5 Mei  | (Dibatalkan) Masuk | ... | ... | ...       │
└─────────────────────────────────────────────────────┘
```

### 7.3 Queries

```typescript
// Detail barang lengkap
getBarangDetail(id: string): Barang + kategori + semua transaksi

// Breakdown kontribusi per supplier
getBreakdownSupplier(barangId: string): { supplier: string; totalUnit: number; totalTransaksi: number }[]

// Activity log (semua transaksi termasuk soft-deleted)
getActivityLog(barangId: string): gabungan BarangMasuk + BarangKeluar + Retur, termasuk deletedAt != null
```

### 7.4 Soft-deleted Transactions Display

```tsx
// Row yang sudah dibatalkan
<TableRow className="opacity-50">
  <TableCell>
    <span className="line-through">18 Mei 2026</span>
  </TableCell>
  <TableCell>
    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">(Dibatalkan)</span>
    Masuk
  </TableCell>
  ...
</TableRow>
```

### 7.5 Akses ke Detail

Di `TabelBarang.tsx`, tambahkan tombol "Detail" (icon `Eye`) di kolom Aksi, sebelum Edit dan Arsipkan.

---

## 8. Barcode Label (CODE128)

### 8.1 Komponen

```
src/features/barang/components/BarcodeLabel.tsx
```

Props: `kode: string`, `namaBarang: string`

Render:
- Barcode CODE128 dari `kode` (via `react-barcode`)
- Teks kode di bawah barcode
- Nama barang di atas barcode

### 8.2 Print Label

Tombol "Print Label" di halaman detail → buka `window.print()` dengan CSS `@media print` yang hanya menampilkan area barcode.

Alternatif: render ke canvas → download sebagai PNG.

### 8.3 Ukuran Label

Standard label sticker: 50mm x 25mm (landscape). CSS:
```css
@media print {
  .barcode-label {
    width: 50mm;
    height: 25mm;
    page-break-after: always;
  }
}
```

---

## 9. Dropdown Satuan (Strict)

### 9.1 Constants

```typescript
// src/lib/constants/index.ts
export const SATUAN_OPTIONS = [
  "Unit",
  "Pcs",
  "Set",
  "Pasang",
  "Roll",
  "Box",
  "Pak",
  "Lusin",
  "Meter",
] as const

export type Satuan = typeof SATUAN_OPTIONS[number]
```

### 9.2 Perubahan Form

`FormBarang.tsx`: ganti `<Input>` untuk satuan menjadi `<Select>` dengan options dari `SATUAN_OPTIONS`.

### 9.3 Validasi Zod

```typescript
// barang.schema.ts
satuan: z.enum(SATUAN_OPTIONS, { message: "Satuan wajib dipilih" }),
```

---

## 10. Gambar Barang (URL Teks)

### 10.1 Field di Form

`FormBarang.tsx`: tambah field `gambarUrl` (opsional):
```
Label: "URL Gambar (opsional)"
Placeholder: "https://example.com/gambar-barang.jpg"
Type: url
```

### 10.2 Display

- **Tabel Barang**: thumbnail kecil (32x32px, rounded) di kolom pertama sebelum Kode. Jika tidak ada gambar, tampilkan icon `Package` sebagai placeholder.
- **Halaman Detail**: gambar besar (200x200px) di header.

### 10.3 Validasi

```typescript
gambarUrl: z.string().url("URL tidak valid").optional().or(z.literal("")),
```

---

## 11. Responsive Improvements

### 11.1 Sidebar Mobile

Saat ini sidebar fixed 240px — di mobile ini memakan seluruh layar. Perubahan:
- Mobile (< md): sidebar tersembunyi, ada hamburger button di top bar
- Tablet (md): sidebar collapsed (icon only, 64px)
- Desktop (lg+): sidebar full (240px)

Komponen baru: `MobileNav.tsx` — sheet/drawer dari kiri.

### 11.2 Dashboard Cards

Grid sudah responsive (`grid-cols-1 sm:grid-cols-2 xl:grid-cols-5`). Chart perlu:
- Mobile: stack vertikal, chart full width
- Desktop: side by side

### 11.3 Tables

Tabel di mobile: horizontal scroll (`overflow-x-auto`) sudah ada via `DataTable` wrapper. Tidak perlu perubahan besar.

### 11.4 Forms

Forms sudah responsive (`grid-cols-1 md:grid-cols-2`). Tidak perlu perubahan.

---

## 12. File Structure — Apa yang Berubah

### File Baru

```
src/features/dashboard/components/
├── GrafikTren7Hari.tsx
├── BreakdownKategori.tsx
├── TopSupplierCard.tsx
└── TopBarangKeluarCard.tsx

src/features/barang/components/
├── BarcodeLabel.tsx
├── DetailBarang.tsx
└── ActivityLog.tsx

src/app/dashboard/barang/[id]/page.tsx

src/components/layout/MobileNav.tsx
```

### File Dimodifikasi

```
prisma/schema.prisma                          (+ gambarUrl)
src/lib/constants/index.ts                    (+ SATUAN_OPTIONS)
src/lib/validations/barang.schema.ts          (satuan → enum, + gambarUrl)
src/components/layout/Sidebar.tsx             (hapus Stok menu)
src/app/dashboard/barang/page.tsx             (tabs: Barang + Stok + Kategori)
src/features/barang/components/TabelBarang.tsx (+ tombol Detail, + thumbnail)
src/features/barang/components/FormBarang.tsx  (+ dropdown satuan, + gambarUrl)
src/features/dashboard/queries/dashboard.queries.ts (+ 4 queries baru)
src/features/dashboard/components/KartuRingkasan.tsx (tidak berubah)
src/app/dashboard/page.tsx                    (+ chart sections)
src/app/dashboard/layout.tsx                  (+ mobile nav)
```

### File Dihapus

```
src/app/dashboard/stok/page.tsx               (merged ke barang tabs)
```

---

## 13. Phase Breakdown Eksekusi

### Phase 8.1 — Schema + Dependencies
1. `pnpm add recharts react-barcode`
2. Update `prisma/schema.prisma` (+ `gambarUrl`)
3. `pnpm prisma migrate dev --name add_gambar_url`
4. `pnpm prisma generate`
5. Update `src/lib/constants/index.ts` (+ SATUAN_OPTIONS)
6. Update `src/lib/validations/barang.schema.ts` (satuan enum + gambarUrl)

### Phase 8.2 — Merge Barang + Stok (Tabs)
1. Install Shadcn `Tabs` component
2. Rewrite `/dashboard/barang/page.tsx` with tabs
3. Move stok content into tab
4. Remove `/dashboard/stok/page.tsx`
5. Update Sidebar (remove Stok menu)
6. Add redirect `/dashboard/stok` → `/dashboard/barang?tab=stok`
7. Verify: tsc + build

### Phase 8.3 — Detail Barang + Activity Log
1. Create queries (getBarangDetail, getBreakdownSupplier, getActivityLog)
2. Create components (DetailBarang, ActivityLog, BarcodeLabel)
3. Create page `/dashboard/barang/[id]/page.tsx`
4. Update TabelBarang (+ tombol Detail)
5. Verify: tsc + build

### Phase 8.4 — Dashboard Overhaul
1. Create dashboard queries (tren 7 hari, breakdown kategori, top supplier, top barang keluar)
2. Create chart components (GrafikTren7Hari, BreakdownKategori)
3. Create list components (TopSupplierCard, TopBarangKeluarCard)
4. Rewrite dashboard page with new layout
5. Verify: tsc + build

### Phase 8.5 — Form Improvements (Satuan + Gambar)
1. Update FormBarang (dropdown satuan, field gambarUrl)
2. Update TabelBarang (thumbnail column)
3. Verify: tsc + build

### Phase 8.6 — Responsive (Mobile Nav)
1. Create MobileNav component (sheet/drawer)
2. Update dashboard layout (hamburger button, conditional sidebar)
3. Test responsive breakpoints
4. Verify: tsc + build

### Phase 8.7 — Final Verify
- `pnpm biome check --write`
- `pnpm tsc --noEmit`
- `pnpm build`

---

## 14. Verification Checklist

### Dashboard
- [ ] 5 metric cards tampil
- [ ] Grafik tren 7 hari tampil (bar chart masuk vs keluar)
- [ ] Breakdown kategori tampil (pie/bar)
- [ ] Top 5 supplier tampil
- [ ] Top 5 barang keluar tampil
- [ ] Semua "Lihat semua" link berfungsi
- [ ] Responsive di mobile (stack vertikal)

### Barang + Stok Tabs
- [ ] Menu "Barang" di sidebar buka halaman dengan tabs
- [ ] Tab "Barang" menampilkan TabelBarang
- [ ] Tab "Stok" menampilkan TabelStok
- [ ] Tab "Kategori" menampilkan KategoriSection
- [ ] URL `/dashboard/stok` redirect ke `/dashboard/barang?tab=stok`
- [ ] Deep link via URL params berfungsi

### Detail Barang
- [ ] Klik "Detail" di tabel → buka halaman detail
- [ ] Header: kode, nama, kategori, status badge, gambar (jika ada)
- [ ] Barcode CODE128 tampil dari kode barang
- [ ] Tombol "Print Label" berfungsi
- [ ] Card ringkasan stok tampil (stok, min, total masuk/keluar/retur)
- [ ] Breakdown per supplier tampil
- [ ] Activity log tampil (semua transaksi)
- [ ] Transaksi dibatalkan tampil dengan label "(Dibatalkan)" dan opacity rendah

### Dropdown Satuan
- [ ] Form tambah barang: satuan adalah dropdown strict
- [ ] Form edit barang: satuan dropdown, value existing terpilih
- [ ] Validasi: tidak bisa submit tanpa pilih satuan

### Gambar Barang
- [ ] Form tambah/edit: field URL gambar opsional
- [ ] Tabel: thumbnail muncul jika ada URL
- [ ] Detail: gambar besar muncul jika ada URL
- [ ] Tanpa URL: icon placeholder muncul

### Responsive
- [ ] Mobile: sidebar tersembunyi, hamburger button muncul
- [ ] Mobile: klik hamburger → drawer sidebar muncul
- [ ] Tablet: sidebar collapsed (icon only)
- [ ] Desktop: sidebar full width
- [ ] Tabel: horizontal scroll di mobile
- [ ] Dashboard cards: stack di mobile

### Build
- [ ] `pnpm biome check --write` → 0 errors
- [ ] `pnpm tsc --noEmit` → 0 errors
- [ ] `pnpm build` → semua route compile

---

## 15. Out of Scope

- Harga / pembukuan uang
- Scanner barcode (webcam/USB) — hanya print label
- Supabase Storage upload gambar — pakai URL teks dulu
- Export activity log per barang ke PDF
- Bulk print barcode labels
- Dark mode

---

## 16. Risiko & Mitigasi

| Risiko | Mitigasi |
|---|---|
| Recharts bundle size besar (~200KB) | Lazy load chart components via `next/dynamic` |
| Barcode tidak terbaca saat print | Gunakan resolusi tinggi, test dengan printer thermal |
| Gambar URL broken (404) | Fallback ke icon placeholder, `onError` handler |
| Mobile sidebar state management | Gunakan Shadcn Sheet component (built-in state) |
| Tab state hilang saat navigasi | Persist via URL search params |

---

## 17. Approval & Eksekusi

**Plan ini menunggu persetujuan akhir untuk dieksekusi.**

Eksekusi mengikuti urutan Section 13 (Phase 8.1 → 8.7). Setiap phase diakhiri dengan verifikasi.

**Estimasi**: 7 sub-fase, total ~1.5 jam tanpa interupsi.

---

_Last updated: 2026-05-20_
