import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "./supabase"

export async function getSession() {
	const supabase = await createSupabaseServerClient()
	const {
		data: { session },
	} = await supabase.auth.getSession()
	return session
}

export async function requireAuth() {
	const session = await getSession()
	if (!session) redirect("/login")
	return session
}

export async function requireRole(role: "MANAJER" | "STAF") {
	const session = await requireAuth()
	const userRole = session.user.app_metadata.role as string
	if (userRole !== role) redirect("/dashboard")
	return session
}
