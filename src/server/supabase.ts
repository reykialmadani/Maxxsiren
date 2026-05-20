import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

function getEnvOrThrow(name: string): string {
	const value = process.env[name]
	if (!value) throw new Error(`Missing environment variable: ${name}`)
	return value
}

export async function createSupabaseServerClient() {
	const cookieStore = await cookies()

	return createServerClient(
		getEnvOrThrow("NEXT_PUBLIC_SUPABASE_URL"),
		getEnvOrThrow("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
		{
			cookies: {
				getAll() {
					return cookieStore.getAll()
				},
				setAll(cookiesToSet) {
					try {
						for (const { name, value, options } of cookiesToSet) {
							cookieStore.set(name, value, options)
						}
					} catch {}
				},
			},
		},
	)
}

export async function createSupabaseAdminClient() {
	const { createClient } = await import("@supabase/supabase-js")

	return createClient(
		getEnvOrThrow("NEXT_PUBLIC_SUPABASE_URL"),
		getEnvOrThrow("SUPABASE_SERVICE_ROLE_KEY"),
		{ auth: { autoRefreshToken: false, persistSession: false } },
	)
}
