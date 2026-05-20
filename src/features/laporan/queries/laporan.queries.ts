import { prisma } from "@/server/db"

export type LaporanFilter = {
	dateFrom: Date
	dateTo: Date
}

export async function getLaporanMasukData(filter: LaporanFilter) {
	const [barangMasuk, returMasuk] = await Promise.all([
		prisma.barangMasuk.findMany({
			where: {
				deletedAt: null,
				tanggalMasuk: { gte: filter.dateFrom, lte: filter.dateTo },
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
				supplier: { select: { nama: true } },
				user: { select: { nama: true } },
			},
			orderBy: { tanggalMasuk: "asc" },
		}),
		prisma.retur.findMany({
			where: {
				tipe: "MASUK",
				deletedAt: null,
				tanggalRetur: { gte: filter.dateFrom, lte: filter.dateTo },
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
			orderBy: { tanggalRetur: "asc" },
		}),
	])

	return { barangMasuk, returMasuk }
}

export async function getLaporanKeluarData(filter: LaporanFilter) {
	const [barangKeluar, returKeluar] = await Promise.all([
		prisma.barangKeluar.findMany({
			where: {
				deletedAt: null,
				tanggalKeluar: { gte: filter.dateFrom, lte: filter.dateTo },
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
			orderBy: { tanggalKeluar: "asc" },
		}),
		prisma.retur.findMany({
			where: {
				tipe: "KELUAR",
				deletedAt: null,
				tanggalRetur: { gte: filter.dateFrom, lte: filter.dateTo },
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
				supplier: { select: { nama: true } },
				user: { select: { nama: true } },
			},
			orderBy: { tanggalRetur: "asc" },
		}),
	])

	return { barangKeluar, returKeluar }
}

export type LaporanMasukData = Awaited<ReturnType<typeof getLaporanMasukData>>
export type LaporanKeluarData = Awaited<ReturnType<typeof getLaporanKeluarData>>
