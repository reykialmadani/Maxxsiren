import { prisma } from "@/server/db"

export type PaginatedResult<T> = {
	data: T[]
	total: number
	page: number
	pageSize: number
	totalPages: number
}

export async function getRiwayatBarangMasuk(page = 1, pageSize = 10, search?: string) {
	const skip = (page - 1) * pageSize

	const where = {
		deletedAt: null,
		...(search && {
			barang: {
				OR: [
					{ namaBarang: { contains: search, mode: "insensitive" as const } },
					{ kode: { contains: search, mode: "insensitive" as const } },
				],
			},
		}),
	}

	const [data, total] = await Promise.all([
		prisma.barangMasuk.findMany({
			where,
			include: {
				barang: { select: { kode: true, namaBarang: true, deletedAt: true } },
				user: { select: { nama: true } },
				supplier: { select: { nama: true } },
			},
			orderBy: { tanggalMasuk: "desc" },
			skip,
			take: pageSize,
		}),
		prisma.barangMasuk.count({ where }),
	])

	return {
		data,
		total,
		page,
		pageSize,
		totalPages: Math.ceil(total / pageSize),
	}
}
