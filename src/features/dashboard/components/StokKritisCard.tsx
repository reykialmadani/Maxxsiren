import { AlertTriangle } from "lucide-react"
import Link from "next/link"
import { StatusBadge } from "@/features/barang/components/StatusBadge"
import type { StokKritisItem } from "@/features/dashboard/queries/dashboard.queries"

type StokKritisCardProps = {
	data: StokKritisItem[]
}

export function StokKritisCard({ data }: StokKritisCardProps) {
	if (data.length === 0) return null

	return (
		<div className="bg-surface rounded-lg border border-warning/30 shadow-card">
			<div className="px-6 py-4 border-b border-warning/20 flex items-center gap-2">
				<AlertTriangle className="h-4 w-4 text-warning" />
				<h2 className="text-lg font-semibold text-foreground">Peringatan Stok Rendah</h2>
			</div>
			<div className="px-6 py-4 flex flex-col gap-3">
				{data.map((item) => (
					<div key={item.id} className="flex items-center justify-between gap-4">
						<div className="flex flex-col min-w-0">
							<span className="text-sm font-medium text-foreground truncate">
								{item.namaBarang}
							</span>
							<span className="text-xs text-muted-foreground">
								{item.kategori.nama} · Kode: {item.kode}
							</span>
						</div>
						<div className="flex items-center gap-3 shrink-0">
							<span className="text-sm text-muted-foreground">
								{item.stok}/{item.minStok} {item.satuan}
							</span>
							<StatusBadge stok={item.stok} minStok={item.minStok} />
						</div>
					</div>
				))}
				<Link
					href="/dashboard/stok"
					className="text-xs text-primary font-medium hover:underline mt-1"
				>
					Lihat semua stok
				</Link>
			</div>
		</div>
	)
}
