"use client"

import {
	ArrowDownToLine,
	ArrowUpFromLine,
	FileText,
	Layers,
	LayoutDashboard,
	LogOut,
	Package,
	Siren,
	Users,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { logoutAction } from "@/features/auth"
import { cn } from "@/lib/utils"

type SidebarProps = {
	nama: string
	role: "MANAJER" | "STAF"
}

type NavItem = {
	label: string
	href: string
	icon: React.ComponentType<{ className?: string }>
	managerOnly?: boolean
}

const NAV_ITEMS: NavItem[] = [
	{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
	{ label: "Barang", href: "/dashboard/barang", icon: Package },
	{ label: "Stok", href: "/dashboard/stok", icon: Layers },
	{
		label: "Barang Masuk",
		href: "/dashboard/barang-masuk",
		icon: ArrowDownToLine,
	},
	{
		label: "Barang Keluar",
		href: "/dashboard/barang-keluar",
		icon: ArrowUpFromLine,
	},
	{ label: "Laporan", href: "/dashboard/laporan", icon: FileText },
	{
		label: "Pengguna",
		href: "/dashboard/pengguna",
		icon: Users,
		managerOnly: true,
	},
]

export function Sidebar({ nama, role }: SidebarProps) {
	const pathname = usePathname()
	const initial = nama.charAt(0).toUpperCase()
	const visibleItems = NAV_ITEMS.filter((item) => !item.managerOnly || role === "MANAJER")

	return (
		<aside
			className="flex flex-col w-60 h-screen shrink-0 border-r"
			style={{
				backgroundColor: "var(--sidebar-bg)",
				color: "var(--sidebar-text)",
				borderColor: "var(--sidebar-border)",
			}}
		>
			<div
				className="h-16 flex items-center gap-2 px-4 border-b"
				style={{ borderColor: "var(--sidebar-border)" }}
			>
				<div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground shrink-0">
					<Siren className="h-4 w-4" />
				</div>
				<span className="text-lg font-bold tracking-wide">Maxxsiren</span>
			</div>

			<nav className="flex-1 overflow-y-auto py-4">
				<ul className="flex flex-col gap-1">
					{visibleItems.map((item) => {
						const isActive =
							item.href === "/dashboard"
								? pathname === "/dashboard"
								: pathname.startsWith(item.href)
						const Icon = item.icon

						return (
							<li key={item.href} className="px-2">
								<Link
									href={item.href}
									className={cn(
										"flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
										isActive ? "bg-primary text-primary-foreground" : "hover:bg-white/10",
									)}
									style={!isActive ? { color: "var(--sidebar-text)" } : undefined}
								>
									<Icon className="h-4 w-4 shrink-0" />
									<span>{item.label}</span>
								</Link>
							</li>
						)
					})}
				</ul>
			</nav>

			<div
				className="border-t p-4 flex flex-col gap-3"
				style={{ borderColor: "var(--sidebar-border)" }}
			>
				<div className="flex items-center gap-3">
					<div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold shrink-0">
						{initial}
					</div>
					<div className="flex flex-col min-w-0">
						<span className="text-sm font-medium truncate">{nama}</span>
						<span className="text-xs" style={{ color: "var(--sidebar-muted)" }}>
							{role === "MANAJER" ? "Manajer" : "Staf"}
						</span>
					</div>
				</div>
				<form action={logoutAction}>
					<button
						type="submit"
						className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium border transition-colors hover:bg-white/10"
						style={{
							borderColor: "var(--sidebar-border)",
							color: "var(--sidebar-text)",
						}}
					>
						<LogOut className="h-4 w-4" />
						Keluar
					</button>
				</form>
			</div>
		</aside>
	)
}
