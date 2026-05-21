import { ArrowRight, Truck } from "lucide-react"
import Link from "next/link"
import type { TopSupplierItem } from "@/features/dashboard/queries/dashboard.queries"

type TopSupplierCardProps = {
	data: TopSupplierItem[]
}

export function TopSupplierCard({ data }: TopSupplierCardProps) {
	return (
		<div className="bg-surface rounded-lg border border-border shadow-card">
			<div className="px-5 py-4 border-b border-border-subtle flex items-center gap-2">
				<Truck className="h-4 w-4 text-primary" />
				<h2 className="text-base font-semibold text-foreground">Top Supplier Bulan Ini</h2>
			</div>
			<div className="px-5 py-3 flex flex-col gap-2">
				{data.length === 0 ? (
					<p className="text-sm text-muted-foreground py-2">Belum ada transaksi bulan ini</p>
				) : (
					data.map((item, index) => (
						<div key={item.nama} className="flex items-center justify-between gap-3">
							<div className="flex items-center gap-2 min-w-0">
								<span className="text-xs text-muted-foreground w-4 shrink-0">{index + 1}.</span>
								<span className="text-sm font-medium text-foreground truncate">{item.nama}</span>
							</div>
							<div className="flex items-center gap-2 shrink-0 text-xs text-muted-foreground">
								<span>{item.totalUnit} unit</span>
								<span className="text-border">·</span>
								<span>{item.totalTransaksi}x</span>
							</div>
						</div>
					))
				)}
				<Link
					href="/dashboard/supplier"
					className="text-xs text-primary font-medium hover:underline mt-1 flex items-center gap-1"
				>
					Lihat semua supplier
					<ArrowRight className="h-3 w-3" />
				</Link>
			</div>
		</div>
	)
}
