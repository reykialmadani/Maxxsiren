import type { Prisma } from "@prisma/client"
import { prisma } from "@/server/db"

export type PaginatedResult<T> = {
	data: T[]
	total: number
	page: number
	pageSize: number
	totalPages: number
}

export async function getBarangAktif(
	page = 1,
	pageSize = 10,
	search?: string,
	kategoriId?: string,
) {
	const skip = (page - 1) * pageSize

	const where: Prisma.BarangWhereInput = {
		deletedAt: null,
		...(search && {
			OR: [
				{ namaBarang: { contains: search, mode: "insensitive" } },
				{ kode: { contains: search, mode: "insensitive" } },
			],
		}),
		...(kategoriId && { kategoriId }),
	}

	const [data, total] = await Promise.all([
		prisma.barang.findMany({
			where,
			include: { kategori: true },
			orderBy: { namaBarang: "asc" },
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

export async function getBarangById(id: string) {
	return prisma.barang.findUnique({
		where: { id },
		include: { kategori: true },
	})
}

export async function getBarangForSelect() {
	return prisma.barang.findMany({
		where: { deletedAt: null },
		select: { id: true, kode: true, namaBarang: true, stok: true },
		orderBy: { namaBarang: "asc" },
	})
}
