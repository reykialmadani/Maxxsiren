import { ArrowRight, TrendingDown } from "lucide-react"
import Link from "next/link"
import type { TopBarangKeluarItem } from "@/features/dashboard/queries/dashboard.queries"

type TopBarangKeluarCardProps = {
	data: TopBarangKeluarItem[]
}

export function TopBarangKeluarCard({ data }: TopBarangKeluarCardProps) {
	return (
		<div className="bg-surface rounded-lg border border-border shadow-card">
			<div className="px-5 py-4 border-b border-border-subtle flex items-center gap-2">
				<TrendingDown className="h-4 w-4 text-danger" />
				<h2 className="text-base font-semibold text-foreground">Top Barang Keluar Bulan Ini</h2>
			</div>
			<div className="px-5 py-3 flex flex-col gap-2">
				{data.length === 0 ? (
					<p className="text-sm text-muted-foreground py-2">Belum ada transaksi bulan ini</p>
				) : (
					data.map((item, index) => (
						<div key={item.barangId} className="flex items-center justify-between gap-3">
							<div className="flex items-center gap-2 min-w-0">
								<span className="text-xs text-muted-foreground w-4 shrink-0">{index + 1}.</span>
								<div className="min-w-0">
									<p className="text-sm font-medium text-foreground truncate">{item.namaBarang}</p>
									<p className="text-xs text-muted-foreground font-mono">{item.kode}</p>
								</div>
							</div>
							<span className="text-sm font-medium text-danger shrink-0">−{item.totalKeluar}</span>
						</div>
					))
				)}
				<Link
					href="/dashboard/barang-keluar"
					className="text-xs text-primary font-medium hover:underline mt-1 flex items-center gap-1"
				>
					Lihat semua keluar
					<ArrowRight className="h-3 w-3" />
				</Link>
			</div>
		</div>
	)
}
