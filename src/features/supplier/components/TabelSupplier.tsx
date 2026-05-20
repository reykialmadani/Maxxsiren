"use client"

import { Pencil, Plus, Search, Trash2, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState, useTransition } from "react"
import { toast } from "sonner"
import { DataTable } from "@/components/common/DataTable"
import { EmptyState } from "@/components/common/EmptyState"
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
import { hapusSupplier } from "@/features/supplier/actions/supplier.actions"
import { FormSupplier } from "./FormSupplier"

type SupplierItem = {
	id: string
	nama: string
	telepon: string
	alamat: string
	_count: { barangMasuk: number }
}

type TabelSupplierProps = {
	data: SupplierItem[]
	search: string
}

export function TabelSupplier({ data, search }: TabelSupplierProps) {
	const router = useRouter()
	const searchParams = useSearchParams()
	const [searchInput, setSearchInput] = useState(search)
	const [open, setOpen] = useState(false)
	const [editItem, setEditItem] = useState<SupplierItem | null>(null)

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
			router.push(`/dashboard/supplier?${params.toString()}`)
		},
		[router, searchParams],
	)

	function handleSearch(e: React.FormEvent) {
		e.preventDefault()
		updateParams({ search: searchInput || undefined })
	}

	function handleClearSearch() {
		setSearchInput("")
		updateParams({ search: undefined })
	}

	function handleOpenCreate() {
		setEditItem(null)
		setOpen(true)
	}

	function handleOpenEdit(item: SupplierItem) {
		setEditItem(item)
		setOpen(true)
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col sm:flex-row gap-3 justify-between">
				<form onSubmit={handleSearch} className="relative flex-1 max-w-md">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Cari nama supplier..."
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
						<Button onClick={handleOpenCreate}>
							<Plus className="h-4 w-4 mr-1" />
							Tambah Supplier
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>{editItem ? "Edit Supplier" : "Tambah Supplier"}</DialogTitle>
						</DialogHeader>
						<FormSupplier
							defaultValues={
								editItem
									? { nama: editItem.nama, telepon: editItem.telepon, alamat: editItem.alamat }
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
								Nama
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								Telepon
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								Alamat
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-center">
								Transaksi
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-right">
								Aksi
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data.length === 0 ? (
							<TableRow>
								<TableCell colSpan={6}>
									<EmptyState message="Belum ada supplier" />
								</TableCell>
							</TableRow>
						) : (
							data.map((item, index) => (
								<TableRow key={item.id} className="hover:bg-surface-raised">
									<TableCell className="text-sm">{index + 1}</TableCell>
									<TableCell className="text-sm font-medium">{item.nama}</TableCell>
									<TableCell className="text-sm text-muted-foreground">{item.telepon}</TableCell>
									<TableCell className="text-sm text-muted-foreground">{item.alamat}</TableCell>
									<TableCell className="text-sm text-center">{item._count.barangMasuk}</TableCell>
									<TableCell className="text-right">
										<div className="flex items-center justify-end gap-1">
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8"
												onClick={() => handleOpenEdit(item)}
												aria-label={`Edit ${item.nama}`}
											>
												<Pencil className="h-4 w-4 text-muted-foreground" />
											</Button>
											<HapusSupplierButton id={item.id} nama={item.nama} />
										</div>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</DataTable>
		</div>
	)
}

function HapusSupplierButton({ id, nama }: { id: string; nama: string }) {
	const [isPending, startTransition] = useTransition()

	function handleDelete() {
		if (!confirm(`Hapus supplier "${nama}"?`)) return

		startTransition(async () => {
			const result = await hapusSupplier(id)
			if (result.success) {
				toast.success("Supplier berhasil dihapus")
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
			onClick={handleDelete}
			aria-label={`Hapus ${nama}`}
		>
			<Trash2 className="h-4 w-4 text-muted-foreground hover:text-danger" />
		</Button>
	)
}
