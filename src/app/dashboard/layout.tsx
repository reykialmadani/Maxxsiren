import { Siren } from "lucide-react"
import { redirect } from "next/navigation"
import { MobileNav } from "@/components/layout/MobileNav"
import { Sidebar } from "@/components/layout/Sidebar"
import { requireAuth } from "@/server/auth"
import { prisma } from "@/server/db"
import { createSupabaseServerClient } from "@/server/supabase"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
	const session = await requireAuth()

	const user = await prisma.user.findUnique({
		where: { supabaseId: session.user.id },
		select: { nama: true, isActive: true },
	})

	if (!user?.isActive) {
		const supabase = await createSupabaseServerClient()
		await supabase.auth.signOut()
		redirect("/login")
	}

	const role = (session.user.app_metadata.role as "MANAJER" | "STAF") ?? "STAF"

	return (
		<div className="flex h-screen bg-background">
			<a
				href="#main-content"
				className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-surface focus:px-3 focus:py-2 focus:rounded-md focus:shadow-card"
			>
				Lewati ke konten utama
			</a>

			<div className="hidden lg:block">
				<Sidebar nama={user.nama} role={role} />
			</div>

			<div className="flex-1 flex flex-col overflow-hidden">
				<header className="lg:hidden h-14 flex items-center justify-between px-4 border-b border-border bg-surface shrink-0">
					<MobileNav nama={user.nama} role={role} />
					<div className="flex items-center gap-2">
						<div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
							<Siren className="h-3.5 w-3.5" />
						</div>
						<span className="text-base font-bold text-foreground">Maxxsiren</span>
					</div>
					<div className="w-9" aria-hidden="true" />
				</header>

				<main id="main-content" className="flex-1 overflow-y-auto">
					{children}
				</main>
			</div>
		</div>
	)
}
