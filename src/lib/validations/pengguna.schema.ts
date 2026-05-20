import { z } from "zod"

export const tambahPenggunaSchema = z.object({
	nama: z.string().min(2, "Nama minimal 2 karakter").max(100, "Nama maksimal 100 karakter"),
	email: z.string().email("Format email tidak valid"),
	password: z.string().min(6, "Password minimal 6 karakter"),
	role: z.enum(["MANAJER", "STAF"]),
})

export const updatePenggunaSchema = z.object({
	nama: z.string().min(2, "Nama minimal 2 karakter").max(100, "Nama maksimal 100 karakter"),
	role: z.enum(["MANAJER", "STAF"]),
})

export type TambahPenggunaInput = z.infer<typeof tambahPenggunaSchema>
export type UpdatePenggunaInput = z.infer<typeof updatePenggunaSchema>
