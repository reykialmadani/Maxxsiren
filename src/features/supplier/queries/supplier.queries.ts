import { prisma } from "@/server/db"

export async function getSupplierList(search?: string) {
	return prisma.supplier.findMany({
		where: search ? { nama: { contains: search, mode: "insensitive" } } : undefined,
		include: {
			_count: { select: { barangMasuk: true } },
		},
		orderBy: { nama: "asc" },
	})
}

export async function getSupplierForSelect() {
	return prisma.supplier.findMany({
		select: { id: true, nama: true },
		orderBy: { nama: "asc" },
	})
}

export async function getSupplierById(id: string) {
	return prisma.supplier.findUnique({ where: { id } })
}
