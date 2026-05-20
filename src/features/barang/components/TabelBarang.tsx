"use client"

import type { Prisma } from "@prisma/client"
import { Archive, Pencil, Plus, Search, X } from "lucide-react"
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
import { arsipkanBarang } from "@/features/barang/actions/barang.actions"
import { FormBarang } from "./FormBarang"
import { StatusBadge } from "./StatusBadge"

type BarangWithKategori = Prisma.BarangGetPayload<{ include: { kategori: true } }>

type Kategori = { id: string; nama: string }

type TabelBarangProps = {
	data: BarangWithKategori[]
	total: number
	page: number
	pageSize: number
	totalPages: number
	search: string
	kategoriId: string
	kategoriList: Kategori[]
}

export function TabelBarang({
	data,
	total,
	page,
	pageSize,
	totalPages,
	search,
	kategoriId,
	kategoriList,
}: TabelBarangProps) {
	const router = useRouter()
	const searchParams = useSearchParams()
	const [searchInput, setSearchInput] = useState(search)
	const [open, setOpen] = useState(false)
	const [editItem, setEditItem] = useState<BarangWithKategori | null>(null)

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
			router.push(`/dashboard/barang?${params.toString()}`)
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

	function handleOpenCreate() {
		setEditItem(null)
		setOpen(true)
	}

	function handleOpenEdit(item: BarangWithKategori) {
		setEditItem(item)
		setOpen(true)
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
								onClick={handleClearSearch}
								className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-muted"
								aria-label="Hapus pencarian"
							>
								<X className="h-3 w-3 text-muted-foreground" />
							</button>
						)}
					</form>

					<Select
						value={kategoriId || "all"}
						onValueChange={(value) =>
							updateParams({
								kategoriId: value === "all" ? undefined : value,
								page: "1",
							})
						}
					>
						<SelectTrigger className="w-full sm:w-[200px]">
							<SelectValue placeholder="Semua kategori" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">Semua kategori</SelectItem>
							{kategoriList.map((k) => (
								<SelectItem key={k.id} value={k.id}>
									{k.nama}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<Dialog open={open} onOpenChange={setOpen}>
					<DialogTrigger asChild>
						<Button onClick={handleOpenCreate}>
							<Plus className="h-4 w-4 mr-1" />
							Tambah Barang
						</Button>
					</DialogTrigger>
					<DialogContent className="max-w-2xl">
						<DialogHeader>
							<DialogTitle>{editItem ? "Edit Barang" : "Tambah Barang"}</DialogTitle>
						</DialogHeader>
						<FormBarang
							kategoriList={kategoriList}
							defaultValues={
								editItem
									? {
											kode: editItem.kode,
											namaBarang: editItem.namaBarang,
											kategoriId: editItem.kategoriId,
											satuan: editItem.satuan,
											minStok: editItem.minStok,
										}
									: undefined
							}
							editId={editItem?.id}
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
								Kode
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								Nama Barang
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								Kategori
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-right">
								Stok
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								Satuan
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-right">
								Min. Stok
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								Status
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
									<EmptyState message="Tidak ada barang" />
								</TableCell>
							</TableRow>
						) : (
							data.map((item, index) => (
								<TableRow key={item.id} className="hover:bg-surface-raised">
									<TableCell className="text-sm">{(page - 1) * pageSize + index + 1}</TableCell>
									<TableCell className="text-sm font-mono">{item.kode}</TableCell>
									<TableCell className="text-sm font-medium">{item.namaBarang}</TableCell>
									<TableCell className="text-sm text-muted-foreground">
										{item.kategori.nama}
									</TableCell>
									<TableCell className="text-sm text-right font-medium">{item.stok}</TableCell>
									<TableCell className="text-sm">{item.satuan}</TableCell>
									<TableCell className="text-sm text-right text-muted-foreground">
										{item.minStok}
									</TableCell>
									<TableCell>
										<StatusBadge stok={item.stok} minStok={item.minStok} />
									</TableCell>
									<TableCell className="text-right">
										<div className="flex items-center justify-end gap-1">
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8"
												onClick={() => handleOpenEdit(item)}
												aria-label={`Edit ${item.namaBarang}`}
											>
												<Pencil className="h-4 w-4 text-muted-foreground" />
											</Button>
											<ArsipkanButton id={item.id} nama={item.namaBarang} />
										</div>
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

function ArsipkanButton({ id, nama }: { id: string; nama: string }) {
	const [isPending, startTransition] = useTransition()

	function handleArsipkan() {
		if (!confirm(`Arsipkan barang "${nama}"? Barang akan disembunyikan dari daftar.`)) return

		startTransition(async () => {
			const result = await arsipkanBarang(id)
			if (result.success) {
				toast.success("Barang berhasil diarsipkan")
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
			onClick={handleArsipkan}
			aria-label={`Arsipkan ${nama}`}
		>
			<Archive className="h-4 w-4 text-muted-foreground hover:text-danger" />
		</Button>
	)
}
