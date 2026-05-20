import { prisma } from "@/server/db"

export type PaginatedResult<T> = {
	data: T[]
	total: number
	page: number
	pageSize: number
	totalPages: number
}

export async function getRiwayatBarangKeluar(page = 1, pageSize = 10, search?: string) {
	const skip = (page - 1) * pageSize

	const where = search
		? {
				barang: {
					OR: [
						{ namaBarang: { contains: search, mode: "insensitive" as const } },
						{ kode: { contains: search, mode: "insensitive" as const } },
					],
				},
			}
		: {}

	const [data, total] = await Promise.all([
		prisma.barangKeluar.findMany({
			where,
			include: {
				barang: { select: { kode: true, namaBarang: true, deletedAt: true } },
				user: { select: { nama: true } },
			},
			orderBy: { createdAt: "desc" },
			skip,
			take: pageSize,
		}),
		prisma.barangKeluar.count({ where }),
	])

	return {
		data,
		total,
		page,
		pageSize,
		totalPages: Math.ceil(total / pageSize),
	}
}
