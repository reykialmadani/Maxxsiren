# Upgrade Plan V4 — Laporan Informatif & User-Friendly

> **Status**: Disetujui untuk eksekusi
> **Scope**: Redesain halaman Laporan Masuk & Keluar — preview tabel, summary cards, chart mini, quick presets
> **Constraint**: Tidak mengubah RBAC, tidak menambah dependency (recharts sudah di V3), arsitektur Server Component

---

## 1. Ringkasan Perubahan

Halaman laporan saat ini hanya berisi filter periode + 2 tombol unduh. Upgrade ini menambahkan:

| # | Komponen Baru | Fungsi |
|---|---|---|
| 1 | Quick Preset Buttons | "7 Hari Terakhir", "Bulan Ini", "Bulan Lalu", "30 Hari Terakhir" |
| 2 | Summary Cards | Total Transaksi, Total Unit, Supplier/Penerima Unik, Barang Terbanyak |
| 3 | Preview Tabel | Tabel data persis seperti yang akan di-export, dengan pagination |
| 4 | Chart Mini | BarChart tren per hari dalam periode (recharts) |
| 5 | Tombol Detail per Row | Link ke `/dashboard/barang/[id]` dari setiap baris |
| 6 | Default 30 Hari | Halaman auto-load data 30 hari terakhir saat dibuka |

**Tidak ada dependency baru** — `recharts` sudah di-install di V3.

---

## 2. Keputusan yang Sudah Disetujui

| # | Keputusan | Alasan |
|---|---|---|
| 1 | Exclude soft-deleted transactions dari preview & export | Cleaner report, konsisten |
| 2 | Default periode: 30 hari terakhir (auto-load) | Sesuai rule validasi tanggal |
| 3 | Architecture: Server Component + searchParams | Konsisten dengan pola existing, bookmarkable URL |
| 4 | Chart mini: Ya (BarChart tren per hari) | recharts sudah tersedia dari V3 |
| 5 | Sort: tanggal desc + filter tipe saja | Cukup untuk preview, tidak overkill |
| 6 | Tombol Detail di setiap row preview | Drill-down ke detail barang |
| 7 | Kolom responsive: sembunyikan beberapa di mobile | `hidden md:table-cell` |
| 8 | Empty state jika data kosong + disable tombol unduh | UX yang jelas |
| 9 | Format tanggal sama di preview dan export | Konsistensi |

---

## 3. Flow Baru

```
User buka /dashboard/laporan-masuk
  → Default: 30 hari terakhir auto-loaded
  → Summary cards tampil (4 angka)
  → Chart mini tampil (tren per hari)
  → Preview tabel tampil (paginated, 10 per page)
  → Tombol Unduh PDF/Excel aktif (MANAJER only)

User ubah filter:
  → Pilih preset ATAU input manual tanggal
  → Klik "Tampilkan Data" (atau auto-submit via preset)
  → URL berubah (?dateFrom=...&dateTo=...)
  → Server re-render dengan data baru
  → Summary + chart + tabel update

User klik Unduh:
  → File PDF/Excel terdownload (data sesuai filter aktif)
```

---

## 4. Layout Halaman Laporan (Baru)

```
┌─────────────────────────────────────────────────────────────────┐
│ PageHeader: icon FileDown/FileUp, "Laporan Barang Masuk/Keluar"  │
├─────────────────────────────────────────────────────────────────┤
│ Filter Section:                                                  │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Quick Presets: [7 Hari] [Bulan Ini] [Bulan Lalu] [30 Hari] │ │
│ │ Manual: [Tanggal Mulai] [Tanggal Akhir] [Tampilkan Data]   │ │
│ │ Export: [Unduh PDF] [Unduh Excel]  (MANAJER only)           │ │
│ └─────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│ Summary Cards (4 cards):                                         │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│ │ Total    │ │ Total    │ │ Supplier/│ │ Barang   │           │
│ │ Transaksi│ │ Unit     │ │ Penerima │ │ Terbanyak│           │
│ │          │ │          │ │ Unik     │ │          │           │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘           │
├─────────────────────────────────────────────────────────────────┤
│ Chart Mini:                                                      │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ BarChart: jumlah transaksi per hari dalam periode            │ │
│ │ X-axis: tanggal, Y-axis: jumlah unit                        │ │
│ │ Warna: primary untuk masuk, danger untuk keluar             │ │
│ └─────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│ Preview Tabel:                                                   │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Filter: [Semua] [Barang Masuk/Keluar] [Retur]               │ │
│ │ ─────────────────────────────────────────────────────────── │ │
│ │ No | Tanggal | Tipe | Supplier/Penerima | Barang | Jml | .. │ │
│ │ 1  | 18 Mei  | Masuk| PT Supplier A     | SRN-001| +10 | ..│ │
│ │ 2  | 17 Mei  | Retur| Customer B        | STR-002| +1  | ..│ │
│ │ ─────────────────────────────────────────────────────────── │ │
│ │ Pagination: Menampilkan 1-10 dari 45 data                   │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. Komponen Baru

### 5.1 `LaporanSummaryCards.tsx`

Props berbeda untuk masuk vs keluar:

**Laporan Masuk:**
| Card | Value | Icon |
|---|---|---|
| Total Transaksi | count(barangMasuk + returMasuk) | `Hash` |
| Total Unit Masuk | sum(jumlah) | `ArrowDownToLine` |
| Supplier Aktif | count(distinct supplierId) | `Truck` |
| Barang Terbanyak | nama barang dengan jumlah tertinggi | `TrendingUp` |

**Laporan Keluar:**
| Card | Value | Icon |
|---|---|---|
| Total Transaksi | count(barangKeluar + returKeluar) | `Hash` |
| Total Unit Keluar | sum(jumlah) | `ArrowUpFromLine` |
| Penerima Unik | count(distinct namaPenerima) | `Users` |
| Barang Terbanyak | nama barang dengan jumlah tertinggi | `TrendingUp` |

### 5.2 `LaporanChart.tsx`

- `"use client"` (recharts)
- BarChart dari recharts
- X-axis: tanggal (format "dd MMM")
- Y-axis: jumlah unit
- Single bar color: `var(--primary)` untuk masuk, `var(--danger)` untuk keluar
- Responsive: `ResponsiveContainer` width 100%

### 5.3 `LaporanPreviewTabel.tsx`

- Server Component (data passed via props)
- Kolom: No, Tanggal, Tipe, Supplier/Penerima, Kode, Nama Barang, Jumlah, Keterangan, Dicatat oleh, Aksi (Detail)
- Kolom responsive: Keterangan dan Dicatat oleh → `hidden md:table-cell`
- Pagination via URL params (`?page=1&pageSize=10`)
- Filter tipe via URL params (`?tipe=all|barang|retur`)

### 5.4 `LaporanFilterSection.tsx`

- `"use client"` (butuh state untuk presets + form submit)
- Quick preset buttons (update dateFrom/dateTo lalu submit)
- Manual date inputs
- Tombol "Tampilkan Data" → navigate ke URL dengan params
- Tombol Unduh PDF/Excel (conditional: MANAJER only via prop `canExport`)

---

## 6. Queries Baru

```typescript
// src/features/laporan/queries/laporan.queries.ts (tambahan)

// Summary statistics untuk periode
getLaporanMasukSummary(filter): {
  totalTransaksi: number
  totalUnit: number
  supplierUnik: number
  barangTerbanyak: { nama: string; jumlah: number } | null
}

getLaporanKeluarSummary(filter): {
  totalTransaksi: number
  totalUnit: number
  penerimaUnik: number
  barangTerbanyak: { nama: string; jumlah: number } | null
}

// Tren per hari untuk chart
getLaporanMasukTrenHarian(filter): { tanggal: string; jumlah: number }[]
getLaporanKeluarTrenHarian(filter): { tanggal: string; jumlah: number }[]

// Paginated preview (existing getLaporanMasukData/KeluarData sudah ada, perlu paginate)
getLaporanMasukPaginated(filter, page, pageSize, tipe?): PaginatedResult
getLaporanKeluarPaginated(filter, page, pageSize, tipe?): PaginatedResult
```

---

## 7. Perubahan File

### File Baru

```
src/features/laporan/components/
├── LaporanSummaryCards.tsx
├── LaporanChart.tsx
├── LaporanPreviewTabel.tsx
└── LaporanFilterSection.tsx        (replace FormFilterLaporan.tsx)
```

### File Dimodifikasi

```
src/features/laporan/queries/laporan.queries.ts    (+ summary, tren, paginated queries)
src/app/dashboard/laporan-masuk/page.tsx            (full rewrite — Server Component with data)
src/app/dashboard/laporan-keluar/page.tsx           (full rewrite — Server Component with data)
src/features/laporan/index.ts                       (update exports)
```

### File Dihapus

```
src/features/laporan/components/FormFilterLaporan.tsx   (replaced by LaporanFilterSection.tsx)
```

---

## 8. URL Params Schema

```
/dashboard/laporan-masuk?dateFrom=2026-04-21&dateTo=2026-05-21&page=1&pageSize=10&tipe=all
/dashboard/laporan-keluar?dateFrom=2026-04-21&dateTo=2026-05-21&page=1&pageSize=10&tipe=all
```

Default (saat halaman dibuka tanpa params):
- `dateFrom`: 30 hari yang lalu (computed server-side)
- `dateTo`: hari ini
- `page`: 1
- `pageSize`: 10
- `tipe`: "all"

---

## 9. Quick Preset Logic

```typescript
const presets = {
  "7-hari": { dateFrom: today - 7 days, dateTo: today },
  "bulan-ini": { dateFrom: first day of current month, dateTo: today },
  "bulan-lalu": { dateFrom: first day of last month, dateTo: last day of last month },
  "30-hari": { dateFrom: today - 30 days, dateTo: today },
}
```

Klik preset → update URL params → page re-render.

---

## 10. Responsive Considerations

| Breakpoint | Behavior |
|---|---|
| Mobile (< md) | Summary cards: 2 cols. Chart: full width. Tabel: hide Keterangan + Dicatat oleh. Preset buttons: wrap. |
| Tablet (md) | Summary cards: 4 cols. Chart: full width. Tabel: show all columns. |
| Desktop (lg+) | Same as tablet, wider spacing. |

---

## 11. Phase Breakdown Eksekusi

### Phase 9.1 — Queries
1. Tambah `getLaporanMasukSummary` dan `getLaporanKeluarSummary`
2. Tambah `getLaporanMasukTrenHarian` dan `getLaporanKeluarTrenHarian`
3. Tambah `getLaporanMasukPaginated` dan `getLaporanKeluarPaginated`

### Phase 9.2 — Components
1. Create `LaporanFilterSection.tsx` (client, presets + manual + export buttons)
2. Create `LaporanSummaryCards.tsx` (server, 4 cards)
3. Create `LaporanChart.tsx` (client, recharts BarChart)
4. Create `LaporanPreviewTabel.tsx` (server, paginated table + filter tipe)

### Phase 9.3 — Pages Rewrite
1. Rewrite `/dashboard/laporan-masuk/page.tsx` (Server Component, fetch all data, pass to components)
2. Rewrite `/dashboard/laporan-keluar/page.tsx`
3. Delete old `FormFilterLaporan.tsx`
4. Update `src/features/laporan/index.ts`

### Phase 9.4 — Verify
- `pnpm biome check --write`
- `pnpm tsc --noEmit`
- `pnpm build`

---

## 12. Verification Checklist

### Filter
- [ ] Halaman auto-load 30 hari terakhir saat dibuka
- [ ] Quick preset "7 Hari" berfungsi
- [ ] Quick preset "Bulan Ini" berfungsi
- [ ] Quick preset "Bulan Lalu" berfungsi
- [ ] Quick preset "30 Hari" berfungsi
- [ ] Manual date input berfungsi
- [ ] Tombol "Tampilkan Data" update URL dan re-render

### Summary Cards
- [ ] Total Transaksi akurat
- [ ] Total Unit akurat
- [ ] Supplier/Penerima Unik akurat
- [ ] Barang Terbanyak tampil dengan nama + jumlah

### Chart
- [ ] BarChart tampil dengan data per hari
- [ ] Responsive di mobile (full width)
- [ ] Tooltip saat hover bar

### Preview Tabel
- [ ] Data sesuai filter periode
- [ ] Pagination berfungsi (10/25/50)
- [ ] Filter tipe (Semua/Barang/Retur) berfungsi
- [ ] Tombol Detail link ke `/dashboard/barang/[id]`
- [ ] Kolom Keterangan + Dicatat oleh hidden di mobile
- [ ] Empty state jika data kosong

### Export
- [ ] STAF: tombol Unduh tidak muncul
- [ ] MANAJER: tombol Unduh muncul
- [ ] PDF terdownload dengan data sesuai filter
- [ ] Excel terdownload dengan data sesuai filter
- [ ] Tombol disabled jika data kosong

### Build
- [ ] `pnpm biome check --write` → 0 errors
- [ ] `pnpm tsc --noEmit` → 0 errors
- [ ] `pnpm build` → semua route compile

---

## 13. Out of Scope

- Grafik perbandingan antar periode (month-over-month)
- Export per supplier / per barang (hanya global per periode)
- Print preview (browser print dialog)
- Scheduled report (auto-generate tiap bulan)
- Email report

---

## 14. Approval & Eksekusi

**Plan ini menunggu persetujuan akhir untuk dieksekusi.**

Eksekusi mengikuti urutan Section 11 (Phase 9.1 → 9.4). Estimasi: ~30 menit.

---

_Last updated: 2026-05-21_
