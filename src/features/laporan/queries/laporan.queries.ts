import { prisma } from "@/server/db"

export type LaporanFilter = {
	dateFrom: Date
	dateTo: Date
}

export async function getLaporanBarangMasuk(filter: LaporanFilter) {
	return prisma.barangMasuk.findMany({
		where: {
			createdAt: {
				gte: filter.dateFrom,
				lte: filter.dateTo,
			},
		},
		include: {
			barang: {
				select: {
					kode: true,
					namaBarang: true,
					satuan: true,
					kategori: { select: { nama: true } },
					deletedAt: true,
				},
			},
			user: { select: { nama: true } },
		},
		orderBy: { createdAt: "asc" },
	})
}

export async function getLaporanBarangKeluar(filter: LaporanFilter) {
	return prisma.barangKeluar.findMany({
		where: {
			createdAt: {
				gte: filter.dateFrom,
				lte: filter.dateTo,
			},
		},
		include: {
			barang: {
				select: {
					kode: true,
					namaBarang: true,
					satuan: true,
					kategori: { select: { nama: true } },
					deletedAt: true,
				},
			},
			user: { select: { nama: true } },
		},
		orderBy: { createdAt: "asc" },
	})
}

export async function getLaporanStokSaatIni() {
	return prisma.barang.findMany({
		where: { deletedAt: null },
		include: { kategori: { select: { nama: true } } },
		orderBy: { namaBarang: "asc" },
	})
}

export type LaporanBarangMasukItem = Awaited<ReturnType<typeof getLaporanBarangMasuk>>[number]
export type LaporanBarangKeluarItem = Awaited<ReturnType<typeof getLaporanBarangKeluar>>[number]
export type LaporanStokItem = Awaited<ReturnType<typeof getLaporanStokSaatIni>>[number]
