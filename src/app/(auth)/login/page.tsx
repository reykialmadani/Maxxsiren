import { Activity, Layers, Package, Siren } from "lucide-react"
import { redirect } from "next/navigation"
import { LoginForm } from "@/features/auth"
import { getSession } from "@/server/auth"

export default async function LoginPage() {
	const session = await getSession()
	if (session) redirect("/dashboard")

	return (
		<div className="grid min-h-svh lg:grid-cols-2">
			<div className="flex flex-col gap-4 p-6 md:p-10">
				<div className="flex items-center gap-2">
					<div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
						<Siren className="h-4 w-4" />
					</div>
					<span className="text-lg font-bold text-foreground">Maxxsiren</span>
				</div>
				<div className="flex flex-1 items-center justify-center">
					<div className="w-full max-w-xs">
						<LoginForm />
					</div>
				</div>
			</div>
			<div className="relative hidden lg:flex flex-col justify-between bg-gradient-to-br from-primary via-primary to-[hsl(215_55%_18%)] p-12 overflow-hidden">
				<div className="absolute inset-0 opacity-10">
					<Siren className="absolute -top-20 -right-20 h-96 w-96 text-white" strokeWidth={1} />
					<Package className="absolute top-1/3 left-10 h-32 w-32 text-white" strokeWidth={1} />
					<Layers className="absolute bottom-32 right-20 h-40 w-40 text-white" strokeWidth={1} />
					<Activity className="absolute top-20 left-1/3 h-24 w-24 text-white" strokeWidth={1} />
				</div>
				<div className="relative flex items-center gap-2 text-white">
					<Siren className="h-6 w-6" />
					<span className="text-base font-semibold">Maxxsiren Inventory</span>
				</div>
				<div className="relative text-white">
					<h2 className="text-3xl font-bold leading-tight">
						Sistem Informasi Inventaris Terintegrasi
					</h2>
					<p className="text-sm mt-3 opacity-90 leading-relaxed">
						Kelola stok barang, catat transaksi masuk dan keluar, serta pantau inventaris secara
						real-time. Solusi lengkap untuk distribusi peralatan peringatan Maxxsiren.
					</p>
				</div>
			</div>
		</div>
	)
}
