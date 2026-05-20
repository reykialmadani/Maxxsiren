import { z } from "zod"

export const barangSchema = z.object({
	kode: z.string().min(1, "Kode barang wajib diisi"),
	namaBarang: z.string().min(1, "Nama barang wajib diisi"),
	kategoriId: z.string().min(1, "Kategori wajib dipilih"),
	satuan: z.string().min(1, "Satuan wajib diisi"),
	minStok: z
		.number({ message: "Minimum stok harus berupa angka" })
		.int("Minimum stok harus berupa bilangan bulat")
		.min(0, "Minimum stok tidak boleh negatif"),
})

export type BarangInput = z.infer<typeof barangSchema>
