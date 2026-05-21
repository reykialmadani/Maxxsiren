import { ArrowDownToLine, ArrowUpFromLine, RotateCcw } from "lucide-react"
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
import type { ActivityLogItem } from "@/features/barang/queries/detail.queries"
import { cn, formatWaktu } from "@/lib/utils"

type ActivityLogProps = {
	data: ActivityLogItem[]
}

function getTipeDisplay(tipe: ActivityLogItem["tipe"]) {
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

export function ActivityLog({ data }: ActivityLogProps) {
	return (
		<div>
			<h2 className="text-lg font-semibold text-foreground mb-4">Log Aktivitas</h2>
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
								Pihak
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-right">
								Jumlah
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden md:table-cell">
								Keterangan
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden md:table-cell">
								Dicatat oleh
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data.length === 0 ? (
							<TableRow>
								<TableCell colSpan={6}>
									<EmptyState
										message="Belum ada aktivitas"
										description="Transaksi masuk, keluar, dan retur akan muncul di sini"
									/>
								</TableCell>
							</TableRow>
						) : (
							data.map((item) => {
								const isPositive = item.tipe === "masuk" || item.tipe === "retur-masuk"
								return (
									<TableRow
										key={`${item.tipe}-${item.id}`}
										className={cn("hover:bg-surface-raised", item.dibatalkan && "opacity-50")}
									>
										<TableCell className="text-sm text-muted-foreground whitespace-nowrap">
											<span className={cn(item.dibatalkan && "line-through")}>
												{formatWaktu(item.tanggal)}
											</span>
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-1.5">
												{item.dibatalkan && (
													<span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
														Dibatalkan
													</span>
												)}
												{getTipeDisplay(item.tipe)}
											</div>
										</TableCell>
										<TableCell className="text-sm">{item.pihak}</TableCell>
										<TableCell className="text-sm text-right font-medium">
											<span
												className={cn(
													isPositive ? "text-success" : "text-danger",
													item.dibatalkan && "line-through",
												)}
											>
												{isPositive ? "+" : "\u2212"}
												{item.jumlah}
											</span>
										</TableCell>
										<TableCell className="text-sm text-muted-foreground hidden md:table-cell">
											{item.keterangan ?? "-"}
										</TableCell>
										<TableCell className="text-sm text-muted-foreground hidden md:table-cell">
											{item.user}
										</TableCell>
									</TableRow>
								)
							})
						)}
					</TableBody>
				</Table>
			</DataTable>
		</div>
	)
}
