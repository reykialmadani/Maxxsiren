import { FileText } from "lucide-react"
import { PageHeader } from "@/components/common/PageHeader"
import { FormFilterLaporan } from "@/features/laporan/components/FormFilterLaporan"
import { requireRole } from "@/server/auth"

export default async function LaporanPage() {
	await requireRole("MANAJER")

	return (
		<div className="px-6 py-8 lg:px-8 flex flex-col gap-6 max-w-7xl mx-auto">
			<PageHeader
				icon={FileText}
				title="Laporan Inventaris"
				subtitle="Generate dan unduh laporan inventaris berdasarkan periode"
			/>
			<FormFilterLaporan />
		</div>
	)
}
