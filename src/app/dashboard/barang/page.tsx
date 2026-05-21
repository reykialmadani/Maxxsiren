import { Package } from "lucide-react"
import { PageHeader } from "@/components/common/PageHeader"
import { BarangTabs } from "@/features/barang/components/BarangTabs"
import { KategoriSection } from "@/features/barang/components/KategoriSection"
import { TabelBarang } from "@/features/barang/components/TabelBarang"
import { getBarangAktif } from "@/features/barang/queries/barang.queries"
import { getKategoriList } from "@/features/barang/queries/kategori.queries"
import { TabelStok } from "@/features/stok/components/TabelStok"
import { getStokOverview } from "@/features/stok/queries/stok.queries"

type BarangPageProps = {
	searchParams: Promise<{
		tab?: string
		page?: string
		pageSize?: string
		search?: string
		kategoriId?: string
	}>
}

export default async function BarangPage({ searchParams }: BarangPageProps) {
	const params = await searchParams
	const tab = params.tab ?? "barang"
	const page = Number(params.page ?? 1)
	const pageSize = Number(params.pageSize ?? 10)
	const search = params.search ?? ""
	const kategoriId = params.kategoriId ?? ""

	const [barangResult, stokResult, kategoriList] = await Promise.all([
		getBarangAktif(page, pageSize, search || undefined, kategoriId || undefined),
		getStokOverview(page, pageSize, search || undefined),
		getKategoriList(),
	])

	return (
		<div className="px-6 py-8 lg:px-8 flex flex-col gap-6 max-w-7xl mx-auto">
			<PageHeader
				icon={Package}
				title="Manajemen Barang"
				subtitle="Kelola data master barang, stok, dan kategori inventaris"
			/>

			<BarangTabs
				activeTab={tab}
				barangContent={
					<TabelBarang
						data={barangResult.data}
						total={barangResult.total}
						page={barangResult.page}
						pageSize={barangResult.pageSize}
						totalPages={barangResult.totalPages}
						search={search}
						kategoriId={kategoriId}
						kategoriList={kategoriList.map((k) => ({ id: k.id, nama: k.nama }))}
					/>
				}
				stokContent={
					<TabelStok
						data={stokResult.data}
						total={stokResult.total}
						page={stokResult.page}
						pageSize={stokResult.pageSize}
						totalPages={stokResult.totalPages}
						search={search}
					/>
				}
				kategoriContent={<KategoriSection data={kategoriList} />}
			/>
		</div>
	)
}
