import { redirect } from "next/navigation"
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
			<Sidebar nama={user.nama} role={role} />
			<main id="main-content" className="flex-1 overflow-y-auto">
				{children}
			</main>
		</div>
	)
}
