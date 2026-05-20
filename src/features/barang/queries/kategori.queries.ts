import { prisma } from "@/server/db"

export async function getKategoriList() {
	return prisma.kategori.findMany({
		orderBy: { nama: "asc" },
		include: {
			_count: { select: { barang: true } },
		},
	})
}
