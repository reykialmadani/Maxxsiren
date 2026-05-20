import { z } from "zod"
import { tanggalTransaksiSchema } from "./tanggal.schema"

export const barangKeluarSchema = z.object({
	barangId: z.string().min(1, "Barang wajib dipilih"),
	namaPenerima: z.string().min(2, "Nama penerima wajib diisi").max(100),
	jumlah: z
		.number({ message: "Jumlah harus berupa angka" })
		.int("Jumlah harus berupa bilangan bulat")
		.positive("Jumlah harus lebih dari 0"),
	tanggalKeluar: tanggalTransaksiSchema,
	keterangan: z.string().max(500, "Keterangan maksimal 500 karakter").optional(),
})

export type BarangKeluarInput = z.infer<typeof barangKeluarSchema>
