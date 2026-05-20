# Upgrade Plan — Maxxsiren Inventory Profesional

> **Status**: Disetujui untuk eksekusi
> **Scope**: Penambahan fitur Supplier, Retur, pemisahan Laporan, soft delete transaksi, manual date input
> **Constraint**: Tidak mengubah flow utama, tidak mengubah palet warna, tidak mengubah arsitektur FSD

---

## 1. Ringkasan Eksekutif

Upgrade ini menambahkan 3 modul baru (Supplier, Retur, Laporan terpisah) dan 2 perubahan perilaku transaksi (soft delete + manual date input) ke sistem Maxxsiren existing. Semua perubahan tunduk pada arsitektur FSD, pola Server Action `ActionResult`, dan aturan immutability transaksi diganti menjadi **soft delete dengan stock reversal atomik**.

Role tetap **MANAJER** dan **STAF** (tidak diganti ke Admin/Owner), tapi permission mengikuti pola BBT referensi: STAF sebagai operator harian, MANAJER mewarisi semua permission STAF + eksklusif untuk export PDF dan user management.

---

## 2. Keputusan yang Sudah Disetujui

| # | Keputusan | Alasan |
|---|---|---|
| 1 | Soft delete untuk semua transaksi (BarangMasuk/Keluar/Retur) dengan stock reversal atomik | Audit trail bersih, bisa undo, konsisten dengan pola Barang |
| 2 | Hapus transaksi: stok di-reverse dalam `prisma.$transaction` | Mencegah inkonsistensi stok saat undo |
| 3 | Supplier: hard delete dengan guard (tolak jika masih punya BarangMasuk terkait) | Konsisten dengan pola Kategori existing |
| 4 | Retur dipisah 2 tipe via discriminator field: `MASUK` (stok +) dan `KELUAR` (stok −) | Audit-friendly, dampak stok jelas |
| 5 | Tanggal transaksi: input manual, validasi `≤ hari ini` dan `≥ 30 hari ke belakang` | Akurasi laporan periode, fleksibilitas operasional |
| 6 | Stok awal saat tambah barang: tetap 0, harus lewat BarangMasuk | Audit trail bersih |
| 7 | Role tetap MANAJER/STAF dengan inheritance pattern (MANAJER ⊇ STAF) | Backward compatible, simpel |
| 8 | STAF & MANAJER bisa CRUD Supplier | Supplier adalah data master operasional |
| 9 | Hanya MANAJER yang export PDF laporan | Fitur eksklusif level atas |
| 10 | Hanya MANAJER yang manage user (tambah/edit/nonaktifkan) | Tidak berubah dari sebelumnya |
| 11 | Migrasi data: drop + re-seed (development mode) | Data demo, tidak ada loss yang signifikan |

---

## 3. Schema Database Baru

### 3.1 Tabel Baru

#### `Supplier`
```prisma
model Supplier {
  id        String   @id @default(cuid())
  nama      String
  telepon   String
  alamat    String

  barangMasuk BarangMasuk[]
  retur       Retur[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

#### `Retur`
```prisma
enum TipeRetur {
  MASUK
  KELUAR
}

model Retur {
  id            String    @id @default(cuid())
  tipe          TipeRetur
  barangId      String
  barang        Barang    @relation(fields: [barangId], references: [id])
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  jumlah        Int
  keterangan    String?
  tanggalRetur  DateTime
  supplierId    String?
  supplier      Supplier? @relation(fields: [supplierId], references: [id])
  namaPenerima  String?
  deletedAt     DateTime?
  createdAt     DateTime  @default(now())
}
```

> **Catatan**: `supplierId` wajib jika `tipe = KELUAR` (retur ke supplier), `namaPenerima` wajib jika `tipe = MASUK` (retur dari customer). Validasi dilakukan di Zod schema, bukan di DB constraint.

### 3.2 Modifikasi Tabel Existing

#### `BarangMasuk`
```prisma
model BarangMasuk {
  id            String    @id @default(cuid())
  barangId      String
  barang        Barang    @relation(fields: [barangId], references: [id])
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  supplierId    String
  supplier      Supplier  @relation(fields: [supplierId], references: [id])
  jumlah        Int
  keterangan    String?
  tanggalMasuk  DateTime
  deletedAt     DateTime?
  createdAt     DateTime  @default(now())
}
```

#### `BarangKeluar`
```prisma
model BarangKeluar {
  id            String    @id @default(cuid())
  barangId      String
  barang        Barang    @relation(fields: [barangId], references: [id])
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  namaPenerima  String
  jumlah        Int
  keterangan    String?
  tanggalKeluar DateTime
  deletedAt     DateTime?
  createdAt     DateTime  @default(now())
}
```

#### `Barang`
Tidak berubah. Relasi `retur Retur[]` ditambahkan secara implisit.

#### `User`
Tidak berubah. Relasi `retur Retur[]` ditambahkan secara implisit.

#### `Kategori`
Tidak berubah.

---

## 4. RBAC Matrix Lengkap

Pola: **MANAJER mewarisi semua permission STAF + fitur eksklusifnya.**

| Menu / Aksi | STAF | MANAJER |
|---|---|---|
| Login / Logout | ✅ | ✅ |
| Dashboard (lihat) | ✅ | ✅ |
| **Supplier** — Lihat | ✅ | ✅ |
| **Supplier** — Tambah | ✅ | ✅ |
| **Supplier** — Edit | ✅ | ✅ |
| **Supplier** — Hapus (hard, with guard) | ✅ | ✅ |
| **Supplier** — Search | ✅ | ✅ |
| **Barang** — Lihat | ✅ | ✅ |
| **Barang** — Tambah | ✅ | ✅ |
| **Barang** — Edit | ✅ | ✅ |
| **Barang** — Arsipkan (soft delete) | ✅ | ✅ |
| **Barang** — Search & Filter | ✅ | ✅ |
| **Kategori** — CRUD | ✅ | ✅ |
| **Stok** — Lihat | ✅ | ✅ |
| **Barang Masuk** — Input | ✅ | ✅ |
| **Barang Masuk** — Hapus (soft, with stock reversal) | ✅ | ✅ |
| **Barang Keluar** — Input | ✅ | ✅ |
| **Barang Keluar** — Hapus (soft, with stock reversal) | ✅ | ✅ |
| **Retur** — Input MASUK | ✅ | ✅ |
| **Retur** — Input KELUAR | ✅ | ✅ |
| **Retur** — Hapus (soft, with stock reversal) | ✅ | ✅ |
| **Laporan Masuk** — Lihat & Filter | ✅ | ✅ |
| **Laporan Masuk** — Export PDF / Excel | ❌ | ✅ |
| **Laporan Keluar** — Lihat & Filter | ✅ | ✅ |
| **Laporan Keluar** — Export PDF / Excel | ❌ | ✅ |
| **Pengguna** — CRUD | ❌ | ✅ |

---

## 5. Sidebar Navigation Baru

Urutan sidebar setelah upgrade (icon dari lucide-react):

```
Dashboard         (LayoutDashboard)
Supplier          (Truck)              ← BARU
Barang            (Package)
Stok              (Layers)
Barang Masuk      (ArrowDownToLine)
Barang Keluar     (ArrowUpFromLine)
Retur             (RotateCcw)          ← BARU
Laporan Masuk     (FileDown)           ← BARU (split dari Laporan)
Laporan Keluar    (FileUp)             ← BARU (split dari Laporan)
Pengguna          (Users)              [MANAJER only]
```

Menu lama "Laporan" dihapus, diganti 2 menu terpisah.

---

## 6. Pola Wajib Baru

### 6.1 Soft Delete + Stock Reversal Pattern

Setiap "hapus" transaksi harus me-reverse dampak stok awal dalam `prisma.$transaction`:

```typescript
// Pseudo-code untuk hapusBarangMasuk
await prisma.$transaction(async (tx) => {
  const masuk = await tx.barangMasuk.findUnique({ where: { id } })
  if (!masuk || masuk.deletedAt) throw new Error("Sudah dihapus")

  // Cek stok cukup untuk di-reverse (tidak boleh negatif)
  const barang = await tx.barang.findUnique({ where: { id: masuk.barangId } })
  if (!barang || barang.stok < masuk.jumlah) {
    throw new Error("Tidak dapat membatalkan: stok tidak mencukupi")
  }

  await tx.barangMasuk.update({
    where: { id },
    data: { deletedAt: new Date() },
  })
  await tx.barang.update({
    where: { id: masuk.barangId },
    data: { stok: { decrement: masuk.jumlah } },
  })
})
```

Pola serupa berlaku untuk:
- `hapusBarangKeluar` → stok increment
- `hapusReturMasuk` → stok decrement
- `hapusReturKeluar` → stok increment

### 6.2 Tanggal Validation Pattern

Semua field tanggal manual divalidasi di Zod:

```typescript
const tanggalSchema = z.coerce.date().refine(
  (d) => {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    return d <= now && d >= thirtyDaysAgo
  },
  { message: "Tanggal harus dalam 30 hari terakhir dan tidak boleh masa depan" }
)
```

### 6.3 Default Soft Delete Filter (Diperluas)

Filter `deletedAt: null` sekarang diterapkan default ke:
- `Barang` (existing)
- `BarangMasuk` (BARU)
- `BarangKeluar` (BARU)
- `Retur` (BARU)

Pengecualian: query untuk laporan periode dan history audit (boleh tampilkan yang sudah di-soft-delete dengan label "(dibatalkan)").

---

## 7. File Structure — Apa yang Berubah

### 7.1 File Baru

```
src/features/supplier/
├── actions/supplier.actions.ts
├── components/
│   ├── TabelSupplier.tsx
│   └── FormSupplier.tsx
├── queries/supplier.queries.ts
└── index.ts

src/features/retur/
├── actions/retur.actions.ts
├── components/
│   ├── TabelRetur.tsx
│   └── FormRetur.tsx
├── queries/retur.queries.ts
└── index.ts

src/lib/validations/
├── supplier.schema.ts
├── retur.schema.ts
└── tanggal.schema.ts

src/app/dashboard/
├── supplier/page.tsx
├── retur/page.tsx
├── laporan-masuk/page.tsx
└── laporan-keluar/page.tsx

src/app/api/
├── laporan-masuk/route.ts
└── laporan-keluar/route.ts
```

### 7.2 File Dimodifikasi

```
prisma/schema.prisma
prisma/seed.ts
src/components/layout/Sidebar.tsx
src/features/barang-masuk/
├── actions/barang-masuk.actions.ts
├── components/FormBarangMasuk.tsx
├── components/TabelBarangMasuk.tsx
└── queries/barang-masuk.queries.ts

src/features/barang-keluar/
├── actions/barang-keluar.actions.ts
├── components/FormBarangKeluar.tsx
├── components/TabelBarangKeluar.tsx
└── queries/barang-keluar.queries.ts

src/features/laporan/
├── components/FormFilterLaporan.tsx
├── generators/pdf.generator.ts
└── generators/excel.generator.ts

src/features/dashboard/queries/dashboard.queries.ts
```

### 7.3 File Dihapus

```
src/app/dashboard/laporan/page.tsx
src/app/api/laporan/route.ts
```

---

## 8. Migrasi Database

### 8.1 Strategi: Drop + Re-seed

```powershell
pnpm prisma migrate reset --force
pnpm prisma migrate dev --name upgrade_v2
pnpm prisma generate
pnpm db:seed
```

### 8.2 Update `prisma/seed.ts`

Tambahan:
- 3 supplier sample (PT Supplier Utama, CV Mitra Sirine, Toko Elektronik Jaya)
- BarangMasuk existing perlu `supplierId` dan `tanggalMasuk`
- BarangKeluar existing perlu `namaPenerima` dan `tanggalKeluar`
- 2-3 sample Retur (1 MASUK dari customer, 1 KELUAR ke supplier)

---

## 9. Phase Breakdown Eksekusi

### Phase 7.1 — Schema + Migration
1. Update `prisma/schema.prisma`
2. Run migration
3. Update `prisma/seed.ts`
4. Run seed
5. Verifikasi via Prisma Studio

### Phase 7.2 — Feature Supplier
1. Zod schema
2. Queries
3. Actions (CRUD + guard)
4. Components (TabelSupplier, FormSupplier)
5. Page
6. Public API
7. Update Sidebar
8. Verify: biome + tsc + build

### Phase 7.3 — Update BarangMasuk/Keluar
1. Update Zod schemas
2. Update queries (filter deletedAt)
3. Update actions (hapus + stock reversal, tanggal validasi)
4. Update form components (supplier dropdown, date input, nama penerima)
5. Update tabel components (tombol hapus, kolom baru)
6. Verify: biome + tsc + build

### Phase 7.4 — Feature Retur
1. Zod schema (discriminated by tipe)
2. Queries
3. Actions (tambah MASUK/KELUAR, hapus + reversal)
4. Components (TabelRetur, FormRetur)
5. Page
6. Update Sidebar
7. Verify: biome + tsc + build

### Phase 7.5 — Split Laporan
1. Buat `/dashboard/laporan-masuk/page.tsx`
2. Buat `/dashboard/laporan-keluar/page.tsx`
3. API routes: `/api/laporan-masuk` dan `/api/laporan-keluar`
4. Update generators (include Retur data)
5. RBAC: disable export button for STAF
6. Hapus halaman laporan lama
7. Update Sidebar
8. Verify: biome + tsc + build

### Phase 7.6 — Update Dashboard
1. Tambah metric card: "Total Supplier" + "Retur Hari Ini"
2. Update queries: exclude soft-deleted transactions
3. Tampilkan retur di tabel Transaksi Terkini
4. Verify: biome + tsc + build

### Phase 7.7 — Final Verify & Manual Test
- `pnpm biome check --write`
- `pnpm tsc --noEmit`
- `pnpm build`
- Manual test scenarios (Section 11)

---

## 10. Pola Wajib (Recap)

| # | Pola | Berlaku ke |
|---|---|---|
| 1 | Orphan Rollback | User creation (existing) |
| 2 | Stock Concurrency Guard | BarangKeluar, ReturKeluar |
| 3 | Force Logout on role change | User management (existing) |
| 4 | ActionResult discriminated union | SEMUA Server Action |
| 5 | Default Soft Delete Filter | Barang, BarangMasuk, BarangKeluar, Retur |
| 6 | Pagination (offset-based, default 10) | SEMUA list query |
| 7 | **Soft Delete + Stock Reversal** (BARU) | Hapus transaksi |
| 8 | **Tanggal Validation** (BARU) | Semua field tanggal manual |

---

## 11. Verification Checklist (Manual Test)

### Supplier
- [ ] STAF & MANAJER bisa tambah supplier baru
- [ ] Hapus supplier yang masih punya BarangMasuk → ditolak
- [ ] Hapus supplier yang belum punya transaksi → berhasil
- [ ] Search supplier by nama berfungsi
- [ ] Edit supplier berfungsi

### BarangMasuk (modifikasi)
- [ ] Form tambah wajib pilih supplier
- [ ] Form tambah wajib input tanggal manual
- [ ] Tanggal masa depan ditolak
- [ ] Tanggal > 30 hari ke belakang ditolak
- [ ] Hapus barang masuk → stok berkurang
- [ ] Hapus yang membuat stok negatif → ditolak
- [ ] Tabel hanya menampilkan `deletedAt: null`

### BarangKeluar (modifikasi)
- [ ] Form tambah wajib input nama penerima
- [ ] Form tambah wajib input tanggal manual
- [ ] Hapus barang keluar → stok bertambah
- [ ] Tabel hanya menampilkan `deletedAt: null`

### Retur
- [ ] Pilih tipe MASUK → form minta nama customer
- [ ] Pilih tipe KELUAR → form minta supplier
- [ ] Retur MASUK → stok bertambah
- [ ] Retur KELUAR dengan jumlah > stok → ditolak
- [ ] Hapus retur MASUK → stok berkurang
- [ ] Hapus retur KELUAR → stok bertambah

### Laporan
- [ ] /laporan-masuk menampilkan BarangMasuk + Retur MASUK
- [ ] /laporan-keluar menampilkan BarangKeluar + Retur KELUAR
- [ ] STAF → tombol Export tidak muncul
- [ ] MANAJER → Export berfungsi
- [ ] Filter periode bekerja

### RBAC
- [ ] STAF tidak bisa akses /dashboard/pengguna
- [ ] STAF tidak bisa hit /api/laporan-masuk (return 403)
- [ ] STAF bisa CRUD supplier
- [ ] MANAJER bisa semua

### Dashboard
- [ ] Metric card "Total Supplier" muncul
- [ ] Transaksi soft-deleted tidak dihitung

### Build
- [ ] `pnpm biome check --write` → 0 errors
- [ ] `pnpm tsc --noEmit` → 0 errors
- [ ] `pnpm build` → semua route compile

---

## 12. Out of Scope

- Edit transaksi (tetap immutable selain soft delete)
- Field warna / yard / jenis kain
- Halaman history audit
- Bulk operations
- Email notification
- Multi-currency / pricing
- Multi-warehouse

---

## 13. Risiko & Mitigasi

| Risiko | Mitigasi |
|---|---|
| Stock reversal membuat stok negatif | Cek di awal transaction, throw error |
| Tanggal salah menumpuk di laporan | Validasi 30 hari ke belakang |
| Tabel lambat karena deletedAt filter | Index `@@index([deletedAt, createdAt])` |
| Data hilang saat migrasi | Development env, re-seed |
| Role lama tidak punya akses fitur baru | STAF/MANAJER tetap, menu baru ditambahkan |

---

## 14. Approval & Eksekusi

**Plan ini menunggu persetujuan akhir untuk dieksekusi.**

Eksekusi mengikuti urutan Section 9 (Phase 7.1 → 7.7). Setiap phase diakhiri dengan verifikasi. Jika ada blocker, akan dilaporkan sebelum lanjut.

**Estimasi**: 7 sub-fase, total ~1 jam tanpa interupsi.

---

_Last updated: 2026-05-20_
