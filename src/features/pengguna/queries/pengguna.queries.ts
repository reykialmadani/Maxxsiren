import { prisma } from "@/server/db"
import { createSupabaseAdminClient } from "@/server/supabase"

export type PenggunaListItem = {
	id: string
	supabaseId: string
	nama: string
	email: string
	isActive: boolean
	role: "MANAJER" | "STAF"
	createdAt: Date
}

export async function getDaftarPengguna(): Promise<PenggunaListItem[]> {
	const supabase = await createSupabaseAdminClient()
	const { data: authData } = await supabase.auth.admin.listUsers()
	const prismaUsers = await prisma.user.findMany({
		orderBy: { createdAt: "desc" },
	})

	return prismaUsers.map((u) => {
		const authUser = authData?.users.find((a) => a.id === u.supabaseId)
		return {
			id: u.id,
			supabaseId: u.supabaseId,
			nama: u.nama,
			email: u.email,
			isActive: u.isActive,
			role: (authUser?.app_metadata?.role as "MANAJER" | "STAF") ?? "STAF",
			createdAt: u.createdAt,
		}
	})
}
