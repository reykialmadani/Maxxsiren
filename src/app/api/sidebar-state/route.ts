import { type NextRequest, NextResponse } from "next/server"

const COOKIE_NAME = "sidebar-collapsed"

export async function POST(request: NextRequest) {
	const body = (await request.json()) as { collapsed?: boolean }
	const collapsed = Boolean(body.collapsed)

	const response = NextResponse.json({ ok: true })
	response.cookies.set(COOKIE_NAME, String(collapsed), {
		path: "/",
		maxAge: 60 * 60 * 24 * 365,
		sameSite: "lax",
	})
	return response
}
