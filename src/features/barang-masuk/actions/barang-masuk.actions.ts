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
				supplierId: parsed.data.supplierId,
				jumlah: parsed.data.jumlah,
				keterangan: parsed.data.keterangan,
				tanggalMasuk: new Date(parsed.data.tanggalMasuk),
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

export async function hapusBarangMasuk(id: string): Promise<ActionResult> {
	await requireAuth()

	try {
		await prisma.$transaction(async (tx) => {
			const masuk = await tx.barangMasuk.findUnique({ where: { id } })
			if (!masuk || masuk.deletedAt) {
				throw new Error("Transaksi tidak ditemukan atau sudah dihapus")
			}

			const barang = await tx.barang.findUnique({
				where: { id: masuk.barangId },
				select: { stok: true },
			})
			if (!barang || barang.stok < masuk.jumlah) {
				throw new Error("Tidak dapat membatalkan: stok tidak mencukupi untuk di-reverse")
			}

			await tx.barangMasuk.update({
				where: { id },
				data: { deletedAt: new Date() },
			})
			await tx.barang.update({
				where: { id: masuk.barangId },
				data: { stok: { decrement: masuk.jumlah } },
			})
		})

		revalidatePath("/dashboard/barang-masuk")
		revalidatePath("/dashboard/stok")
		revalidatePath("/dashboard/barang")
		return { success: true, data: undefined }
	} catch (err) {
		if (err instanceof Error) {
			if (
				err.message.startsWith("Tidak dapat membatalkan") ||
				err.message.startsWith("Transaksi tidak ditemukan")
			) {
				return { success: false, error: err.message }
			}
		}
		throw err
	}
}
