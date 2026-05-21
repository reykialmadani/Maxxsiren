import { ArrowLeft, Package } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ActivityLog } from "@/features/barang/components/ActivityLog"
import { BarcodeLabel } from "@/features/barang/components/BarcodeLabel"
import { StatusBadge } from "@/features/barang/components/StatusBadge"
import {
	getActivityLog,
	getBarangDetail,
	getBarangStats,
	getBreakdownSupplier,
} from "@/features/barang/queries/detail.queries"

type DetailBarangPageProps = {
	params: Promise<{ id: string }>
}

export default async function DetailBarangPage({ params }: DetailBarangPageProps) {
	const { id } = await params
	const [barang, breakdown, activityLog, stats] = await Promise.all([
		getBarangDetail(id),
		getBreakdownSupplier(id),
		getActivityLog(id),
		getBarangStats(id),
	])

	if (!barang) notFound()

	return (
		<div className="px-6 py-8 lg:px-8 flex flex-col gap-6 max-w-5xl mx-auto">
			<Link
				href="/dashboard/barang"
				className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
			>
				<ArrowLeft className="h-4 w-4" />
				Kembali ke Daftar Barang
			</Link>

			<div className="bg-surface rounded-lg border border-border shadow-card p-6">
				<div className="flex flex-col md:flex-row gap-6">
					<div className="flex-shrink-0">
						{barang.gambarUrl ? (
							<img
								src={barang.gambarUrl}
								alt={barang.namaBarang}
								className="w-40 h-40 object-cover rounded-lg border border-border"
								onError={(e) => {
									e.currentTarget.style.display = "none"
								}}
							/>
						) : (
							<div className="w-40 h-40 rounded-lg border border-border bg-surface-raised flex items-center justify-center">
								<Package className="h-16 w-16 text-muted-foreground opacity-40" />
							</div>
						)}
					</div>

					<div className="flex-1 flex flex-col gap-3">
						<div className="flex items-start justify-between gap-4">
							<div>
								<p className="text-xs font-mono text-muted-foreground">{barang.kode}</p>
								<h1 className="text-2xl font-bold text-foreground mt-0.5">{barang.namaBarang}</h1>
								<p className="text-sm text-muted-foreground mt-1">{barang.kategori.nama}</p>
							</div>
							<StatusBadge stok={barang.stok} minStok={barang.minStok} />
						</div>

						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<span>
								Satuan: <span className="text-foreground font-medium">{barang.satuan}</span>
							</span>
							<span>·</span>
							<span>
								Min. Stok: <span className="text-foreground font-medium">{barang.minStok}</span>
							</span>
						</div>
					</div>

					<div className="flex-shrink-0 print:block">
						<BarcodeLabel kode={barang.kode} namaBarang={barang.namaBarang} />
					</div>
				</div>
			</div>

			<div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
				{[
					{ label: "Stok Saat Ini", value: barang.stok, color: "text-primary" },
					{ label: "Min. Stok", value: barang.minStok, color: "text-foreground" },
					{ label: "Total Masuk", value: stats.totalMasuk, color: "text-success" },
					{ label: "Total Keluar", value: stats.totalKeluar, color: "text-danger" },
					{
						label: "Total Retur",
						value: stats.totalReturMasuk + stats.totalReturKeluar,
						color: "text-warning",
					},
				].map((stat) => (
					<div
						key={stat.label}
						className="bg-surface rounded-lg border border-border shadow-card p-4 flex flex-col gap-1"
					>
						<p className="text-xs text-muted-foreground">{stat.label}</p>
						<p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
					</div>
				))}
			</div>

			{breakdown.length > 0 && (
				<div className="bg-surface rounded-lg border border-border shadow-card">
					<div className="px-6 py-4 border-b border-border-subtle">
						<h2 className="text-lg font-semibold text-foreground">Kontribusi per Supplier</h2>
						<p className="text-sm text-muted-foreground mt-0.5">
							Total unit masuk dari setiap supplier
						</p>
					</div>
					<div className="px-6 py-4 flex flex-col gap-3">
						{breakdown.map((item) => (
							<div key={item.supplierId} className="flex items-center justify-between gap-4">
								<span className="text-sm font-medium text-foreground">{item.nama}</span>
								<div className="flex items-center gap-3 text-sm text-muted-foreground">
									<span>{item.totalUnit} unit</span>
									<span>·</span>
									<span>{item.totalTransaksi} transaksi</span>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			<ActivityLog data={activityLog} />
		</div>
	)
}
