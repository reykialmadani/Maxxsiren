import { Activity, AlertTriangle, Layers, Package, Truck } from "lucide-react"

type KartuRingkasanProps = {
	totalJenisBarang: number
	totalStok: number
	stokRendah: number
	totalSupplier: number
	transaksiHariIni: number
}

export function KartuRingkasan({
	totalJenisBarang,
	totalStok,
	stokRendah,
	totalSupplier,
	transaksiHariIni,
}: KartuRingkasanProps) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
			<div className="bg-surface rounded-xl border border-border shadow-card p-6">
				<div className="w-10 h-10 rounded-lg bg-primary-subtle text-primary flex items-center justify-center">
					<Package className="h-5 w-5" />
				</div>
				<p className="text-sm font-medium text-muted-foreground mt-4">Total Jenis Barang</p>
				<p className="text-3xl font-bold text-foreground mt-1">{totalJenisBarang}</p>
			</div>

			<div className="bg-surface rounded-xl border border-border shadow-card p-6">
				<div className="w-10 h-10 rounded-lg bg-info-subtle text-info flex items-center justify-center">
					<Layers className="h-5 w-5" />
				</div>
				<p className="text-sm font-medium text-muted-foreground mt-4">Total Stok</p>
				<p className="text-3xl font-bold text-foreground mt-1">
					{totalStok.toLocaleString("id-ID")}
				</p>
			</div>

			<div className="bg-surface rounded-xl border border-border shadow-card p-6">
				<div className="w-10 h-10 rounded-lg bg-warning-subtle text-warning flex items-center justify-center">
					<AlertTriangle className="h-5 w-5" />
				</div>
				<p className="text-sm font-medium text-muted-foreground mt-4">Stok Rendah</p>
				<p className="text-3xl font-bold text-foreground mt-1">{stokRendah}</p>
				{stokRendah > 0 && <p className="text-xs text-warning mt-2">Perlu perhatian segera</p>}
			</div>

			<div className="bg-surface rounded-xl border border-border shadow-card p-6">
				<div className="w-10 h-10 rounded-lg bg-secondary-subtle text-secondary flex items-center justify-center">
					<Truck className="h-5 w-5" />
				</div>
				<p className="text-sm font-medium text-muted-foreground mt-4">Total Supplier</p>
				<p className="text-3xl font-bold text-foreground mt-1">{totalSupplier}</p>
			</div>

			<div className="bg-surface rounded-xl border border-border shadow-card p-6">
				<div className="w-10 h-10 rounded-lg bg-success-subtle text-success flex items-center justify-center">
					<Activity className="h-5 w-5" />
				</div>
				<p className="text-sm font-medium text-muted-foreground mt-4">Transaksi Hari Ini</p>
				<p className="text-3xl font-bold text-foreground mt-1">{transaksiHariIni}</p>
			</div>
		</div>
	)
}
