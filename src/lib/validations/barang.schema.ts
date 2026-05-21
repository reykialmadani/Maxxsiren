import { z } from "zod"
import { SATUAN_OPTIONS } from "@/lib/constants"

export const barangSchema = z.object({
	kode: z.string().min(1, "Kode barang wajib diisi"),
	namaBarang: z.string().min(1, "Nama barang wajib diisi"),
	kategoriId: z.string().min(1, "Kategori wajib dipilih"),
	satuan: z.enum(SATUAN_OPTIONS, { message: "Satuan wajib dipilih" }),
	minStok: z
		.number({ message: "Minimum stok harus berupa angka" })
		.int("Minimum stok harus berupa bilangan bulat")
		.min(0, "Minimum stok tidak boleh negatif"),
	gambarUrl: z.string().url("URL tidak valid").optional().or(z.literal("")),
})

export type BarangInput = z.infer<typeof barangSchema>
