"use client"

import type { Prisma } from "@prisma/client"
import { ArrowDownToLine, ArrowUpFromLine, Plus, Search, Trash2, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState, useTransition } from "react"
import { toast } from "sonner"
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
import { hapusRetur } from "@/features/retur/actions/retur.actions"
import { formatWaktu } from "@/lib/utils"
import { FormRetur } from "./FormRetur"

type ReturItem = Prisma.ReturGetPayload<{
	include: {
		barang: { select: { kode: true; namaBarang: true; deletedAt: true } }
		user: { select: { nama: true } }
		supplier: { select: { nama: true } }
	}
}>

type BarangOption = { id: string; kode: string; namaBarang: string; stok: number }
type SupplierOption = { id: string; nama: string }

type TabelReturProps = {
	data: ReturItem[]
	total: number
	page: number
	pageSize: number
	totalPages: number
	search: string
	tipeFilter: string
	barangList: BarangOption[]
	supplierList: SupplierOption[]
}

export function TabelRetur({
	data,
	total,
	page,
	pageSize,
	totalPages,
	search,
	tipeFilter,
	barangList,
	supplierList,
}: TabelReturProps) {
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
			router.push(`/dashboard/retur?${params.toString()}`)
		},
		[router, searchParams],
	)

	function handleSearch(e: React.FormEvent) {
		e.preventDefault()
		updateParams({ search: searchInput || undefined, page: "1" })
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col sm:flex-row gap-3 justify-between">
				<div className="flex flex-col sm:flex-row gap-3 flex-1">
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
								onClick={() => {
									setSearchInput("")
									updateParams({ search: undefined, page: "1" })
								}}
								className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-muted"
								aria-label="Hapus pencarian"
							>
								<X className="h-3 w-3 text-muted-foreground" />
							</button>
						)}
					</form>

					<Select
						value={tipeFilter || "all"}
						onValueChange={(v) => updateParams({ tipe: v === "all" ? undefined : v, page: "1" })}
					>
						<SelectTrigger className="w-full sm:w-[180px]">
							<SelectValue placeholder="Semua tipe" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">Semua tipe</SelectItem>
							<SelectItem value="MASUK">Retur Masuk</SelectItem>
							<SelectItem value="KELUAR">Retur Keluar</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<Dialog open={open} onOpenChange={setOpen}>
					<DialogTrigger asChild>
						<Button>
							<Plus className="h-4 w-4 mr-1" />
							Catat Retur
						</Button>
					</DialogTrigger>
					<DialogContent className="max-w-lg">
						<DialogHeader>
							<DialogTitle>Catat Retur</DialogTitle>
						</DialogHeader>
						<FormRetur
							barangList={barangList}
							supplierList={supplierList}
							onSuccess={() => setOpen(false)}
						/>
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
								Tanggal
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								Tipe
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								Barang
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								Pihak
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
							<TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-right">
								Aksi
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data.length === 0 ? (
							<TableRow>
								<TableCell colSpan={9}>
									<EmptyState message="Belum ada riwayat retur" />
								</TableCell>
							</TableRow>
						) : (
							data.map((item, index) => (
								<TableRow key={item.id} className="hover:bg-surface-raised">
									<TableCell className="text-sm">{(page - 1) * pageSize + index + 1}</TableCell>
									<TableCell className="text-sm text-muted-foreground whitespace-nowrap">
										{formatWaktu(item.tanggalRetur)}
									</TableCell>
									<TableCell>
										{item.tipe === "MASUK" ? (
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
									<TableCell className="text-sm">
										{item.tipe === "MASUK" ? item.namaPenerima : item.supplier?.nama}
									</TableCell>
									<TableCell className="text-sm text-right font-medium">
										<span className={item.tipe === "MASUK" ? "text-success" : "text-danger"}>
											{item.tipe === "MASUK" ? "+" : "−"}
											{item.jumlah}
										</span>
									</TableCell>
									<TableCell className="text-sm text-muted-foreground">
										{item.keterangan ?? "-"}
									</TableCell>
									<TableCell className="text-sm text-muted-foreground">{item.user.nama}</TableCell>
									<TableCell className="text-right">
										<HapusButton id={item.id} />
									</TableCell>
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

function HapusButton({ id }: { id: string }) {
	const [isPending, startTransition] = useTransition()

	function handleHapus() {
		if (!confirm("Batalkan retur ini? Stok akan di-reverse.")) return
		startTransition(async () => {
			const result = await hapusRetur(id)
			if (result.success) {
				toast.success("Retur berhasil dibatalkan")
			} else {
				toast.error(result.error)
			}
		})
	}

	return (
		<Button
			variant="ghost"
			size="icon"
			className="h-8 w-8"
			disabled={isPending}
			onClick={handleHapus}
			aria-label="Batalkan retur"
		>
			<Trash2 className="h-4 w-4 text-muted-foreground hover:text-danger" />
		</Button>
	)
}
