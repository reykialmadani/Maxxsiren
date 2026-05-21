import { FileDown } from "lucide-react"
import { PageHeader } from "@/components/common/PageHeader"
import { LaporanChart } from "@/features/laporan/components/LaporanChart"
import { LaporanFilterSection } from "@/features/laporan/components/LaporanFilterSection"
import { LaporanPreviewTabel } from "@/features/laporan/components/LaporanPreviewTabel"
import { LaporanSummaryCards } from "@/features/laporan/components/LaporanSummaryCards"
import {
	getLaporanMasukPaginated,
	getLaporanMasukSummary,
	getLaporanMasukTrenHarian,
} from "@/features/laporan/queries/laporan.queries"
import { requireAuth } from "@/server/auth"

type LaporanMasukPageProps = {
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

export default async function LaporanMasukPage({ searchParams }: LaporanMasukPageProps) {
	const session = await requireAuth()
	const role = (session.user.app_metadata.role as "MANAJER" | "STAF") ?? "STAF"

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
		getLaporanMasukSummary(filter),
		getLaporanMasukTrenHarian(filter),
		getLaporanMasukPaginated(filter, page, pageSize, tipeFilter),
	])

	return (
		<div className="px-6 py-8 lg:px-8 flex flex-col gap-6 max-w-7xl mx-auto">
			<PageHeader
				icon={FileDown}
				title="Laporan Barang Masuk"
				subtitle="Rekapitulasi barang masuk dan retur masuk berdasarkan periode"
			/>

			<LaporanFilterSection
				tipe="masuk"
				canExport={role === "MANAJER"}
				dateFrom={dateFromStr}
				dateTo={dateToStr}
				hasData={summary.totalTransaksi > 0}
			/>

			{summary.totalTransaksi > 0 && (
				<>
					<LaporanSummaryCards
						mode="masuk"
						totalTransaksi={summary.totalTransaksi}
						totalUnit={summary.totalUnit}
						supplierUnik={summary.supplierUnik}
						barangTerbanyak={summary.barangTerbanyak}
					/>

					<LaporanChart data={tren} color="primary" />
				</>
			)}

			<LaporanPreviewTabel
				data={preview.data}
				total={preview.total}
				page={preview.page}
				pageSize={preview.pageSize}
				totalPages={preview.totalPages}
				tipeFilter={tipeFilter}
				basePath="/dashboard/laporan-masuk"
			/>
		</div>
	)
}
