"use server"

import { cookies } from "next/headers"

const COOKIE_NAME = "sidebar-collapsed"

export async function setSidebarCollapsedClient(value: boolean): Promise<void> {
	const cookieStore = await cookies()
	cookieStore.set(COOKIE_NAME, String(value), {
		path: "/",
		maxAge: 60 * 60 * 24 * 365,
		sameSite: "lax",
	})
}
