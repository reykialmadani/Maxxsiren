import { PageHeader } from "@/components/common/PageHeader"
import { getBarangForSelect } from "@/features/barang/queries/barang.queries"
import { TabelBarangMasuk } from "@/features/barang-masuk/components/TabelBarangMasuk"
import { getRiwayatBarangMasuk } from "@/features/barang-masuk/queries/barang-masuk.queries"

type BarangMasukPageProps = {
	searchParams: Promise<{
		page?: string
		pageSize?: string
		search?: string
	}>
}

export default async function BarangMasukPage({ searchParams }: BarangMasukPageProps) {
	const params = await searchParams
	const page = Number(params.page ?? 1)
	const pageSize = Number(params.pageSize ?? 10)
	const search = params.search ?? ""

	const [result, barangList] = await Promise.all([
		getRiwayatBarangMasuk(page, pageSize, search || undefined),
		getBarangForSelect(),
	])

	return (
		<div className="px-6 py-8 lg:px-8 flex flex-col gap-6 max-w-7xl mx-auto">
			<PageHeader title="Barang Masuk" subtitle="Riwayat pencatatan penerimaan barang ke gudang" />
			<TabelBarangMasuk
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
