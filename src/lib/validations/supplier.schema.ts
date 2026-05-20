import { z } from "zod"

export const supplierSchema = z.object({
	nama: z.string().min(2, "Nama supplier minimal 2 karakter").max(100),
	telepon: z.string().min(5, "Nomor telepon minimal 5 karakter").max(20),
	alamat: z.string().min(5, "Alamat minimal 5 karakter").max(255),
})

export type SupplierInput = z.infer<typeof supplierSchema>
