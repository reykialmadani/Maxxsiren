import { FileDown } from "lucide-react"
import { PageHeader } from "@/components/common/PageHeader"
import { FormFilterLaporan } from "@/features/laporan/components/FormFilterLaporan"
import { requireAuth } from "@/server/auth"

export default async function LaporanMasukPage() {
	const session = await requireAuth()
	const role = (session.user.app_metadata.role as "MANAJER" | "STAF") ?? "STAF"

	return (
		<div className="px-6 py-8 lg:px-8 flex flex-col gap-6 max-w-7xl mx-auto">
			<PageHeader
				icon={FileDown}
				title="Laporan Barang Masuk"
				subtitle="Rekapitulasi barang masuk dan retur masuk berdasarkan periode"
			/>
			<FormFilterLaporan tipe="masuk" canExport={role === "MANAJER"} />
		</div>
	)
}
