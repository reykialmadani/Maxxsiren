"use client"

import type { Prisma } from "@prisma/client"
import { Plus, Search, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState } from "react"
import { DataTable } from "@/components/common/DataTable"
import { EmptyState } from "@/components/common/EmptyState"
import { Pagination } from "@/components/common/Pagination"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { formatWaktu } from "@/lib/utils"
import { FormBarangMasuk } from "./FormBarangMasuk"

type RiwayatItem = Prisma.BarangMasukGetPayload<{
	include: {
		barang: { select: { kode: true; namaBarang: true; deletedAt: true } }
		user: { select: { nama: true } }
	}
}>

type BarangOption = {
	id: string
	kode: string
	namaBarang: string
	stok: number
}

type TabelBarangMasukProps = {
	data: RiwayatItem[]
	total: number
	page: number
	pageSize: number
	totalPages: number
	search: string
	barangList: BarangOption[]
}

export function TabelBarangMasuk({
	data,
	total,
	page,
	pageSize,
	totalPages,
	search,
	barangList,
}: TabelBarangMasukProps) {
	const router = useRouter()
	const searchParams = useSearchParams()
	const [searchInput, setSearchInput] = useState(search)
	const [open, setOpen] = useState(false)

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
			router.push(`/dashboard/barang-masuk?${params.toString()}`)
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
			<div className="flex flex-col sm:flex-row gap-3 justify-between">
				<form onSubmit={handleSearch} className="relative flex-1 max-w-md">
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

				<Dialog open={open} onOpenChange={setOpen}>
					<DialogTrigger asChild>
						<Button>
							<Plus className="h-4 w-4 mr-1" />
							Catat Barang Masuk
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Catat Barang Masuk</DialogTitle>
						</DialogHeader>
						<FormBarangMasuk barangList={barangList} onSuccess={() => setOpen(false)} />
					</DialogContent>
				</Dialog>
			</div>

			<DataTable>
				<Table>
					<TableHeader>
						<TableRow className="bg-surface-raised">
							<TableHead className="w-12 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								No
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								Waktu
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								Kode
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								Nama Barang
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-right">
								Jumlah
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								Keterangan
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								Dicatat oleh
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data.length === 0 ? (
							<TableRow>
								<TableCell colSpan={7}>
									<EmptyState message="Belum ada riwayat barang masuk" />
								</TableCell>
							</TableRow>
						) : (
							data.map((item, index) => (
								<TableRow key={item.id} className="hover:bg-surface-raised">
									<TableCell className="text-sm">{(page - 1) * pageSize + index + 1}</TableCell>
									<TableCell className="text-sm text-muted-foreground whitespace-nowrap">
										{formatWaktu(item.createdAt)}
									</TableCell>
									<TableCell className="text-sm font-mono">{item.barang.kode}</TableCell>
									<TableCell className="text-sm font-medium">
										{item.barang.namaBarang}
										{item.barang.deletedAt && (
											<span className="ml-1 text-xs text-muted-foreground">(diarsipkan)</span>
										)}
									</TableCell>
									<TableCell className="text-sm text-right font-medium text-success">
										+{item.jumlah}
									</TableCell>
									<TableCell className="text-sm text-muted-foreground">
										{item.keterangan ?? "-"}
									</TableCell>
									<TableCell className="text-sm text-muted-foreground">{item.user.nama}</TableCell>
								</TableRow>
							))
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
