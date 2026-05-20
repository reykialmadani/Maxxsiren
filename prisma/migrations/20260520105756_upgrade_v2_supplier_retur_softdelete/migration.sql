/*
  Warnings:

  - Added the required column `namaPenerima` to the `BarangKeluar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tanggalKeluar` to the `BarangKeluar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supplierId` to the `BarangMasuk` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tanggalMasuk` to the `BarangMasuk` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TipeRetur" AS ENUM ('MASUK', 'KELUAR');

-- AlterTable
ALTER TABLE "BarangKeluar" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "namaPenerima" TEXT NOT NULL,
ADD COLUMN     "tanggalKeluar" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "BarangMasuk" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "supplierId" TEXT NOT NULL,
ADD COLUMN     "tanggalMasuk" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Supplier" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "telepon" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Retur" (
    "id" TEXT NOT NULL,
    "tipe" "TipeRetur" NOT NULL,
    "barangId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "keterangan" TEXT,
    "tanggalRetur" TIMESTAMP(3) NOT NULL,
    "supplierId" TEXT,
    "namaPenerima" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Retur_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Retur_deletedAt_createdAt_idx" ON "Retur"("deletedAt", "createdAt");

-- CreateIndex
CREATE INDEX "Retur_tipe_idx" ON "Retur"("tipe");

-- CreateIndex
CREATE INDEX "Retur_tanggalRetur_idx" ON "Retur"("tanggalRetur");

-- CreateIndex
CREATE INDEX "BarangKeluar_deletedAt_createdAt_idx" ON "BarangKeluar"("deletedAt", "createdAt");

-- CreateIndex
CREATE INDEX "BarangKeluar_tanggalKeluar_idx" ON "BarangKeluar"("tanggalKeluar");

-- CreateIndex
CREATE INDEX "BarangMasuk_deletedAt_createdAt_idx" ON "BarangMasuk"("deletedAt", "createdAt");

-- CreateIndex
CREATE INDEX "BarangMasuk_tanggalMasuk_idx" ON "BarangMasuk"("tanggalMasuk");

-- AddForeignKey
ALTER TABLE "BarangMasuk" ADD CONSTRAINT "BarangMasuk_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Retur" ADD CONSTRAINT "Retur_barangId_fkey" FOREIGN KEY ("barangId") REFERENCES "Barang"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Retur" ADD CONSTRAINT "Retur_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Retur" ADD CONSTRAINT "Retur_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;
