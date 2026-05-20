"use server"

import { revalidatePath } from "next/cache"
import type { ActionResult } from "@/lib/types"
import { returSchema } from "@/lib/validations/retur.schema"
import { requireAuth } from "@/server/auth"
import { prisma } from "@/server/db"

export async function tambahRetur(formData: unknown): Promise<ActionResult> {
	const session = await requireAuth()

	const parsed = returSchema.safeParse(formData)
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

	const data = parsed.data

	try {
		if (data.tipe === "MASUK") {
			await prisma.$transaction(async (tx) => {
				await tx.retur.create({
					data: {
						tipe: "MASUK",
						barangId: data.barangId,
						userId: user.id,
						jumlah: data.jumlah,
						keterangan: data.keterangan,
						tanggalRetur: new Date(data.tanggalRetur),
						namaPenerima: data.namaPenerima,
					},
				})
				await tx.barang.update({
					where: { id: data.barangId },
					data: { stok: { increment: data.jumlah } },
				})
			})
		} else {
			await prisma.$transaction(async (tx) => {
				const barang = await tx.barang.findUnique({
					where: { id: data.barangId },
					select: { stok: true },
				})
				if (!barang) throw new Error("Barang tidak ditemukan")
				if (barang.stok < data.jumlah) {
					throw new Error(`Stok tidak mencukupi. Stok tersedia: ${barang.stok}`)
				}

				await tx.retur.create({
					data: {
						tipe: "KELUAR",
						barangId: data.barangId,
						userId: user.id,
						jumlah: data.jumlah,
						keterangan: data.keterangan,
						tanggalRetur: new Date(data.tanggalRetur),
						supplierId: data.supplierId,
					},
				})
				await tx.barang.update({
					where: { id: data.barangId },
					data: { stok: { decrement: data.jumlah } },
				})
			})
		}

		revalidatePath("/dashboard/retur")
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

export async function hapusRetur(id: string): Promise<ActionResult> {
	await requireAuth()

	try {
		await prisma.$transaction(async (tx) => {
			const retur = await tx.retur.findUnique({ where: { id } })
			if (!retur || retur.deletedAt) {
				throw new Error("Transaksi tidak ditemukan atau sudah dihapus")
			}

			if (retur.tipe === "MASUK") {
				const barang = await tx.barang.findUnique({
					where: { id: retur.barangId },
					select: { stok: true },
				})
				if (!barang || barang.stok < retur.jumlah) {
					throw new Error("Tidak dapat membatalkan: stok tidak mencukupi untuk di-reverse")
				}
				await tx.retur.update({ where: { id }, data: { deletedAt: new Date() } })
				await tx.barang.update({
					where: { id: retur.barangId },
					data: { stok: { decrement: retur.jumlah } },
				})
			} else {
				await tx.retur.update({ where: { id }, data: { deletedAt: new Date() } })
				await tx.barang.update({
					where: { id: retur.barangId },
					data: { stok: { increment: retur.jumlah } },
				})
			}
		})

		revalidatePath("/dashboard/retur")
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
