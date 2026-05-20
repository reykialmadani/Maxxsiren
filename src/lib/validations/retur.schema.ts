import { z } from "zod"
import { tanggalTransaksiSchema } from "./tanggal.schema"

export const returMasukSchema = z.object({
	tipe: z.literal("MASUK"),
	barangId: z.string().min(1, "Barang wajib dipilih"),
	namaPenerima: z.string().min(2, "Nama customer/pengirim wajib diisi").max(100),
	jumlah: z
		.number({ message: "Jumlah harus berupa angka" })
		.int("Jumlah harus bilangan bulat")
		.positive("Jumlah harus lebih dari 0"),
	tanggalRetur: tanggalTransaksiSchema,
	keterangan: z.string().max(500).optional(),
})

export const returKeluarSchema = z.object({
	tipe: z.literal("KELUAR"),
	barangId: z.string().min(1, "Barang wajib dipilih"),
	supplierId: z.string().min(1, "Supplier wajib dipilih"),
	jumlah: z
		.number({ message: "Jumlah harus berupa angka" })
		.int("Jumlah harus bilangan bulat")
		.positive("Jumlah harus lebih dari 0"),
	tanggalRetur: tanggalTransaksiSchema,
	keterangan: z.string().max(500).optional(),
})

export const returSchema = z.discriminatedUnion("tipe", [returMasukSchema, returKeluarSchema])

export type ReturMasukInput = z.infer<typeof returMasukSchema>
export type ReturKeluarInput = z.infer<typeof returKeluarSchema>
export type ReturInput = z.infer<typeof returSchema>
