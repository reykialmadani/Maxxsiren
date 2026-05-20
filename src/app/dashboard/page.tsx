import { LayoutDashboard } from "lucide-react"
import { PageHeader } from "@/components/common/PageHeader"
import { KartuRingkasan } from "@/features/dashboard/components/KartuRingkasan"
import { StokKritisCard } from "@/features/dashboard/components/StokKritisCard"
import { TabelTransaksiTerkini } from "@/features/dashboard/components/TabelTransaksiTerkini"
import {
	getDashboardSummary,
	getStokKritisDetail,
	getTransaksiTerkini,
} from "@/features/dashboard/queries/dashboard.queries"
import { requireAuth } from "@/server/auth"
import { prisma } from "@/server/db"

export default async function DashboardPage() {
	const session = await requireAuth()
	const user = await prisma.user.findUnique({
		where: { supabaseId: session.user.id },
		select: { nama: true },
	})

	const [summary, transaksiTerkini, stokKritis] = await Promise.all([
		getDashboardSummary(),
		getTransaksiTerkini(10),
		getStokKritisDetail(5),
	])

	return (
		<div className="px-6 py-8 lg:px-8 flex flex-col gap-8 max-w-7xl mx-auto">
			<PageHeader
				icon={LayoutDashboard}
				title={`Selamat datang, ${user?.nama ?? "Pengguna"}`}
				subtitle="Ringkasan informasi inventaris Maxxsiren"
			/>

			<KartuRingkasan
				totalJenisBarang={summary.totalJenisBarang}
				totalStok={summary.totalStok}
				stokRendah={summary.stokRendah}
				totalSupplier={summary.totalSupplier}
				transaksiHariIni={summary.transaksiHariIni}
			/>

			<div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
				<div className="xl:col-span-2">
					<TabelTransaksiTerkini data={transaksiTerkini} />
				</div>
				<div>
					<StokKritisCard data={stokKritis} />
				</div>
			</div>
		</div>
	)
}
