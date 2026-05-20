import { PageHeader } from "@/components/common/PageHeader"
import { KategoriSection } from "@/features/barang/components/KategoriSection"
import { TabelBarang } from "@/features/barang/components/TabelBarang"
import { getBarangAktif } from "@/features/barang/queries/barang.queries"
import { getKategoriList } from "@/features/barang/queries/kategori.queries"

type BarangPageProps = {
	searchParams: Promise<{
		page?: string
		pageSize?: string
		search?: string
		kategoriId?: string
	}>
}

export default async function BarangPage({ searchParams }: BarangPageProps) {
	const params = await searchParams
	const page = Number(params.page ?? 1)
	const pageSize = Number(params.pageSize ?? 10)
	const search = params.search ?? ""
	const kategoriId = params.kategoriId ?? ""

	const [result, kategoriList] = await Promise.all([
		getBarangAktif(page, pageSize, search || undefined, kategoriId || undefined),
		getKategoriList(),
	])

	return (
		<div className="px-6 py-8 lg:px-8 flex flex-col gap-8 max-w-7xl mx-auto">
			<PageHeader
				title="Manajemen Barang"
				subtitle="Kelola data master barang dan kategori inventaris"
			/>

			<TabelBarang
				data={result.data}
				total={result.total}
				page={result.page}
				pageSize={result.pageSize}
				totalPages={result.totalPages}
				search={search}
				kategoriId={kategoriId}
				kategoriList={kategoriList.map((k) => ({ id: k.id, nama: k.nama }))}
			/>

			<KategoriSection data={kategoriList} />
		</div>
	)
}
