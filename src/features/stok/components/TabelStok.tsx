"use client"

import type { Prisma } from "@prisma/client"
import { Search, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState } from "react"
import { DataTable } from "@/components/common/DataTable"
import { EmptyState } from "@/components/common/EmptyState"
import { Pagination } from "@/components/common/Pagination"
import { Input } from "@/components/ui/input"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { StatusBadge } from "@/features/barang/components/StatusBadge"
import { cn } from "@/lib/utils"

type BarangWithKategori = Prisma.BarangGetPayload<{ include: { kategori: true } }>

type TabelStokProps = {
	data: BarangWithKategori[]
	total: number
	page: number
	pageSize: number
	totalPages: number
	search: string
}

export function TabelStok({ data, total, page, pageSize, totalPages, search }: TabelStokProps) {
	const router = useRouter()
	const searchParams = useSearchParams()
	const [searchInput, setSearchInput] = useState(search)

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
			router.push(`/dashboard/stok?${params.toString()}`)
		},
		[router, searchParams],
	)

	function handleSearch(e: React.FormEvent) {
		e.preventDefault()
		updateParams({ search: searchInput || undefined, page: "1" })
	}

	function handleClearSearch() {
		setSearchInput("")
		updateParams({ search: undefined, page: "1" })
	}

	return (
		<div className="flex flex-col gap-4">
			<form onSubmit={handleSearch} className="relative max-w-md">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
				<Input
					placeholder="Cari nama atau kode barang..."
					className="pl-9 pr-9"
					value={searchInput}
					onChange={(e) => setSearchInput(e.target.value)}
				/>
				{searchInput && (
					<button
						type="button"
						onClick={handleClearSearch}
						className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-muted"
						aria-label="Hapus pencarian"
					>
						<X className="h-3 w-3 text-muted-foreground" />
					</button>
				)}
			</form>

			<DataTable>
				<Table>
					<TableHeader>
						<TableRow className="bg-surface-raised">
							<TableHead className="w-12 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								No
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								Kode
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								Nama Barang
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								Kategori
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-right">
								Stok Saat Ini
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-right">
								Min. Stok
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								Status
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data.length === 0 ? (
							<TableRow>
								<TableCell colSpan={7}>
									<EmptyState message="Tidak ada data stok" />
								</TableCell>
							</TableRow>
						) : (
							data.map((item, index) => {
								const isLow = item.stok <= item.minStok
								return (
									<TableRow
										key={item.id}
										className={cn("hover:bg-surface-raised", isLow && "bg-warning-subtle/30")}
									>
										<TableCell className="text-sm">{(page - 1) * pageSize + index + 1}</TableCell>
										<TableCell className="text-sm font-mono">{item.kode}</TableCell>
										<TableCell className="text-sm font-medium">{item.namaBarang}</TableCell>
										<TableCell className="text-sm text-muted-foreground">
											{item.kategori.nama}
										</TableCell>
										<TableCell className="text-sm text-right font-medium">{item.stok}</TableCell>
										<TableCell className="text-sm text-right text-muted-foreground">
											{item.minStok}
										</TableCell>
										<TableCell>
											<StatusBadge stok={item.stok} minStok={item.minStok} />
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
