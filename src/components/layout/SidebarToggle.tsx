"use client"

import { PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { useSidebar } from "./SidebarContext"

export function SidebarToggle() {
	const { collapsed, toggle } = useSidebar()

	return (
		<button
			type="button"
			onClick={toggle}
			className="inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-surface-raised transition-colors"
			aria-label={collapsed ? "Perluas sidebar" : "Ciutkan sidebar"}
		>
			{collapsed ? (
				<PanelLeftOpen className="h-5 w-5 text-foreground" />
			) : (
				<PanelLeftClose className="h-5 w-5 text-foreground" />
			)}
		</button>
	)
}
