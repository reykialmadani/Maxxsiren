"use client"

import { createContext, type ReactNode, useContext, useState } from "react"

type SidebarContextType = {
	collapsed: boolean
	toggle: () => void
}

const SidebarContext = createContext<SidebarContextType>({
	collapsed: false,
	toggle: () => {},
})

export function useSidebar() {
	return useContext(SidebarContext)
}

type SidebarProviderProps = {
	initialCollapsed: boolean
	children: ReactNode
}

export function SidebarProvider({ initialCollapsed, children }: SidebarProviderProps) {
	const [collapsed, setCollapsed] = useState(initialCollapsed)

	function toggle() {
		const next = !collapsed
		setCollapsed(next)
		fetch("/api/sidebar-state", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ collapsed: next }),
		}).catch(() => {})
	}

	return <SidebarContext.Provider value={{ collapsed, toggle }}>{children}</SidebarContext.Provider>
}
