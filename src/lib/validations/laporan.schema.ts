import { z } from "zod"

export const laporanFilterSchema = z.object({
	tipe: z.enum(["barang-masuk", "barang-keluar", "stok"]),
	dateFrom: z.string().min(1, "Tanggal mulai wajib diisi"),
	dateTo: z.string().min(1, "Tanggal akhir wajib diisi"),
})

export type LaporanFilterInput = z.infer<typeof laporanFilterSchema>
