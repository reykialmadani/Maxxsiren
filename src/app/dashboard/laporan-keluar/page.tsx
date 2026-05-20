import { FileUp } from "lucide-react"
import { PageHeader } from "@/components/common/PageHeader"
import { FormFilterLaporan } from "@/features/laporan/components/FormFilterLaporan"
import { requireAuth } from "@/server/auth"

export default async function LaporanKeluarPage() {
	const session = await requireAuth()
	const role = (session.user.app_metadata.role as "MANAJER" | "STAF") ?? "STAF"

	return (
		<div className="px-6 py-8 lg:px-8 flex flex-col gap-6 max-w-7xl mx-auto">
			<PageHeader
				icon={FileUp}
				title="Laporan Barang Keluar"
				subtitle="Rekapitulasi barang keluar dan retur keluar berdasarkan periode"
			/>
			<FormFilterLaporan tipe="keluar" canExport={role === "MANAJER"} />
		</div>
	)
}
