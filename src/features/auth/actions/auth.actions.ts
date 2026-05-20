"use server"

import { redirect } from "next/navigation"
import type { ActionResult } from "@/lib/types"
import { loginSchema } from "@/lib/validations/auth.schema"
import { createSupabaseServerClient } from "@/server/supabase"

export async function loginAction(formData: unknown): Promise<ActionResult> {
	const parsed = loginSchema.safeParse(formData)
	if (!parsed.success) {
		return { success: false, error: "Email atau password tidak valid" }
	}

	const supabase = await createSupabaseServerClient()
	const { error } = await supabase.auth.signInWithPassword({
		email: parsed.data.email,
		password: parsed.data.password,
	})

	if (error) {
		return { success: false, error: "Email atau password salah" }
	}

	redirect("/dashboard")
}

export async function logoutAction(): Promise<void> {
	const supabase = await createSupabaseServerClient()
	await supabase.auth.signOut()
	redirect("/login")
}
