"use client"

import { ArrowDownToLine, ArrowUpFromLine, Eye, RotateCcw } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { DataTable } from "@/components/common/DataTable"
import { EmptyState } from "@/components/common/EmptyState"
import { Pagination } from "@/components/common/Pagination"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import type { LaporanPreviewItem } from "@/features/laporan/queries/laporan.queries"
import { formatWaktu } from "@/lib/utils"

type LaporanPreviewTabelProps = {
	data: LaporanPreviewItem[]
	total: number
	page: number
	pageSize: number
	totalPages: number
	tipeFilter: string
	basePath: string
}

function getSourceIcon(source: LaporanPreviewItem["source"]) {
	switch (source) {
		case "barang-masuk":
			return <ArrowDownToLine className="h-3 w-3 text-success" />
		case "barang-keluar":
			return <ArrowUpFromLine className="h-3 w-3 text-danger" />
		case "retur-masuk":
			return <RotateCcw className="h-3 w-3 text-success" />
		case "retur-keluar":
			return <RotateCcw className="h-3 w-3 text-danger" />
	}
}

function getSourceLabel(source: LaporanPreviewItem["source"]) {
	switch (source) {
		case "barang-masuk":
			return "Masuk"
		case "barang-keluar":
			return "Keluar"
		case "retur-masuk":
			return "Retur +"
		case "retur-keluar":
			return "Retur −"
	}
}

export function LaporanPreviewTabel({
	data,
	total,
	page,
	pageSize,
	totalPages,
	tipeFilter,
	basePath,
}: LaporanPreviewTabelProps) {
	const router = useRouter()
	const searchParams = useSearchParams()

	const updateParams = useCallback(
		(updates: Record<string, string | undefined>) => {
			const params = new URLSearchParams(searchParams.toString())
			for (const [key, value] of Object.entries(updates)) {
				if (value === undefined || value === "") {
					params.delete(key)
				} else {
					params.set(key, value)
				}
			}
			router.push(`${basePath}?${params.toString()}`)
		},
		[router, searchParams, basePath],
	)

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center justify-between">
				<h3 className="text-base font-semibold text-foreground">Preview Data</h3>
				<Select
					value={tipeFilter}
					onValueChange={(v) => updateParams({ tipe: v === "all" ? undefined : v, page: "1" })}
				>
					<SelectTrigger className="w-[140px] h-8 text-xs">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">Semua</SelectItem>
						<SelectItem value="barang">Barang</SelectItem>
						<SelectItem value="retur">Retur</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<DataTable>
				<Table>
					<TableHeader>
						<TableRow className="bg-surface-raised">
							<TableHead className="w-10 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								No
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								Tanggal
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								Tipe
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								Pihak
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								Barang
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-right">
								Jumlah
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden md:table-cell">
								Keterangan
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden md:table-cell">
								Oleh
							</TableHead>
							<TableHead className="w-10 text-xs font-semibold uppercase tracking-wide text-muted-foreground"></TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data.length === 0 ? (
							<TableRow>
								<TableCell colSpan={9}>
									<EmptyState message="Tidak ada transaksi pada periode ini" />
								</TableCell>
							</TableRow>
						) : (
							data.map((item, index) => {
								const isPositive = item.source === "barang-masuk" || item.source === "retur-masuk"
								return (
									<TableRow key={`${item.source}-${item.id}`} className="hover:bg-surface-raised">
										<TableCell className="text-sm">{(page - 1) * pageSize + index + 1}</TableCell>
										<TableCell className="text-sm text-muted-foreground whitespace-nowrap">
											{formatWaktu(item.tanggal)}
										</TableCell>
										<TableCell>
											<span className="inline-flex items-center gap-1 text-xs font-medium">
												{getSourceIcon(item.source)}
												{getSourceLabel(item.source)}
											</span>
										</TableCell>
										<TableCell className="text-sm">{item.pihak}</TableCell>
										<TableCell className="text-sm">
											<span className="font-mono text-xs text-muted-foreground">{item.kode}</span>
											<span className="ml-1 font-medium">{item.namaBarang}</span>
										</TableCell>
										<TableCell className="text-sm text-right font-medium">
											<span className={isPositive ? "text-success" : "text-danger"}>
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
										<TableCell>
											<Link
												href={`/dashboard/barang/${item.barangId}`}
												className="inline-flex items-center justify-center h-7 w-7 rounded hover:bg-muted transition-colors"
												aria-label={`Detail ${item.namaBarang}`}
											>
												<Eye className="h-3.5 w-3.5 text-muted-foreground" />
											</Link>
										</TableCell>
									</TableRow>
								)
							})
						)}
					</TableBody>
				</Table>

				<Pagination
					page={page}
					totalPages={totalPages}
					pageSize={pageSize}
					total={total}
					onPageChange={(p) => updateParams({ page: String(p) })}
					onPageSizeChange={(s) => updateParams({ pageSize: String(s), page: "1" })}
				/>
			</DataTable>
		</div>
	)
}
