import type { Prisma } from "@prisma/client"
import { prisma } from "@/server/db"

export type PaginatedResult<T> = {
	data: T[]
	total: number
	page: number
	pageSize: number
	totalPages: number
}

export async function getStokOverview(page = 1, pageSize = 10, search?: string) {
	const skip = (page - 1) * pageSize

	const where: Prisma.BarangWhereInput = {
		deletedAt: null,
		...(search && {
			OR: [
				{ namaBarang: { contains: search, mode: "insensitive" } },
				{ kode: { contains: search, mode: "insensitive" } },
			],
		}),
	}

	const [data, total] = await Promise.all([
		prisma.barang.findMany({
			where,
			include: { kategori: true },
			orderBy: { stok: "asc" },
			skip,
			take: pageSize,
		}),
		prisma.barang.count({ where }),
	])

	return {
		data,
		total,
		page,
		pageSize,
		totalPages: Math.ceil(total / pageSize),
	}
}
