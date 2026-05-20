import { ArrowDownToLine, ArrowUpFromLine, Clock, RotateCcw } from "lucide-react"
import { DataTable } from "@/components/common/DataTable"
import { EmptyState } from "@/components/common/EmptyState"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import type { TransaksiTerkiniItem } from "@/features/dashboard/queries/dashboard.queries"
import { formatWaktu } from "@/lib/utils"

type TabelTransaksiTerkiniProps = {
	data: TransaksiTerkiniItem[]
}

function getTipeLabel(tipe: TransaksiTerkiniItem["tipe"]) {
	switch (tipe) {
		case "masuk":
			return (
				<span className="inline-flex items-center gap-1 text-xs font-medium text-success">
					<ArrowDownToLine className="h-3 w-3" />
					Masuk
				</span>
			)
		case "keluar":
			return (
				<span className="inline-flex items-center gap-1 text-xs font-medium text-danger">
					<ArrowUpFromLine className="h-3 w-3" />
					Keluar
				</span>
			)
		case "retur-masuk":
			return (
				<span className="inline-flex items-center gap-1 text-xs font-medium text-success">
					<RotateCcw className="h-3 w-3" />
					Retur +
				</span>
			)
		case "retur-keluar":
			return (
				<span className="inline-flex items-center gap-1 text-xs font-medium text-danger">
					<RotateCcw className="h-3 w-3" />
					Retur −
				</span>
			)
	}
}

function getJumlahColor(tipe: TransaksiTerkiniItem["tipe"]) {
	return tipe === "masuk" || tipe === "retur-masuk" ? "text-success" : "text-danger"
}

function getJumlahPrefix(tipe: TransaksiTerkiniItem["tipe"]) {
	return tipe === "masuk" || tipe === "retur-masuk" ? "+" : "\u2212"
}

export function TabelTransaksiTerkini({ data }: TabelTransaksiTerkiniProps) {
	return (
		<div>
			<h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
				<Clock className="h-5 w-5 text-primary" />
				Transaksi Terkini
			</h2>
			<DataTable>
				<Table>
					<TableHeader>
						<TableRow className="bg-surface-raised">
							<TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								Waktu
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								Tipe
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								Barang
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-right">
								Jumlah
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								Oleh
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data.length === 0 ? (
							<TableRow>
								<TableCell colSpan={5}>
									<EmptyState
										message="Belum ada transaksi"
										description="Transaksi barang masuk, keluar, dan retur akan muncul di sini"
									/>
								</TableCell>
							</TableRow>
						) : (
							data.map((item) => (
								<TableRow key={`${item.tipe}-${item.id}`} className="hover:bg-surface-raised">
									<TableCell className="text-sm text-muted-foreground whitespace-nowrap">
										{formatWaktu(item.createdAt)}
									</TableCell>
									<TableCell>{getTipeLabel(item.tipe)}</TableCell>
									<TableCell className="text-sm font-medium">
										{item.barang.namaBarang}
										{item.barang.deletedAt && (
											<span className="ml-1 text-xs text-muted-foreground">(diarsipkan)</span>
										)}
									</TableCell>
									<TableCell className="text-sm text-right font-medium">
										<span className={getJumlahColor(item.tipe)}>
											{getJumlahPrefix(item.tipe)}
											{item.jumlah}
										</span>
									</TableCell>
									<TableCell className="text-sm text-muted-foreground">{item.user.nama}</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</DataTable>
		</div>
	)
}
