import { createServerClient } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"

function getEnv(name: string): string {
	const value = process.env[name]
	if (!value) throw new Error(`Missing environment variable: ${name}`)
	return value
}

export async function middleware(request: NextRequest) {
	let supabaseResponse = NextResponse.next({ request })

	const supabase = createServerClient(
		getEnv("NEXT_PUBLIC_SUPABASE_URL"),
		getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
		{
			cookies: {
				getAll() {
					return request.cookies.getAll()
				},
				setAll(cookiesToSet) {
					for (const { name, value } of cookiesToSet) {
						request.cookies.set(name, value)
					}
					supabaseResponse = NextResponse.next({ request })
					for (const { name, value, options } of cookiesToSet) {
						supabaseResponse.cookies.set(name, value, options)
					}
				},
			},
		},
	)

	const {
		data: { session },
	} = await supabase.auth.getSession()

	const { pathname } = request.nextUrl

	if (!session && pathname.startsWith("/dashboard")) {
		return NextResponse.redirect(new URL("/login", request.url))
	}

	if (session && pathname === "/login") {
		return NextResponse.redirect(new URL("/dashboard", request.url))
	}

	return supabaseResponse
}

export const config = {
	matcher: ["/dashboard/:path*", "/login"],
}
