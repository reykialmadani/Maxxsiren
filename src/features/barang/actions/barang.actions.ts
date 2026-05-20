"use server"

import { revalidatePath } from "next/cache"
import type { ActionResult } from "@/lib/types"
import { barangSchema } from "@/lib/validations/barang.schema"
import { requireAuth } from "@/server/auth"
import { prisma } from "@/server/db"

export async function tambahBarang(formData: unknown): Promise<ActionResult> {
	await requireAuth()

	const parsed = barangSchema.safeParse(formData)
	if (!parsed.success) {
		return { success: false, error: "Data tidak valid" }
	}

	const existingKode = await prisma.barang.findUnique({
		where: { kode: parsed.data.kode },
	})
	if (existingKode) {
		return { success: false, error: "Kode barang sudah digunakan" }
	}

	await prisma.barang.create({
		data: {
			kode: parsed.data.kode,
			namaBarang: parsed.data.namaBarang,
			kategoriId: parsed.data.kategoriId,
			satuan: parsed.data.satuan,
			minStok: parsed.data.minStok,
			stok: 0,
		},
	})

	revalidatePath("/dashboard/barang")
	revalidatePath("/dashboard/stok")
	return { success: true, data: undefined }
}

export async function updateBarang(id: string, formData: unknown): Promise<ActionResult> {
	await requireAuth()

	const parsed = barangSchema.safeParse(formData)
	if (!parsed.success) {
		return { success: false, error: "Data tidak valid" }
	}

	const existingKode = await prisma.barang.findFirst({
		where: { kode: parsed.data.kode, NOT: { id } },
	})
	if (existingKode) {
		return { success: false, error: "Kode barang sudah digunakan" }
	}

	await prisma.barang.update({
		where: { id },
		data: {
			kode: parsed.data.kode,
			namaBarang: parsed.data.namaBarang,
			kategoriId: parsed.data.kategoriId,
			satuan: parsed.data.satuan,
			minStok: parsed.data.minStok,
		},
	})

	revalidatePath("/dashboard/barang")
	revalidatePath("/dashboard/stok")
	return { success: true, data: undefined }
}

export async function arsipkanBarang(id: string): Promise<ActionResult> {
	await requireAuth()

	await prisma.barang.update({
		where: { id },
		data: { deletedAt: new Date() },
	})

	revalidatePath("/dashboard/barang")
	revalidatePath("/dashboard/stok")
	return { success: true, data: undefined }
}
