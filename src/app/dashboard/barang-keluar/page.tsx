import { ArrowUpFromLine } from "lucide-react"
import { PageHeader } from "@/components/common/PageHeader"
import { getBarangForSelect } from "@/features/barang/queries/barang.queries"
import { TabelBarangKeluar } from "@/features/barang-keluar/components/TabelBarangKeluar"
import { getRiwayatBarangKeluar } from "@/features/barang-keluar/queries/barang-keluar.queries"

type BarangKeluarPageProps = {
	searchParams: Promise<{
		page?: string
		pageSize?: string
		search?: string
	}>
}

export default async function BarangKeluarPage({ searchParams }: BarangKeluarPageProps) {
	const params = await searchParams
	const page = Number(params.page ?? 1)
	const pageSize = Number(params.pageSize ?? 10)
	const search = params.search ?? ""

	const [result, barangList] = await Promise.all([
		getRiwayatBarangKeluar(page, pageSize, search || undefined),
		getBarangForSelect(),
	])

	return (
		<div className="px-6 py-8 lg:px-8 flex flex-col gap-6 max-w-7xl mx-auto">
			<PageHeader
				icon={ArrowUpFromLine}
				title="Barang Keluar"
				subtitle="Riwayat pencatatan pengeluaran barang dari gudang"
			/>
			<TabelBarangKeluar
				data={result.data}
				total={result.total}
				page={result.page}
				pageSize={result.pageSize}
				totalPages={result.totalPages}
				search={search}
				barangList={barangList}
			/>
		</div>
	)
}
