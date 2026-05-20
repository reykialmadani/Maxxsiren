"use server"

import { revalidatePath } from "next/cache"
import type { ActionResult } from "@/lib/types"
import { barangKeluarSchema } from "@/lib/validations/barang-keluar.schema"
import { requireAuth } from "@/server/auth"
import { prisma } from "@/server/db"

export async function tambahBarangKeluar(formData: unknown): Promise<ActionResult> {
	const session = await requireAuth()

	const parsed = barangKeluarSchema.safeParse(formData)
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

	try {
		await prisma.$transaction(async (tx) => {
			const barang = await tx.barang.findUnique({
				where: { id: parsed.data.barangId },
				select: { stok: true, namaBarang: true },
			})

			if (!barang) {
				throw new Error("Barang tidak ditemukan")
			}

			if (barang.stok < parsed.data.jumlah) {
				throw new Error(`Stok tidak mencukupi. Stok tersedia: ${barang.stok}`)
			}

			await tx.barangKeluar.create({
				data: {
					barangId: parsed.data.barangId,
					userId: user.id,
					jumlah: parsed.data.jumlah,
					keterangan: parsed.data.keterangan,
				},
			})

			await tx.barang.update({
				where: { id: parsed.data.barangId },
				data: { stok: { decrement: parsed.data.jumlah } },
			})
		})

		revalidatePath("/dashboard/barang-keluar")
		revalidatePath("/dashboard/stok")
		revalidatePath("/dashboard/barang")
		return { success: true, data: undefined }
	} catch (err) {
		if (err instanceof Error) {
			if (
				err.message.startsWith("Stok tidak mencukupi") ||
				err.message === "Barang tidak ditemukan"
			) {
				return { success: false, error: err.message }
			}
		}
		throw err
	}
}
