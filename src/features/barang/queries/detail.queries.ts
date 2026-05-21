import { prisma } from "@/server/db"

export async function getBarangDetail(id: string) {
	return prisma.barang.findUnique({
		where: { id },
		include: { kategori: true },
	})
}

export async function getBreakdownSupplier(barangId: string) {
	const masuk = await prisma.barangMasuk.groupBy({
		by: ["supplierId"],
		where: { barangId, deletedAt: null },
		_sum: { jumlah: true },
		_count: { id: true },
	})

	const supplierIds = masuk.map((m) => m.supplierId)
	const suppliers = await prisma.supplier.findMany({
		where: { id: { in: supplierIds } },
		select: { id: true, nama: true },
	})

	return masuk.map((m) => ({
		supplierId: m.supplierId,
		nama: suppliers.find((s) => s.id === m.supplierId)?.nama ?? "Tidak diketahui",
		totalUnit: m._sum.jumlah ?? 0,
		totalTransaksi: m._count.id,
	}))
}

export async function getActivityLog(barangId: string) {
	const [masuk, keluar, retur] = await Promise.all([
		prisma.barangMasuk.findMany({
			where: { barangId },
			include: {
				user: { select: { nama: true } },
				supplier: { select: { nama: true } },
			},
			orderBy: { tanggalMasuk: "desc" },
		}),
		prisma.barangKeluar.findMany({
			where: { barangId },
			include: { user: { select: { nama: true } } },
			orderBy: { tanggalKeluar: "desc" },
		}),
		prisma.retur.findMany({
			where: { barangId },
			include: {
				user: { select: { nama: true } },
				supplier: { select: { nama: true } },
			},
			orderBy: { tanggalRetur: "desc" },
		}),
	])

	type LogItem = {
		id: string
		tipe: "masuk" | "keluar" | "retur-masuk" | "retur-keluar"
		tanggal: Date
		jumlah: number
		pihak: string
		keterangan: string | null
		user: string
		dibatalkan: boolean
	}

	const logs: LogItem[] = [
		...masuk.map((m) => ({
			id: m.id,
			tipe: "masuk" as const,
			tanggal: m.tanggalMasuk,
			jumlah: m.jumlah,
			pihak: m.supplier.nama,
			keterangan: m.keterangan,
			user: m.user.nama,
			dibatalkan: m.deletedAt !== null,
		})),
		...keluar.map((k) => ({
			id: k.id,
			tipe: "keluar" as const,
			tanggal: k.tanggalKeluar,
			jumlah: k.jumlah,
			pihak: k.namaPenerima,
			keterangan: k.keterangan,
			user: k.user.nama,
			dibatalkan: k.deletedAt !== null,
		})),
		...retur.map((r) => ({
			id: r.id,
			tipe: r.tipe === "MASUK" ? ("retur-masuk" as const) : ("retur-keluar" as const),
			tanggal: r.tanggalRetur,
			jumlah: r.jumlah,
			pihak: r.tipe === "MASUK" ? (r.namaPenerima ?? "-") : (r.supplier?.nama ?? "-"),
			keterangan: r.keterangan,
			user: r.user.nama,
			dibatalkan: r.deletedAt !== null,
		})),
	]

	return logs.sort((a, b) => b.tanggal.getTime() - a.tanggal.getTime())
}

export async function getBarangStats(barangId: string) {
	const [totalMasuk, totalKeluar, totalReturMasuk, totalReturKeluar] = await Promise.all([
		prisma.barangMasuk.aggregate({
			where: { barangId, deletedAt: null },
			_sum: { jumlah: true },
		}),
		prisma.barangKeluar.aggregate({
			where: { barangId, deletedAt: null },
			_sum: { jumlah: true },
		}),
		prisma.retur.aggregate({
			where: { barangId, tipe: "MASUK", deletedAt: null },
			_sum: { jumlah: true },
		}),
		prisma.retur.aggregate({
			where: { barangId, tipe: "KELUAR", deletedAt: null },
			_sum: { jumlah: true },
		}),
	])

	return {
		totalMasuk: totalMasuk._sum.jumlah ?? 0,
		totalKeluar: totalKeluar._sum.jumlah ?? 0,
		totalReturMasuk: totalReturMasuk._sum.jumlah ?? 0,
		totalReturKeluar: totalReturKeluar._sum.jumlah ?? 0,
	}
}

export type ActivityLogItem = Awaited<ReturnType<typeof getActivityLog>>[number]
export type BreakdownSupplierItem = Awaited<ReturnType<typeof getBreakdownSupplier>>[number]
