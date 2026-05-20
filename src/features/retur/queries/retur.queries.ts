import { prisma } from "@/server/db"

export type PaginatedResult<T> = {
	data: T[]
	total: number
	page: number
	pageSize: number
	totalPages: number
}

export async function getRiwayatRetur(
	page = 1,
	pageSize = 10,
	search?: string,
	tipe?: "MASUK" | "KELUAR",
) {
	const skip = (page - 1) * pageSize

	const where = {
		deletedAt: null,
		...(tipe && { tipe }),
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
		prisma.retur.findMany({
			where,
			include: {
				barang: { select: { kode: true, namaBarang: true, deletedAt: true } },
				user: { select: { nama: true } },
				supplier: { select: { nama: true } },
			},
			orderBy: { tanggalRetur: "desc" },
			skip,
			take: pageSize,
		}),
		prisma.retur.count({ where }),
	])

	return {
		data,
		total,
		page,
		pageSize,
		totalPages: Math.ceil(total / pageSize),
	}
}
