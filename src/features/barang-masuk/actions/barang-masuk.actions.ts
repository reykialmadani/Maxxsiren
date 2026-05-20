"use server"

import { revalidatePath } from "next/cache"
import type { ActionResult } from "@/lib/types"
import { barangMasukSchema } from "@/lib/validations/barang-masuk.schema"
import { requireAuth } from "@/server/auth"
import { prisma } from "@/server/db"

export async function tambahBarangMasuk(formData: unknown): Promise<ActionResult> {
	const session = await requireAuth()

	const parsed = barangMasukSchema.safeParse(formData)
	if (!parsed.success) {
		return { success: false, error: "Data tidak valid" }
	}

	const user = await prisma.user.findUnique({
		where: { supabaseId: session.user.id },
		select: { id: true },
	})
	if (!user) {
		return { success: false, error: "User tidak ditemukan" }
	}

	await prisma.$transaction(async (tx) => {
		await tx.barangMasuk.create({
			data: {
				barangId: parsed.data.barangId,
				userId: user.id,
				jumlah: parsed.data.jumlah,
				keterangan: parsed.data.keterangan,
			},
		})
		await tx.barang.update({
			where: { id: parsed.data.barangId },
			data: { stok: { increment: parsed.data.jumlah } },
		})
	})

	revalidatePath("/dashboard/barang-masuk")
	revalidatePath("/dashboard/stok")
	revalidatePath("/dashboard/barang")
	return { success: true, data: undefined }
}
