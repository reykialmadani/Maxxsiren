import { cookies } from "next/headers"

const COOKIE_NAME = "sidebar-collapsed"

export async function getSidebarCollapsed(): Promise<boolean> {
	const cookieStore = await cookies()
	return cookieStore.get(COOKIE_NAME)?.value === "true"
}
