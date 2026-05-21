import { ArrowDownToLine, ArrowUpFromLine, Hash, TrendingUp, Truck, Users } from "lucide-react"

type SummaryMasukProps = {
	mode: "masuk"
	totalTransaksi: number
	totalUnit: number
	supplierUnik: number
	barangTerbanyak: { nama: string; jumlah: number } | null
}

type SummaryKeluarProps = {
	mode: "keluar"
	totalTransaksi: number
	totalUnit: number
	penerimaUnik: number
	barangTerbanyak: { nama: string; jumlah: number } | null
}

type LaporanSummaryCardsProps = SummaryMasukProps | SummaryKeluarProps

export function LaporanSummaryCards(props: LaporanSummaryCardsProps) {
	const cards =
		props.mode === "masuk"
			? [
					{
						label: "Total Transaksi",
						value: props.totalTransaksi,
						icon: Hash,
						color: "text-primary",
					},
					{
						label: "Total Unit Masuk",
						value: props.totalUnit,
						icon: ArrowDownToLine,
						color: "text-success",
					},
					{ label: "Supplier Aktif", value: props.supplierUnik, icon: Truck, color: "text-info" },
					{
						label: "Barang Terbanyak",
						value: props.barangTerbanyak
							? `${props.barangTerbanyak.nama} (${props.barangTerbanyak.jumlah})`
							: "-",
						icon: TrendingUp,
						color: "text-warning",
					},
				]
			: [
					{
						label: "Total Transaksi",
						value: props.totalTransaksi,
						icon: Hash,
						color: "text-primary",
					},
					{
						label: "Total Unit Keluar",
						value: props.totalUnit,
						icon: ArrowUpFromLine,
						color: "text-danger",
					},
					{ label: "Penerima Unik", value: props.penerimaUnik, icon: Users, color: "text-info" },
					{
						label: "Barang Terbanyak",
						value: props.barangTerbanyak
							? `${props.barangTerbanyak.nama} (${props.barangTerbanyak.jumlah})`
							: "-",
						icon: TrendingUp,
						color: "text-warning",
					},
				]

	return (
		<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
			{cards.map((card) => {
				const Icon = card.icon
				return (
					<div
						key={card.label}
						className="bg-surface rounded-lg border border-border shadow-card p-4 flex flex-col gap-2"
					>
						<div className="flex items-center gap-2">
							<Icon className={`h-4 w-4 ${card.color}`} />
							<span className="text-xs text-muted-foreground">{card.label}</span>
						</div>
						<p className="text-lg font-bold text-foreground truncate">
							{typeof card.value === "number" ? card.value.toLocaleString("id-ID") : card.value}
						</p>
					</div>
				)
			})}
		</div>
	)
}
