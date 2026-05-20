import { Truck } from "lucide-react"
import { PageHeader } from "@/components/common/PageHeader"
import { TabelSupplier } from "@/features/supplier/components/TabelSupplier"
import { getSupplierList } from "@/features/supplier/queries/supplier.queries"

type SupplierPageProps = {
	searchParams: Promise<{ search?: string }>
}

export default async function SupplierPage({ searchParams }: SupplierPageProps) {
	const params = await searchParams
	const search = params.search ?? ""

	const data = await getSupplierList(search || undefined)

	return (
		<div className="px-6 py-8 lg:px-8 flex flex-col gap-6 max-w-7xl mx-auto">
			<PageHeader
				icon={Truck}
				title="Data Supplier"
				subtitle="Kelola informasi pemasok dan vendor barang"
			/>
			<TabelSupplier data={data} search={search} />
		</div>
	)
}
