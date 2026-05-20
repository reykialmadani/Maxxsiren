"use server"

import { revalidatePath } from "next/cache"
import type { ActionResult } from "@/lib/types"
import { kategoriSchema } from "@/lib/validations/kategori.schema"
import { requireAuth } from "@/server/auth"
import { prisma } from "@/server/db"

export async function tambahKategori(formData: unknown): Promise<ActionResult> {
	await requireAuth()

	const parsed = kategoriSchema.safeParse(formData)
	if (!parsed.success) {
		return { success: false, error: "Data tidak valid" }
	}

	const existing = await prisma.kategori.findUnique({
		where: { nama: parsed.data.nama },
	})
	if (existing) {
		return { success: false, error: "Nama kategori sudah digunakan" }
	}

	await prisma.kategori.create({ data: parsed.data })

	revalidatePath("/dashboard/barang")
	return { success: true, data: undefined }
}

export async function updateKategori(id: string, formData: unknown): Promise<ActionResult> {
	await requireAuth()

	const parsed = kategoriSchema.safeParse(formData)
	if (!parsed.success) {
		return { success: false, error: "Data tidak valid" }
	}

	const existing = await prisma.kategori.findFirst({
		where: { nama: parsed.data.nama, NOT: { id } },
	})
	if (existing) {
		return { success: false, error: "Nama kategori sudah digunakan" }
	}

	await prisma.kategori.update({
		where: { id },
		data: parsed.data,
	})

	revalidatePath("/dashboard/barang")
	return { success: true, data: undefined }
}

export async function hapusKategori(id: string): Promise<ActionResult> {
	await requireAuth()

	const barangCount = await prisma.barang.count({
		where: { kategoriId: id, deletedAt: null },
	})

	if (barangCount > 0) {
		return {
			success: false,
			error: `Tidak dapat menghapus. Masih ada ${barangCount} barang yang menggunakan kategori ini`,
		}
	}

	await prisma.kategori.delete({ where: { id } })

	revalidatePath("/dashboard/barang")
	return { success: true, data: undefined }
}
