import { z } from "zod"

export const barangKeluarSchema = z.object({
	barangId: z.string().min(1, "Barang wajib dipilih"),
	jumlah: z
		.number({ message: "Jumlah harus berupa angka" })
		.int("Jumlah harus berupa bilangan bulat")
		.positive("Jumlah harus lebih dari 0"),
	keterangan: z.string().max(500, "Keterangan maksimal 500 karakter").optional(),
})

export type BarangKeluarInput = z.infer<typeof barangKeluarSchema>
