# INFORMASI PEMBARUAN SISTEM — Maxxsiren Inventory v2

> **Tujuan dokumen**: Mendokumentasikan pembaruan sistem yang telah diimplementasikan setelah versi awal selesai dibangun. Dokumen ini disusun dalam format **delta** untuk dipasangkan dengan laporan tugas akhir versi sebelumnya, sehingga hanya bagian yang mengalami perubahan, penyesuaian, atau penambahan yang dijelaskan.
>
> **Status laporan TA**: Versi lama (Bab I–III) sudah selesai. Dokumen ini menjadi acuan pembaruan untuk Bab I–III (fokus teknis), dengan pembaruan Bab IV (Implementasi) dan Bab V (Pengujian) akan dilakukan kemudian.
>
> **Cakupan**: logika, fitur, arsitektur, basis data, dan teknologi pendukung sistem versi terbaru.

---

## DAFTAR ISI

1. Ringkasan Eksekutif Pembaruan
2. Pembaruan Bab I — Pendahuluan
3. Pembaruan Bab II — Tinjauan Pustaka
4. Pembaruan Bab III — Analisis dan Perancangan
5. Spesifikasi Teknologi Implementasi
6. Catatan untuk Bab IV dan V

---

## 1. Ringkasan Eksekutif Pembaruan

Pengembangan sistem inventaris Maxxsiren telah melalui dua siklus utama. Siklus pertama menghasilkan sistem dasar yang mencakup pengelolaan data master barang, pencatatan transaksi masuk/keluar, pemantauan stok, dan pelaporan periodik dalam format PDF/Excel sesuai Elisitasi Final pada laporan versi lama.

Pada siklus kedua, sistem mengalami perluasan ruang lingkup yang mempertahankan tujuan utama (pengelolaan inventaris terpusat dan real-time) namun menambahkan kapabilitas yang diperlukan untuk operasional yang lebih realistis. Pembaruan utama meliputi:

| # | Kategori Pembaruan | Bentuk Pembaruan |
|---|---|---|
| 1 | Modul Baru — Supplier | Pengelolaan data pemasok terintegrasi dengan transaksi barang masuk |
| 2 | Modul Baru — Retur | Pencatatan retur dengan dua tipe (MASUK dan KELUAR) yang berdampak otomatis pada stok |
| 3 | Soft Delete + Stock Reversal | Transaksi yang dibatalkan tetap tersimpan sebagai jejak audit, dengan stok dipulihkan secara atomik |
| 4 | Tanggal Manual | Tanggal transaksi dapat diisi manual (rentang 30 hari ke belakang) sesuai realitas operasional |
| 5 | Halaman Detail Barang | Menampilkan riwayat aktivitas (activity log), kontribusi per supplier, dan barcode label CODE128 |
| 6 | Penyempurnaan Dashboard | Penambahan grafik tren transaksi 7 hari, breakdown stok per kategori, top supplier, dan top barang keluar |
| 7 | Penyempurnaan Laporan | Pemisahan menjadi Laporan Masuk dan Laporan Keluar, dilengkapi summary cards, chart tren, dan preview tabel |
| 8 | Pemisahan Hak Akses Ekspor | Hanya Manajer yang berhak mengunduh PDF/Excel laporan |
| 9 | Atribut Visual | Field gambar barang (URL) dan dropdown satuan terstandar |
| 10 | Responsif Mobile | Sidebar dapat diakses sebagai drawer pada perangkat dengan layar kecil |

---

## 2. Pembaruan Bab I — Pendahuluan

### 2.1 Tambahan Identifikasi Masalah

Pada versi lama, identifikasi masalah berfokus pada tiga aspek: fragmentasi data, inefisiensi pemantauan stok, dan keterlambatan pelaporan. Pengamatan lanjutan terhadap proses operasional Maxxsiren mengungkap tiga permasalahan tambahan:

**4. Tidak Terlacaknya Asal-Usul Stok Barang (Lack of Stock Provenance)**
Pada sistem manual, stok suatu barang merupakan agregasi tunggal tanpa rincian dari supplier mana barang berasal, kapan barang tiba, dan siapa yang mencatatnya. Akibatnya, ketika terjadi keluhan kualitas atau perlu retur ke supplier tertentu, pelacakan dilakukan secara manual.

**5. Tidak Adanya Mekanisme Pencatatan Retur**
Sistem berjalan tidak memiliki kategori transaksi khusus untuk retur, baik retur dari pelanggan maupun retur ke supplier. Retur biasanya dicatat sebagai transaksi biasa atau bahkan tidak dicatat, menyebabkan inkonsistensi data stok.

**6. Tidak Adanya Jejak Audit untuk Transaksi Dibatalkan**
Apabila terdapat kesalahan input dalam pencatatan barang masuk atau keluar, satu-satunya cara mengoreksi adalah dengan mencoret manual pada buku catatan. Tidak ada riwayat siapa yang membatalkan, kapan, dan apa alasannya.

### 2.2 Penyesuaian Ruang Lingkup

Ruang lingkup pada versi pembaruan diperluas menjadi:

1. Perancangan sistem informasi inventaris berbasis web.
2. Pengelolaan data barang (CRUD).
3. **(BARU)** Pengelolaan data pemasok/supplier (CRUD).
4. Pengelolaan transaksi barang masuk dan barang keluar.
5. **(BARU)** Pengelolaan transaksi retur masuk dan retur keluar.
6. Monitoring jumlah stok barang yang tersedia.
7. **(BARU)** Penyajian halaman detail barang dengan jejak aktivitas (activity log).
8. Penyediaan laporan inventaris (terpisah masuk dan keluar) dengan ekspor PDF dan Excel.
9. Pengembangan sistem menggunakan metode Waterfall.

### 2.3 Penyesuaian Batasan Masalah

Dua batasan tambahan:
- Sistem tidak menyediakan fitur pengeditan transaksi. Transaksi yang sudah disimpan bersifat **immutable**, kesalahan ditangani melalui mekanisme pembatalan (soft delete) yang memulihkan stok secara atomik.
- Sistem tidak menyediakan fitur pemindaian barcode (scanner). Barcode hanya berbentuk label cetak visual untuk identifikasi fisik barang di gudang.

### 2.4 Penyesuaian Tujuan Penelitian

Tiga tujuan operasional tambahan:

7. Menyediakan pengelolaan data pemasok yang terintegrasi dengan transaksi barang masuk untuk memungkinkan pelacakan asal-usul stok.
8. Menyediakan mekanisme pencatatan retur yang mempengaruhi stok secara atomik sesuai dengan tipe retur.
9. Menyediakan halaman detail barang yang menampilkan riwayat aktivitas lengkap (activity log) sebagai sarana audit dan pelacakan.

---

## 3. Pembaruan Bab II — Tinjauan Pustaka

### 3.1 Konsep Soft Delete dan Stock Reversal

Pada sistem informasi yang menyimpan data transaksional, penghapusan data secara fisik (hard delete) memiliki risiko hilangnya jejak audit. **Soft delete** adalah mekanisme penandaan record sebagai "telah dihapus" tanpa menghapusnya secara fisik dari basis data, diimplementasikan dengan kolom seperti `deletedAt` bertipe timestamp.

Pada konteks sistem inventaris, soft delete saja tidak cukup. Karena setiap transaksi memiliki dampak terhadap saldo stok, pembatalan transaksi harus disertai dengan **stock reversal**, yaitu pengembalian stok ke kondisi sebelum transaksi dilakukan. Mekanisme ini harus berjalan secara **atomik** menggunakan transaksi basis data.

### 3.2 Konsep Discriminated Union pada Domain Retur

Untuk mengakomodasi dua jenis retur dengan logika berbeda (retur masuk yang menambah stok dan retur keluar yang mengurangi stok), digunakan pola **discriminated union**, yaitu skema yang membedakan jenis record melalui field penanda (`tipe`).

Satu tabel `Retur` dapat menampung dua jenis transaksi yang dipisahkan secara logis melalui kolom `tipe` bernilai MASUK atau KELUAR. Validasi spesifik per tipe dilakukan pada lapisan aplikasi menggunakan Zod schema, bukan melalui kendala basis data.

### 3.3 Konsep Server Component pada Next.js App Router

Sistem versi pembaruan dibangun menggunakan **Next.js 15 dengan App Router**, yang memperkenalkan **React Server Components**. Komponen jenis ini dirender di server tanpa mengirimkan kode JavaScript-nya ke browser, mengurangi ukuran bundel dan meningkatkan performa.

Komponen interaktif ditandai dengan direktif `"use client"`. Untuk pemrosesan input pengguna yang bersifat mutasi, Next.js menyediakan **Server Actions** dengan direktif `"use server"`.

### 3.4 Konsep Role-Based Access Control (RBAC)

**RBAC** adalah model otorisasi yang membatasi akses sistem berdasarkan peran pengguna. Pada sistem Maxxsiren versi pembaruan:
- **STAF**: operator harian dengan hak akses penuh terhadap operasi pencatatan.
- **MANAJER**: mewarisi seluruh hak akses STAF, ditambah hak eksklusif untuk mengekspor laporan dan mengelola pengguna.

Informasi peran disimpan dalam **JWT** pada `app_metadata` Supabase Auth, sehingga tidak dapat dimodifikasi dari sisi klien.

### 3.5 Linear Barcode CODE128

**CODE128** adalah standar barcode linier (1D) yang mampu mengkodekan seluruh karakter ASCII. Dipilih karena keserbagunaannya dalam mengkodekan kombinasi huruf dan angka pada kode barang Maxxsiren (contoh: SRN-001, STR-002).

Pada sistem ini, barcode hanya berfungsi sebagai **label cetak visual** yang ditempelkan pada barang fisik untuk identifikasi cepat di gudang.

---

## 4. Pembaruan Bab III — Analisis dan Perancangan

### 4.1 Pembaruan Hasil Wawancara

Setelah sistem dasar berjalan, dilakukan evaluasi pasca-implementasi yang menghasilkan kebutuhan tambahan:

| # | Kebutuhan Tambahan | Sumber |
|---|---|---|
| 1 | Pencatatan supplier untuk setiap transaksi barang masuk | Manajer |
| 2 | Pencatatan retur (dari customer dan ke supplier) | Manajer & Staf |
| 3 | Mekanisme koreksi kesalahan input transaksi tanpa menghilangkan jejak | Staf |
| 4 | Halaman detail per barang untuk audit pergerakan stok | Manajer |
| 5 | Visualisasi tren transaksi pada dashboard | Manajer |
| 6 | Pemisahan laporan menjadi laporan masuk dan laporan keluar | Manajer |
| 7 | Akses sistem dari perangkat mobile | Staf |
| 8 | Kemampuan input tanggal transaksi secara manual | Staf |

### 4.2 Pembaruan Elisitasi Final

#### Functional Requirements

| Kebutuhan |
|---|
| Menampilkan halaman login untuk autentikasi |
| Membedakan hak akses antara Staf dan Manajer |
| Mengelola data master barang (CRUD) |
| Mengelola data kategori barang |
| **(BARU)** Mengelola data pemasok/supplier (CRUD) |
| Mencatat barang masuk **(REVISI: + supplier wajib, + tanggal manual)** |
| Mencatat barang keluar **(REVISI: + nama penerima wajib, + tanggal manual)** |
| **(BARU)** Mencatat retur (tipe MASUK dan KELUAR) yang otomatis menyesuaikan stok |
| **(BARU)** Membatalkan transaksi (soft delete) dengan pemulihan stok atomik |
| Menampilkan stok barang secara real-time |
| Memberikan notifikasi peringatan stok rendah |
| Menampilkan riwayat transaksi |
| **(BARU)** Menampilkan halaman detail barang dengan activity log |
| **(BARU)** Menampilkan barcode label CODE128 dari kode barang |
| Pencarian dan filter barang |
| **(REVISI)** Laporan terpisah untuk barang masuk dan barang keluar |
| **(REVISI)** Mengunduh laporan PDF/Excel — terbatas Manajer |
| **(REVISI)** Dashboard ringkasan dengan grafik tren 7 hari, breakdown stok per kategori, top supplier, top barang keluar |
| Mengelola data pengguna sistem |
| Logout dari sistem |

#### Non-Functional Requirements (Tambahan)

- Sistem mendukung tampilan responsif pada perangkat mobile dengan navigasi drawer.
- Sistem mempertahankan integritas stok melalui transaksi basis data (atomicity).

### 4.3 Pembaruan Pengguna Sistem

| Modul / Aksi | Staf | Manajer |
|---|---|---|
| Login & Logout | Ya | Ya |
| Lihat Dashboard | Ya | Ya |
| CRUD Supplier | Ya | Ya |
| CRUD Barang | Ya | Ya |
| CRUD Kategori | Ya | Ya |
| Lihat Stok | Ya | Ya |
| Input Transaksi Barang Masuk/Keluar/Retur | Ya | Ya |
| Membatalkan Transaksi (soft delete) | Ya | Ya |
| Lihat & Filter Laporan | Ya | Ya |
| **Ekspor Laporan PDF/Excel** | Tidak | Ya |
| **Manajemen Pengguna** | Tidak | Ya |

### 4.4 Perancangan Basis Data (ERD Pembaruan)

#### Tabel Baru

**Tabel `Supplier`**

| Field | Tipe | Keterangan |
|---|---|---|
| id | String (cuid) | Primary key |
| nama | String | Nama pemasok |
| telepon | String | Nomor telepon |
| alamat | String | Alamat lengkap |
| createdAt | DateTime | Waktu pembuatan |
| updatedAt | DateTime | Waktu pembaruan |

**Tabel `Retur`**

| Field | Tipe | Keterangan |
|---|---|---|
| id | String (cuid) | Primary key |
| tipe | Enum (MASUK / KELUAR) | Diskriminator jenis retur |
| barangId | String | FK ke Barang |
| userId | String | FK ke User |
| jumlah | Int | Jumlah unit yang diretur |
| keterangan | String? | Catatan opsional |
| tanggalRetur | DateTime | Tanggal retur (input manual) |
| supplierId | String? | FK ke Supplier, wajib untuk tipe KELUAR |
| namaPenerima | String? | Wajib untuk tipe MASUK |
| deletedAt | DateTime? | Penanda soft delete |
| createdAt | DateTime | Waktu pembuatan |

#### Modifikasi Tabel Existing

**Barang** menambah field: `gambarUrl` (String?, opsional URL gambar).

**BarangMasuk** menambah field: `supplierId` (FK wajib), `tanggalMasuk` (DateTime input manual), `deletedAt` (DateTime? soft delete).

**BarangKeluar** menambah field: `namaPenerima` (String wajib), `tanggalKeluar` (DateTime input manual), `deletedAt` (DateTime? soft delete).

**User** tidak berubah secara struktural. Field `role` tetap di JWT `app_metadata` Supabase Auth.

#### Indeks Tambahan

- BarangMasuk: index pada (deletedAt, createdAt) dan (tanggalMasuk)
- BarangKeluar: index pada (deletedAt, createdAt) dan (tanggalKeluar)
- Retur: index pada (deletedAt, createdAt), (tipe), dan (tanggalRetur)

### 4.5 Pembaruan Use Case Diagram

**Use case baru — Aktor Staf**: Mengelola Data Supplier (CRUD), Mencatat Retur Masuk, Mencatat Retur Keluar, Membatalkan Transaksi, Melihat Detail Barang, Mencetak Label Barcode.

**Use case baru — Aktor Manajer (mewarisi Staf)**: Mengekspor Laporan PDF, Mengekspor Laporan Excel, Mengelola Pengguna Sistem.

### 4.6 Pembaruan Activity Diagram

- **Pencatatan Barang Masuk (Revisi)**: ditambah langkah "Pilih Supplier" dan "Input Tanggal Masuk".
- **Pencatatan Retur**: pilih tipe MASUK/KELUAR → render field sesuai tipe → input data → validasi stok untuk KELUAR → simpan dengan stock adjustment atomik.
- **Pembatalan Transaksi**: pilih transaksi → konfirmasi → verifikasi stok cukup untuk reversal → tandai deletedAt + balikkan stok dalam satu transaksi atomik.
- **Lihat Detail Barang**: pilih barang → ambil data master + statistik + kontribusi supplier + activity log → render dengan barcode label.

### 4.7 Pembaruan Class Diagram

- Kelas `Supplier` dengan asosiasi 1..n ke `BarangMasuk` dan 1..n ke `Retur` (tipe KELUAR).
- Kelas `Retur` dengan asosiasi n..1 ke `Barang`, n..1 ke `User`, dan n..0..1 ke `Supplier`.
- Field tambahan pada `BarangMasuk`, `BarangKeluar`, `Retur`, `Barang`.

### 4.8 Pembaruan Sequence Diagram

**Skenario: Mencatat Barang Masuk**
1. Staf input data (supplier, barang, jumlah, tanggal) di form
2. Form mengirim ke Server Action `tambahBarangMasuk` dengan sesi
3. Validasi Zod (cek format & rentang tanggal)
4. Transaksi atomik basis data: Insert ke BarangMasuk + Update Barang.stok increment
5. revalidatePath untuk refresh halaman
6. Antarmuka menampilkan notifikasi sukses

**Skenario: Membatalkan Barang Keluar**
1. Staf klik tombol batalkan
2. Konfirmasi dialog
3. Server Action `hapusBarangKeluar` dengan id + sesi
4. Transaksi atomik: cek belum dibatalkan, update deletedAt, increment stok kembali
5. revalidatePath
6. Tabel diperbarui

**Skenario: Mencatat Retur Polimorfik**
1. Staf pilih tipe retur (MASUK/KELUAR)
2. Form render field sesuai tipe
3. Server Action `tambahRetur`
4. Validasi Zod discriminated union
5. Transaksi atomik:
   - Tipe MASUK: insert + stok increment
   - Tipe KELUAR: cek stok cukup → insert + stok decrement
6. ActionResult sukses

### 4.9 Matriks Pemetaan Masalah dan Solusi (Tambahan)

| Identifikasi Masalah | Solusi |
|---|---|
| Lack of Stock Provenance | Modul Supplier + field supplierId wajib pada BarangMasuk + halaman detail dengan kontribusi per supplier |
| Tidak Ada Mekanisme Retur | Modul Retur dua tipe (MASUK menambah stok, KELUAR mengurangi stok) atomik |
| Tidak Ada Jejak Audit Pembatalan | Soft delete + stock reversal — transaksi tetap tersimpan dengan label "(Dibatalkan)" |

---

## 5. Spesifikasi Teknologi Implementasi

| Lapisan | Teknologi | Versi | Justifikasi |
|---|---|---|---|
| Bahasa Pemrograman | TypeScript | 5.9.x | Strict typing |
| Framework | Next.js (App Router) | 15.2.6 | Full-stack dengan Server Components & Actions |
| UI Library | React | 19.2.x | Library dasar Next.js |
| Styling | Tailwind CSS | 4.x | Utility-first dengan token desain |
| Komponen | Shadcn UI | latest | Komponen aksesibel berbasis Radix UI |
| Form | react-hook-form | 7.x | Form handling minimal re-render |
| Validasi | Zod | 4.x | Validasi runtime + inferensi tipe |
| Ikon | lucide-react | latest | SVG icons |
| Notifikasi | Sonner | latest | Toast notifications |
| Chart | Recharts | 3.x | Visualisasi data |
| Barcode | react-barcode | 1.x | Generator CODE128 |
| ORM | Prisma | 6.x | Type-safe database client |
| Database | PostgreSQL via Supabase | — | Cloud database dengan transaksi atomik |
| Autentikasi | Supabase Auth | — | JWT-based auth dengan app_metadata RBAC |
| Ekspor PDF | jsPDF | 4.x | PDF generator |
| Ekspor Excel | SheetJS (xlsx) | 0.18.x | Excel generator |
| Linter | Biome | 2.x | Lint + format performa tinggi |

### 5.1 Arsitektur Aplikasi (Feature-Sliced Design)

Sistem diorganisir dengan pola **Feature-Sliced Design (FSD)** yang membagi kode berdasarkan domain bisnis:

- `app/` — Lapisan routing
- `features/` — Logika bisnis per domain (auth, barang, supplier, barang-masuk, barang-keluar, retur, stok, laporan, dashboard, pengguna)
- `components/` — Komponen UI shared
- `server/` — Infrastruktur server-only
- `lib/` — Utilitas, validasi, types, constants

Setiap feature memiliki: `actions/`, `queries/`, `components/`, dan `index.ts`.

### 5.2 Pola Implementasi Wajib

1. **Singleton Prisma Client** — instance basis data tunggal.
2. **Server Action ActionResult** — discriminated union {success, data} atau {success: false, error}.
3. **Stock Concurrency Guard** — cek stok atomik sebelum decrement.
4. **Soft Delete + Stock Reversal** — pembatalan transaksi atomik.
5. **Default Soft Delete Filter** — query default exclude deletedAt != null.
6. **Pagination Offset-Based** — default 10, opsi 10/25/50.
7. **Force Logout pada Perubahan Role** — invalidate JWT lama.
8. **Orphan Rollback** — rollback Supabase user jika Prisma insert gagal.

### 5.3 Validasi Tanggal Manual

- Tanggal tidak boleh masa depan
- Tanggal tidak boleh lebih dari 30 hari ke belakang

Validasi via Zod schema.

### 5.4 Strict Typing — Zero `any`

Semua kode tidak menggunakan tipe `any`. Ditegakkan oleh Biome rule `noExplicitAny: error`. Tipe DB diambil dari Prisma generated types, tipe input dari Zod inference, props eksplisit.

---

## 6. Catatan untuk Bab IV dan V

Dokumen ini fokus pada pembaruan **Bab I, II, dan III**. Pembaruan untuk:

- **Bab IV (Implementasi)** — screenshot antarmuka, deployment, dokumentasi kode.
- **Bab V (Pengujian)** — tabel Black Box Testing untuk fitur baru.

Akan disusun pada dokumen terpisah ketika implementasi telah stabil.

---

## Lampiran — Dokumen Perencanaan Internal

| Dokumen | Cakupan |
|---|---|
| UPGRADE_PLAN.md | Modul Supplier, Retur, soft delete, tanggal manual, pemisahan laporan |
| UPGRADE_PLAN_V3.md | Dashboard overhaul, merge Barang+Stok, detail barang, barcode, responsive |
| UPGRADE_PLAN_V4.md | Halaman laporan informatif (preview, summary, chart) |

Verifikasi: pnpm biome check (pass), pnpm tsc --noEmit (zero errors), pnpm build (sukses).

---

_Akhir dokumen INFORMASI_NEW.md_
