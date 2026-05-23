import { FileUp } from "lucide-react"
import { PageHeader } from "@/components/common/PageHeader"
import { LaporanChart } from "@/features/laporan/components/LaporanChart"
import { LaporanFilterSection } from "@/features/laporan/components/LaporanFilterSection"
import { LaporanPreviewTabel } from "@/features/laporan/components/LaporanPreviewTabel"
import { LaporanSummaryCards } from "@/features/laporan/components/LaporanSummaryCards"
import {
	getLaporanKeluarPaginated,
	getLaporanKeluarSummary,
	getLaporanKeluarTrenHarian,
} from "@/features/laporan/queries/laporan.queries"
import { requireRole } from "@/server/auth"

type LaporanKeluarPageProps = {
	searchParams: Promise<{
		dateFrom?: string
		dateTo?: string
		page?: string
		pageSize?: string
		tipe?: string
	}>
}

function getDefaultDates() {
	const today = new Date()
	const from = new Date(today)
	from.setDate(from.getDate() - 29)
	return {
		dateFrom: from.toISOString().slice(0, 10),
		dateTo: today.toISOString().slice(0, 10),
	}
}

export default async function LaporanKeluarPage({ searchParams }: LaporanKeluarPageProps) {
	await requireRole("MANAJER")
	const role = "MANAJER" as const

	const params = await searchParams
	const defaults = getDefaultDates()
	const dateFromStr = params.dateFrom ?? defaults.dateFrom
	const dateToStr = params.dateTo ?? defaults.dateTo
	const page = Number(params.page ?? 1)
	const pageSize = Number(params.pageSize ?? 10)
	const tipeFilter = (params.tipe ?? "all") as "all" | "barang" | "retur"

	const dateFrom = new Date(dateFromStr)
	const dateTo = new Date(dateToStr)
	dateTo.setHours(23, 59, 59, 999)

	const filter = { dateFrom, dateTo }

	const [summary, tren, preview] = await Promise.all([
		getLaporanKeluarSummary(filter),
		getLaporanKeluarTrenHarian(filter),
		getLaporanKeluarPaginated(filter, page, pageSize, tipeFilter),
	])

	return (
		<div className="px-6 py-8 lg:px-8 flex flex-col gap-6 max-w-7xl mx-auto">
			<PageHeader
				icon={FileUp}
				title="Laporan Barang Keluar"
				subtitle="Rekapitulasi barang keluar dan retur keluar berdasarkan periode"
			/>

			<LaporanFilterSection
				tipe="keluar"
				canExport={role === "MANAJER"}
				dateFrom={dateFromStr}
				dateTo={dateToStr}
				hasData={summary.totalTransaksi > 0}
			/>

			{summary.totalTransaksi > 0 && (
				<>
					<LaporanSummaryCards
						mode="keluar"
						totalTransaksi={summary.totalTransaksi}
						totalUnit={summary.totalUnit}
						penerimaUnik={summary.penerimaUnik}
						barangTerbanyak={summary.barangTerbanyak}
					/>

					<LaporanChart data={tren} color="danger" />
				</>
			)}

			<LaporanPreviewTabel
				data={preview.data}
				total={preview.total}
				page={preview.page}
				pageSize={preview.pageSize}
				totalPages={preview.totalPages}
				tipeFilter={tipeFilter}
				basePath="/dashboard/laporan-keluar"
			/>
		</div>
	)
}
