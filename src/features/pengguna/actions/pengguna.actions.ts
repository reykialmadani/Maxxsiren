"use server"

import { revalidatePath } from "next/cache"
import type { ActionResult } from "@/lib/types"
import { tambahPenggunaSchema, updatePenggunaSchema } from "@/lib/validations/pengguna.schema"
import { requireRole } from "@/server/auth"
import { prisma } from "@/server/db"
import { createSupabaseAdminClient } from "@/server/supabase"

export async function tambahPengguna(formData: unknown): Promise<ActionResult> {
	await requireRole("MANAJER")

	const parsed = tambahPenggunaSchema.safeParse(formData)
	if (!parsed.success) {
		return { success: false, error: "Data tidak valid" }
	}

	const existing = await prisma.user.findUnique({
		where: { email: parsed.data.email },
	})
	if (existing) {
		return { success: false, error: "Email sudah digunakan" }
	}

	const supabase = await createSupabaseAdminClient()
	const { data: created, error: createError } = await supabase.auth.admin.createUser({
		email: parsed.data.email,
		password: parsed.data.password,
		email_confirm: true,
		user_metadata: { nama: parsed.data.nama },
		app_metadata: { role: parsed.data.role },
	})

	if (createError || !created.user) {
		return {
			success: false,
			error: createError?.message ?? "Gagal membuat akun autentikasi",
		}
	}

	try {
		await prisma.user.create({
			data: {
				supabaseId: created.user.id,
				nama: parsed.data.nama,
				email: parsed.data.email,
				isActive: true,
			},
		})
	} catch (err) {
		await supabase.auth.admin.deleteUser(created.user.id)
		const message = err instanceof Error ? err.message : "Gagal menyimpan data pengguna"
		return { success: false, error: message }
	}

	revalidatePath("/dashboard/pengguna")
	return { success: true, data: undefined }
}

export async function updatePengguna(supabaseId: string, formData: unknown): Promise<ActionResult> {
	await requireRole("MANAJER")

	const parsed = updatePenggunaSchema.safeParse(formData)
	if (!parsed.success) {
		return { success: false, error: "Data tidak valid" }
	}

	const supabase = await createSupabaseAdminClient()

	const { data: existing } = await supabase.auth.admin.getUserById(supabaseId)
	if (!existing.user) {
		return { success: false, error: "Pengguna tidak ditemukan" }
	}

	const oldRole = existing.user.app_metadata?.role as "MANAJER" | "STAF" | undefined
	const roleChanged = oldRole !== parsed.data.role

	const { error: updateError } = await supabase.auth.admin.updateUserById(supabaseId, {
		user_metadata: { ...existing.user.user_metadata, nama: parsed.data.nama },
		app_metadata: { ...existing.user.app_metadata, role: parsed.data.role },
	})
	if (updateError) {
		return { success: false, error: updateError.message }
	}

	await prisma.user.update({
		where: { supabaseId },
		data: { nama: parsed.data.nama },
	})

	if (roleChanged) {
		await supabase.auth.admin.signOut(supabaseId)
	}

	revalidatePath("/dashboard/pengguna")
	return { success: true, data: undefined }
}

export async function nonaktifkanPengguna(supabaseId: string): Promise<ActionResult> {
	const session = await requireRole("MANAJER")

	if (session.user.id === supabaseId) {
		return {
			success: false,
			error: "Tidak dapat menonaktifkan akun Anda sendiri",
		}
	}

	const supabase = await createSupabaseAdminClient()
	const { error } = await supabase.auth.admin.updateUserById(supabaseId, {
		ban_duration: "876000h",
	})
	if (error) {
		return { success: false, error: error.message }
	}

	await prisma.user.update({
		where: { supabaseId },
		data: { isActive: false },
	})

	await supabase.auth.admin.signOut(supabaseId)

	revalidatePath("/dashboard/pengguna")
	return { success: true, data: undefined }
}

export async function aktifkanPengguna(supabaseId: string): Promise<ActionResult> {
	await requireRole("MANAJER")

	const supabase = await createSupabaseAdminClient()
	const { error } = await supabase.auth.admin.updateUserById(supabaseId, {
		ban_duration: "none",
	})
	if (error) {
		return { success: false, error: error.message }
	}

	await prisma.user.update({
		where: { supabaseId },
		data: { isActive: true },
	})

	revalidatePath("/dashboard/pengguna")
	return { success: true, data: undefined }
}
