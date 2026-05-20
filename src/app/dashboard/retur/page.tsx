import { RotateCcw } from "lucide-react"
import { PageHeader } from "@/components/common/PageHeader"
import { getBarangForSelect } from "@/features/barang/queries/barang.queries"
import { TabelRetur } from "@/features/retur/components/TabelRetur"
import { getRiwayatRetur } from "@/features/retur/queries/retur.queries"
import { getSupplierForSelect } from "@/features/supplier/queries/supplier.queries"

type ReturPageProps = {
	searchParams: Promise<{
		page?: string
		pageSize?: string
		search?: string
		tipe?: string
	}>
}

export default async function ReturPage({ searchParams }: ReturPageProps) {
	const params = await searchParams
	const page = Number(params.page ?? 1)
	const pageSize = Number(params.pageSize ?? 10)
	const search = params.search ?? ""
	const tipeFilter = params.tipe ?? ""
	const tipe = tipeFilter === "MASUK" || tipeFilter === "KELUAR" ? tipeFilter : undefined

	const [result, barangList, supplierList] = await Promise.all([
		getRiwayatRetur(page, pageSize, search || undefined, tipe),
		getBarangForSelect(),
		getSupplierForSelect(),
	])

	return (
		<div className="px-6 py-8 lg:px-8 flex flex-col gap-6 max-w-7xl mx-auto">
			<PageHeader
				icon={RotateCcw}
				title="Retur Barang"
				subtitle="Pencatatan retur masuk (dari customer) dan retur keluar (ke supplier)"
			/>
			<TabelRetur
				data={result.data}
				total={result.total}
				page={result.page}
				pageSize={result.pageSize}
				totalPages={result.totalPages}
				search={search}
				tipeFilter={tipeFilter}
				barangList={barangList}
				supplierList={supplierList}
			/>
		</div>
	)
}
