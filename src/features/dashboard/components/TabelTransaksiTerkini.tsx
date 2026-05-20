import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react"
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

export function TabelTransaksiTerkini({ data }: TabelTransaksiTerkiniProps) {
	return (
		<div>
			<h2 className="text-lg font-semibold text-foreground mb-4">Transaksi Terkini</h2>
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
								Dicatat oleh
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data.length === 0 ? (
							<TableRow>
								<TableCell colSpan={5}>
									<EmptyState
										message="Belum ada transaksi"
										description="Transaksi barang masuk dan keluar akan muncul di sini"
									/>
								</TableCell>
							</TableRow>
						) : (
							data.map((item) => (
								<TableRow key={`${item.tipe}-${item.id}`} className="hover:bg-surface-raised">
									<TableCell className="text-sm text-muted-foreground whitespace-nowrap">
										{formatWaktu(item.createdAt)}
									</TableCell>
									<TableCell>
										{item.tipe === "masuk" ? (
											<span className="inline-flex items-center gap-1 text-xs font-medium text-success">
												<ArrowDownToLine className="h-3 w-3" />
												Masuk
											</span>
										) : (
											<span className="inline-flex items-center gap-1 text-xs font-medium text-danger">
												<ArrowUpFromLine className="h-3 w-3" />
												Keluar
											</span>
										)}
									</TableCell>
									<TableCell className="text-sm font-medium">
										{item.barang.namaBarang}
										{item.barang.deletedAt && (
											<span className="ml-1 text-xs text-muted-foreground">(diarsipkan)</span>
										)}
									</TableCell>
									<TableCell className="text-sm text-right font-medium">
										<span className={item.tipe === "masuk" ? "text-success" : "text-danger"}>
											{item.tipe === "masuk" ? "+" : "−"}
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
