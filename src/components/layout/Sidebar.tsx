"use client"

import {
	ArrowDownToLine,
	ArrowUpFromLine,
	FileDown,
	FileUp,
	LayoutDashboard,
	LogOut,
	Package,
	RotateCcw,
	Siren,
	Truck,
	Users,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { logoutAction } from "@/features/auth"
import { cn } from "@/lib/utils"
import { useSidebar } from "./SidebarContext"

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
	{ label: "Supplier", href: "/dashboard/supplier", icon: Truck },
	{ label: "Barang", href: "/dashboard/barang", icon: Package },
	{ label: "Barang Masuk", href: "/dashboard/barang-masuk", icon: ArrowDownToLine },
	{ label: "Barang Keluar", href: "/dashboard/barang-keluar", icon: ArrowUpFromLine },
	{ label: "Retur", href: "/dashboard/retur", icon: RotateCcw },
	{ label: "Laporan Masuk", href: "/dashboard/laporan-masuk", icon: FileDown },
	{ label: "Laporan Keluar", href: "/dashboard/laporan-keluar", icon: FileUp },
	{ label: "Pengguna", href: "/dashboard/pengguna", icon: Users, managerOnly: true },
]

export function Sidebar({ nama, role }: SidebarProps) {
	const pathname = usePathname()
	const { collapsed } = useSidebar()
	const initial = nama.charAt(0).toUpperCase()
	const visibleItems = NAV_ITEMS.filter((item) => !item.managerOnly || role === "MANAJER")

	return (
		<TooltipProvider delayDuration={100}>
			<aside
				className={cn(
					"flex flex-col h-screen shrink-0 border-r transition-[width] duration-300 ease-out",
					collapsed ? "w-16" : "w-60",
				)}
				style={{
					backgroundColor: "var(--sidebar-bg)",
					color: "var(--sidebar-text)",
					borderColor: "var(--sidebar-border)",
				}}
			>
				<div
					className={cn(
						"h-16 flex items-center gap-2 border-b shrink-0",
						collapsed ? "justify-center px-2" : "px-4",
					)}
					style={{ borderColor: "var(--sidebar-border)" }}
				>
					<div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground shrink-0">
						<Siren className="h-4 w-4" />
					</div>
					{!collapsed && <span className="text-lg font-bold tracking-wide">Maxxsiren</span>}
				</div>

				<nav className="flex-1 overflow-y-auto py-4">
					<ul className="flex flex-col gap-1">
						{visibleItems.map((item) => {
							const isActive =
								item.href === "/dashboard"
									? pathname === "/dashboard"
									: pathname.startsWith(item.href)
							const Icon = item.icon

							const linkClass = cn(
								"flex items-center gap-3 rounded-md text-sm font-medium transition-colors",
								collapsed ? "px-2 py-2 justify-center" : "px-3 py-2.5",
								isActive ? "bg-primary text-primary-foreground" : "hover:bg-white/10",
							)

							const linkContent = (
								<>
									<Icon className="h-4 w-4 shrink-0" />
									{!collapsed && <span>{item.label}</span>}
								</>
							)

							return (
								<li key={item.href} className="px-2">
									{collapsed ? (
										<Tooltip>
											<TooltipTrigger asChild>
												<Link
													href={item.href}
													className={linkClass}
													style={!isActive ? { color: "var(--sidebar-text)" } : undefined}
													aria-label={item.label}
												>
													{linkContent}
												</Link>
											</TooltipTrigger>
											<TooltipContent side="right">{item.label}</TooltipContent>
										</Tooltip>
									) : (
										<Link
											href={item.href}
											className={linkClass}
											style={!isActive ? { color: "var(--sidebar-text)" } : undefined}
										>
											{linkContent}
										</Link>
									)}
								</li>
							)
						})}
					</ul>
				</nav>

				<div
					className={cn("border-t flex flex-col gap-3", collapsed ? "p-2" : "p-4")}
					style={{ borderColor: "var(--sidebar-border)" }}
				>
					{collapsed ? (
						<Tooltip>
							<TooltipTrigger asChild>
								<div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold shrink-0 mx-auto">
									{initial}
								</div>
							</TooltipTrigger>
							<TooltipContent side="right">
								{nama} ({role === "MANAJER" ? "Manajer" : "Staf"})
							</TooltipContent>
						</Tooltip>
					) : (
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
					)}
					<form action={logoutAction}>
						{collapsed ? (
							<Tooltip>
								<TooltipTrigger asChild>
									<button
										type="submit"
										className="w-full flex items-center justify-center px-2 py-2 rounded-md border transition-colors hover:bg-white/10"
										style={{
											borderColor: "var(--sidebar-border)",
											color: "var(--sidebar-text)",
										}}
										aria-label="Keluar"
									>
										<LogOut className="h-4 w-4" />
									</button>
								</TooltipTrigger>
								<TooltipContent side="right">Keluar</TooltipContent>
							</Tooltip>
						) : (
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
						)}
					</form>
				</div>
			</aside>
		</TooltipProvider>
	)
}
