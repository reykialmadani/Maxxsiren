import { LayoutDashboard } from "lucide-react"
import { PageHeader } from "@/components/common/PageHeader"
import { BreakdownKategori } from "@/features/dashboard/components/BreakdownKategori"
import { GrafikTren7Hari } from "@/features/dashboard/components/GrafikTren7Hari"
import { KartuRingkasan } from "@/features/dashboard/components/KartuRingkasan"
import { StokKritisCard } from "@/features/dashboard/components/StokKritisCard"
import { TabelTransaksiTerkini } from "@/features/dashboard/components/TabelTransaksiTerkini"
import { TopBarangKeluarCard } from "@/features/dashboard/components/TopBarangKeluarCard"
import { TopSupplierCard } from "@/features/dashboard/components/TopSupplierCard"
import {
	getDashboardSummary,
	getStokKritisDetail,
	getStokPerKategori,
	getTopBarangKeluar,
	getTopSupplier,
	getTransaksiTerkini,
	getTrenTransaksi7Hari,
} from "@/features/dashboard/queries/dashboard.queries"
import { requireAuth } from "@/server/auth"
import { prisma } from "@/server/db"

export default async function DashboardPage() {
	const session = await requireAuth()
	const user = await prisma.user.findUnique({
		where: { supabaseId: session.user.id },
		select: { nama: true },
	})

	const [
		summary,
		transaksiTerkini,
		stokKritis,
		tren7Hari,
		stokKategori,
		topSupplier,
		topBarangKeluar,
	] = await Promise.all([
		getDashboardSummary(),
		getTransaksiTerkini(10),
		getStokKritisDetail(5),
		getTrenTransaksi7Hari(),
		getStokPerKategori(),
		getTopSupplier(5),
		getTopBarangKeluar(5),
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
					<GrafikTren7Hari data={tren7Hari} />
				</div>
				<div>
					<BreakdownKategori data={stokKategori} />
				</div>
			</div>

			<div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
				<div className="xl:col-span-2">
					<TabelTransaksiTerkini data={transaksiTerkini} />
				</div>
				<div className="flex flex-col gap-6">
					<StokKritisCard data={stokKritis} />
					<TopSupplierCard data={topSupplier} />
					<TopBarangKeluarCard data={topBarangKeluar} />
				</div>
			</div>
		</div>
	)
}
