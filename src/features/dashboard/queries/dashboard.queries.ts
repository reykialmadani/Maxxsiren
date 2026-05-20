import { prisma } from "@/server/db"

export async function getDashboardSummary() {
	const startOfDay = new Date()
	startOfDay.setHours(0, 0, 0, 0)

	const [
		totalJenisBarang,
		stokAggregate,
		stokRendahItems,
		totalSupplier,
		barangMasukHariIni,
		barangKeluarHariIni,
		returHariIni,
	] = await Promise.all([
		prisma.barang.count({ where: { deletedAt: null } }),
		prisma.barang.aggregate({
			where: { deletedAt: null },
			_sum: { stok: true },
		}),
		prisma.barang.findMany({
			where: { deletedAt: null },
			select: { id: true, stok: true, minStok: true },
		}),
		prisma.supplier.count(),
		prisma.barangMasuk.count({
			where: { deletedAt: null, tanggalMasuk: { gte: startOfDay } },
		}),
		prisma.barangKeluar.count({
			where: { deletedAt: null, tanggalKeluar: { gte: startOfDay } },
		}),
		prisma.retur.count({
			where: { deletedAt: null, tanggalRetur: { gte: startOfDay } },
		}),
	])

	const stokRendahCount = stokRendahItems.filter((b) => b.stok <= b.minStok).length
	const transaksiHariIni = barangMasukHariIni + barangKeluarHariIni + returHariIni

	return {
		totalJenisBarang,
		totalStok: stokAggregate._sum.stok ?? 0,
		stokRendah: stokRendahCount,
		totalSupplier,
		transaksiHariIni,
	}
}

export async function getTransaksiTerkini(limit = 10) {
	const [masuk, keluar, retur] = await Promise.all([
		prisma.barangMasuk.findMany({
			where: { deletedAt: null },
			take: limit,
			orderBy: { tanggalMasuk: "desc" },
			include: {
				barang: { select: { kode: true, namaBarang: true, deletedAt: true } },
				user: { select: { nama: true } },
			},
		}),
		prisma.barangKeluar.findMany({
			where: { deletedAt: null },
			take: limit,
			orderBy: { tanggalKeluar: "desc" },
			include: {
				barang: { select: { kode: true, namaBarang: true, deletedAt: true } },
				user: { select: { nama: true } },
			},
		}),
		prisma.retur.findMany({
			where: { deletedAt: null },
			take: limit,
			orderBy: { tanggalRetur: "desc" },
			include: {
				barang: { select: { kode: true, namaBarang: true, deletedAt: true } },
				user: { select: { nama: true } },
			},
		}),
	])

	const combined = [
		...masuk.map((m) => ({
			id: m.id,
			tipe: "masuk" as const,
			createdAt: m.tanggalMasuk,
			jumlah: m.jumlah,
			keterangan: m.keterangan,
			barang: m.barang,
			user: m.user,
		})),
		...keluar.map((k) => ({
			id: k.id,
			tipe: "keluar" as const,
			createdAt: k.tanggalKeluar,
			jumlah: k.jumlah,
			keterangan: k.keterangan,
			barang: k.barang,
			user: k.user,
		})),
		...retur.map((r) => ({
			id: r.id,
			tipe: r.tipe === "MASUK" ? ("retur-masuk" as const) : ("retur-keluar" as const),
			createdAt: r.tanggalRetur,
			jumlah: r.jumlah,
			keterangan: r.keterangan,
			barang: r.barang,
			user: r.user,
		})),
	]

	return combined.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, limit)
}

export async function getStokKritisDetail(limit = 5) {
	const items = await prisma.barang.findMany({
		where: { deletedAt: null },
		include: { kategori: { select: { nama: true } } },
		orderBy: { stok: "asc" },
		take: 20,
	})

	return items.filter((b) => b.stok <= b.minStok).slice(0, limit)
}

export type TransaksiTerkiniItem = Awaited<ReturnType<typeof getTransaksiTerkini>>[number]
export type StokKritisItem = Awaited<ReturnType<typeof getStokKritisDetail>>[number]
