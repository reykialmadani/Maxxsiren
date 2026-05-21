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

export async function getTrenTransaksi7Hari() {
	const days: { tanggal: Date; label: string }[] = []
	const now = new Date()

	for (let i = 6; i >= 0; i--) {
		const d = new Date(now)
		d.setHours(0, 0, 0, 0)
		d.setDate(d.getDate() - i)
		days.push({
			tanggal: d,
			label: d.toLocaleDateString("id-ID", { day: "2-digit", month: "short" }),
		})
	}

	const startRange = days[0].tanggal
	const endRange = new Date(now)
	endRange.setHours(23, 59, 59, 999)

	const [masukAll, keluarAll] = await Promise.all([
		prisma.barangMasuk.findMany({
			where: {
				deletedAt: null,
				tanggalMasuk: { gte: startRange, lte: endRange },
			},
			select: { tanggalMasuk: true, jumlah: true },
		}),
		prisma.barangKeluar.findMany({
			where: {
				deletedAt: null,
				tanggalKeluar: { gte: startRange, lte: endRange },
			},
			select: { tanggalKeluar: true, jumlah: true },
		}),
	])

	return days.map((day) => {
		const dayStart = day.tanggal.getTime()
		const dayEnd = dayStart + 24 * 60 * 60 * 1000
		const masuk = masukAll
			.filter((m) => {
				const t = m.tanggalMasuk.getTime()
				return t >= dayStart && t < dayEnd
			})
			.reduce((sum, m) => sum + m.jumlah, 0)
		const keluar = keluarAll
			.filter((k) => {
				const t = k.tanggalKeluar.getTime()
				return t >= dayStart && t < dayEnd
			})
			.reduce((sum, k) => sum + k.jumlah, 0)
		return { tanggal: day.label, masuk, keluar }
	})
}

export async function getStokPerKategori() {
	const result = await prisma.barang.groupBy({
		by: ["kategoriId"],
		where: { deletedAt: null },
		_sum: { stok: true },
	})

	const kategoriIds = result.map((r) => r.kategoriId)
	const kategoris = await prisma.kategori.findMany({
		where: { id: { in: kategoriIds } },
		select: { id: true, nama: true },
	})

	return result
		.map((r) => ({
			kategori: kategoris.find((k) => k.id === r.kategoriId)?.nama ?? "Tidak diketahui",
			totalStok: r._sum.stok ?? 0,
		}))
		.sort((a, b) => b.totalStok - a.totalStok)
}

export async function getTopSupplier(limit = 5) {
	const startOfMonth = new Date()
	startOfMonth.setDate(1)
	startOfMonth.setHours(0, 0, 0, 0)

	const result = await prisma.barangMasuk.groupBy({
		by: ["supplierId"],
		where: { deletedAt: null, tanggalMasuk: { gte: startOfMonth } },
		_count: { id: true },
		_sum: { jumlah: true },
	})

	const sorted = result.sort((a, b) => (b._count.id ?? 0) - (a._count.id ?? 0)).slice(0, limit)

	const supplierIds = sorted.map((r) => r.supplierId)
	const suppliers = await prisma.supplier.findMany({
		where: { id: { in: supplierIds } },
		select: { id: true, nama: true },
	})

	return sorted.map((r) => ({
		nama: suppliers.find((s) => s.id === r.supplierId)?.nama ?? "Tidak diketahui",
		totalTransaksi: r._count.id,
		totalUnit: r._sum.jumlah ?? 0,
	}))
}

export async function getTopBarangKeluar(limit = 5) {
	const startOfMonth = new Date()
	startOfMonth.setDate(1)
	startOfMonth.setHours(0, 0, 0, 0)

	const result = await prisma.barangKeluar.groupBy({
		by: ["barangId"],
		where: { deletedAt: null, tanggalKeluar: { gte: startOfMonth } },
		_sum: { jumlah: true },
	})

	const sorted = result.sort((a, b) => (b._sum.jumlah ?? 0) - (a._sum.jumlah ?? 0)).slice(0, limit)

	const barangIds = sorted.map((r) => r.barangId)
	const barangs = await prisma.barang.findMany({
		where: { id: { in: barangIds } },
		select: { id: true, namaBarang: true, kode: true },
	})

	return sorted.map((r) => {
		const b = barangs.find((b) => b.id === r.barangId)
		return {
			barangId: r.barangId,
			namaBarang: b?.namaBarang ?? "Tidak diketahui",
			kode: b?.kode ?? "-",
			totalKeluar: r._sum.jumlah ?? 0,
		}
	})
}

export type TrenTransaksi7HariItem = Awaited<ReturnType<typeof getTrenTransaksi7Hari>>[number]
export type StokPerKategoriItem = Awaited<ReturnType<typeof getStokPerKategori>>[number]
export type TopSupplierItem = Awaited<ReturnType<typeof getTopSupplier>>[number]
export type TopBarangKeluarItem = Awaited<ReturnType<typeof getTopBarangKeluar>>[number]
