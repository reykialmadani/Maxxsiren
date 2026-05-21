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

export type LaporanPreviewItem = {
	id: string
	source: "barang-masuk" | "barang-keluar" | "retur-masuk" | "retur-keluar"
	tipe: "barang" | "retur"
	tanggal: Date
	pihak: string
	kode: string
	namaBarang: string
	jumlah: number
	keterangan: string | null
	user: string
	barangId: string
}

export type PaginatedLaporanResult = {
	data: LaporanPreviewItem[]
	total: number
	page: number
	pageSize: number
	totalPages: number
}

export async function getLaporanMasukSummary(filter: LaporanFilter) {
	const data = await getLaporanMasukData(filter)
	const totalTransaksi = data.barangMasuk.length + data.returMasuk.length
	const totalUnit =
		data.barangMasuk.reduce((sum, m) => sum + m.jumlah, 0) +
		data.returMasuk.reduce((sum, r) => sum + r.jumlah, 0)
	const supplierIds = new Set(data.barangMasuk.map((m) => m.supplierId))
	const supplierUnik = supplierIds.size

	const barangMap = new Map<string, { nama: string; jumlah: number }>()
	for (const m of data.barangMasuk) {
		const current = barangMap.get(m.barang.namaBarang) ?? { nama: m.barang.namaBarang, jumlah: 0 }
		current.jumlah += m.jumlah
		barangMap.set(m.barang.namaBarang, current)
	}
	for (const r of data.returMasuk) {
		const current = barangMap.get(r.barang.namaBarang) ?? { nama: r.barang.namaBarang, jumlah: 0 }
		current.jumlah += r.jumlah
		barangMap.set(r.barang.namaBarang, current)
	}
	const sorted = Array.from(barangMap.values()).sort((a, b) => b.jumlah - a.jumlah)
	const barangTerbanyak = sorted.length > 0 ? sorted[0] : null

	return { totalTransaksi, totalUnit, supplierUnik, barangTerbanyak }
}

export async function getLaporanKeluarSummary(filter: LaporanFilter) {
	const data = await getLaporanKeluarData(filter)
	const totalTransaksi = data.barangKeluar.length + data.returKeluar.length
	const totalUnit =
		data.barangKeluar.reduce((sum, k) => sum + k.jumlah, 0) +
		data.returKeluar.reduce((sum, r) => sum + r.jumlah, 0)
	const penerimaSet = new Set(data.barangKeluar.map((k) => k.namaPenerima))
	const penerimaUnik = penerimaSet.size

	const barangMap = new Map<string, { nama: string; jumlah: number }>()
	for (const k of data.barangKeluar) {
		const current = barangMap.get(k.barang.namaBarang) ?? { nama: k.barang.namaBarang, jumlah: 0 }
		current.jumlah += k.jumlah
		barangMap.set(k.barang.namaBarang, current)
	}
	for (const r of data.returKeluar) {
		const current = barangMap.get(r.barang.namaBarang) ?? { nama: r.barang.namaBarang, jumlah: 0 }
		current.jumlah += r.jumlah
		barangMap.set(r.barang.namaBarang, current)
	}
	const sorted = Array.from(barangMap.values()).sort((a, b) => b.jumlah - a.jumlah)
	const barangTerbanyak = sorted.length > 0 ? sorted[0] : null

	return { totalTransaksi, totalUnit, penerimaUnik, barangTerbanyak }
}

function buildDailyBuckets(filter: LaporanFilter) {
	const buckets: { tanggal: Date; label: string }[] = []
	const start = new Date(filter.dateFrom)
	start.setHours(0, 0, 0, 0)
	const end = new Date(filter.dateTo)
	end.setHours(0, 0, 0, 0)

	const cursor = new Date(start)
	while (cursor.getTime() <= end.getTime()) {
		buckets.push({
			tanggal: new Date(cursor),
			label: cursor.toLocaleDateString("id-ID", { day: "2-digit", month: "short" }),
		})
		cursor.setDate(cursor.getDate() + 1)
	}
	return buckets
}

export async function getLaporanMasukTrenHarian(filter: LaporanFilter) {
	const data = await getLaporanMasukData(filter)
	const buckets = buildDailyBuckets(filter)

	return buckets.map((b) => {
		const dayStart = b.tanggal.getTime()
		const dayEnd = dayStart + 24 * 60 * 60 * 1000
		const masuk = data.barangMasuk
			.filter((m) => {
				const t = m.tanggalMasuk.getTime()
				return t >= dayStart && t < dayEnd
			})
			.reduce((sum, m) => sum + m.jumlah, 0)
		const retur = data.returMasuk
			.filter((r) => {
				const t = r.tanggalRetur.getTime()
				return t >= dayStart && t < dayEnd
			})
			.reduce((sum, r) => sum + r.jumlah, 0)
		return { tanggal: b.label, jumlah: masuk + retur }
	})
}

export async function getLaporanKeluarTrenHarian(filter: LaporanFilter) {
	const data = await getLaporanKeluarData(filter)
	const buckets = buildDailyBuckets(filter)

	return buckets.map((b) => {
		const dayStart = b.tanggal.getTime()
		const dayEnd = dayStart + 24 * 60 * 60 * 1000
		const keluar = data.barangKeluar
			.filter((k) => {
				const t = k.tanggalKeluar.getTime()
				return t >= dayStart && t < dayEnd
			})
			.reduce((sum, k) => sum + k.jumlah, 0)
		const retur = data.returKeluar
			.filter((r) => {
				const t = r.tanggalRetur.getTime()
				return t >= dayStart && t < dayEnd
			})
			.reduce((sum, r) => sum + r.jumlah, 0)
		return { tanggal: b.label, jumlah: keluar + retur }
	})
}

export async function getLaporanMasukPaginated(
	filter: LaporanFilter,
	page = 1,
	pageSize = 10,
	tipe: "all" | "barang" | "retur" = "all",
): Promise<PaginatedLaporanResult> {
	const data = await getLaporanMasukData(filter)

	const allItems: LaporanPreviewItem[] = []

	if (tipe === "all" || tipe === "barang") {
		for (const m of data.barangMasuk) {
			allItems.push({
				id: m.id,
				source: "barang-masuk",
				tipe: "barang",
				tanggal: m.tanggalMasuk,
				pihak: m.supplier.nama,
				kode: m.barang.kode,
				namaBarang: m.barang.namaBarang,
				jumlah: m.jumlah,
				keterangan: m.keterangan,
				user: m.user.nama,
				barangId: m.barangId,
			})
		}
	}
	if (tipe === "all" || tipe === "retur") {
		for (const r of data.returMasuk) {
			allItems.push({
				id: r.id,
				source: "retur-masuk",
				tipe: "retur",
				tanggal: r.tanggalRetur,
				pihak: r.namaPenerima ?? "-",
				kode: r.barang.kode,
				namaBarang: r.barang.namaBarang,
				jumlah: r.jumlah,
				keterangan: r.keterangan,
				user: r.user.nama,
				barangId: r.barangId,
			})
		}
	}

	allItems.sort((a, b) => b.tanggal.getTime() - a.tanggal.getTime())

	const total = allItems.length
	const skip = (page - 1) * pageSize
	const paged = allItems.slice(skip, skip + pageSize)

	return {
		data: paged,
		total,
		page,
		pageSize,
		totalPages: Math.max(1, Math.ceil(total / pageSize)),
	}
}

export async function getLaporanKeluarPaginated(
	filter: LaporanFilter,
	page = 1,
	pageSize = 10,
	tipe: "all" | "barang" | "retur" = "all",
): Promise<PaginatedLaporanResult> {
	const data = await getLaporanKeluarData(filter)

	const allItems: LaporanPreviewItem[] = []

	if (tipe === "all" || tipe === "barang") {
		for (const k of data.barangKeluar) {
			allItems.push({
				id: k.id,
				source: "barang-keluar",
				tipe: "barang",
				tanggal: k.tanggalKeluar,
				pihak: k.namaPenerima,
				kode: k.barang.kode,
				namaBarang: k.barang.namaBarang,
				jumlah: k.jumlah,
				keterangan: k.keterangan,
				user: k.user.nama,
				barangId: k.barangId,
			})
		}
	}
	if (tipe === "all" || tipe === "retur") {
		for (const r of data.returKeluar) {
			allItems.push({
				id: r.id,
				source: "retur-keluar",
				tipe: "retur",
				tanggal: r.tanggalRetur,
				pihak: r.supplier?.nama ?? "-",
				kode: r.barang.kode,
				namaBarang: r.barang.namaBarang,
				jumlah: r.jumlah,
				keterangan: r.keterangan,
				user: r.user.nama,
				barangId: r.barangId,
			})
		}
	}

	allItems.sort((a, b) => b.tanggal.getTime() - a.tanggal.getTime())

	const total = allItems.length
	const skip = (page - 1) * pageSize
	const paged = allItems.slice(skip, skip + pageSize)

	return {
		data: paged,
		total,
		page,
		pageSize,
		totalPages: Math.max(1, Math.ceil(total / pageSize)),
	}
}
