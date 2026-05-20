import { Layers } from "lucide-react"
import { PageHeader } from "@/components/common/PageHeader"
import { TabelStok } from "@/features/stok/components/TabelStok"
import { getStokOverview } from "@/features/stok/queries/stok.queries"

type StokPageProps = {
	searchParams: Promise<{
		page?: string
		pageSize?: string
		search?: string
	}>
}

export default async function StokPage({ searchParams }: StokPageProps) {
	const params = await searchParams
	const page = Number(params.page ?? 1)
	const pageSize = Number(params.pageSize ?? 10)
	const search = params.search ?? ""

	const result = await getStokOverview(page, pageSize, search || undefined)

	return (
		<div className="px-6 py-8 lg:px-8 flex flex-col gap-6 max-w-7xl mx-auto">
			<PageHeader
				icon={Layers}
				title="Monitoring Stok"
				subtitle="Pantau ketersediaan stok barang secara real-time"
			/>

			<TabelStok
				data={result.data}
				total={result.total}
				page={result.page}
				pageSize={result.pageSize}
				totalPages={result.totalPages}
				search={search}
			/>
		</div>
	)
}
