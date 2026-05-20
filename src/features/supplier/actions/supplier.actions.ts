"use server"

import { revalidatePath } from "next/cache"
import type { ActionResult } from "@/lib/types"
import { supplierSchema } from "@/lib/validations/supplier.schema"
import { requireAuth } from "@/server/auth"
import { prisma } from "@/server/db"

export async function tambahSupplier(formData: unknown): Promise<ActionResult> {
	await requireAuth()

	const parsed = supplierSchema.safeParse(formData)
	if (!parsed.success) {
		return { success: false, error: "Data tidak valid" }
	}

	await prisma.supplier.create({ data: parsed.data })

	revalidatePath("/dashboard/supplier")
	return { success: true, data: undefined }
}

export async function updateSupplier(id: string, formData: unknown): Promise<ActionResult> {
	await requireAuth()

	const parsed = supplierSchema.safeParse(formData)
	if (!parsed.success) {
		return { success: false, error: "Data tidak valid" }
	}

	await prisma.supplier.update({ where: { id }, data: parsed.data })

	revalidatePath("/dashboard/supplier")
	return { success: true, data: undefined }
}

export async function hapusSupplier(id: string): Promise<ActionResult> {
	await requireAuth()

	const count = await prisma.barangMasuk.count({
		where: { supplierId: id, deletedAt: null },
	})

	if (count > 0) {
		return {
			success: false,
			error: `Tidak dapat menghapus. Masih ada ${count} transaksi barang masuk yang menggunakan supplier ini`,
		}
	}

	await prisma.supplier.delete({ where: { id } })

	revalidatePath("/dashboard/supplier")
	return { success: true, data: undefined }
}
