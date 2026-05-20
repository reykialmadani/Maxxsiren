"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
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
import { Label } from "@/components/ui/label"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import {
	hapusKategori,
	tambahKategori,
	updateKategori,
} from "@/features/barang/actions/kategori.actions"
import { type KategoriInput, kategoriSchema } from "@/lib/validations/kategori.schema"

type KategoriWithCount = {
	id: string
	nama: string
	_count: { barang: number }
}

type KategoriSectionProps = {
	data: KategoriWithCount[]
}

export function KategoriSection({ data }: KategoriSectionProps) {
	const [open, setOpen] = useState(false)
	const [editItem, setEditItem] = useState<KategoriWithCount | null>(null)

	function handleOpenCreate() {
		setEditItem(null)
		setOpen(true)
	}

	function handleOpenEdit(item: KategoriWithCount) {
		setEditItem(item)
		setOpen(true)
	}

	return (
		<div>
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-lg font-semibold text-foreground">Kategori Barang</h2>
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogTrigger asChild>
						<Button size="sm" onClick={handleOpenCreate}>
							<Plus className="h-4 w-4 mr-1" />
							Tambah
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>{editItem ? "Edit Kategori" : "Tambah Kategori"}</DialogTitle>
						</DialogHeader>
						<KategoriForm
							defaultValues={editItem ? { nama: editItem.nama } : undefined}
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
							<TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-center">
								Jumlah Barang
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-right">
								Aksi
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data.length === 0 ? (
							<TableRow>
								<TableCell colSpan={4}>
									<EmptyState message="Belum ada kategori" />
								</TableCell>
							</TableRow>
						) : (
							data.map((item, index) => (
								<TableRow key={item.id} className="hover:bg-surface-raised">
									<TableCell className="text-sm">{index + 1}</TableCell>
									<TableCell className="text-sm font-medium">{item.nama}</TableCell>
									<TableCell className="text-sm text-center">{item._count.barang}</TableCell>
									<TableCell className="text-right">
										<div className="flex items-center justify-end gap-1">
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8"
												onClick={() => handleOpenEdit(item)}
												aria-label={`Edit kategori ${item.nama}`}
											>
												<Pencil className="h-4 w-4 text-muted-foreground" />
											</Button>
											<HapusKategoriButton id={item.id} nama={item.nama} />
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

function KategoriForm({
	defaultValues,
	editId,
	onSuccess,
}: {
	defaultValues?: KategoriInput
	editId?: string
	onSuccess: () => void
}) {
	const [isPending, startTransition] = useTransition()
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<KategoriInput>({
		resolver: zodResolver(kategoriSchema),
		defaultValues,
	})

	function onSubmit(data: KategoriInput) {
		startTransition(async () => {
			const result = editId ? await updateKategori(editId, data) : await tambahKategori(data)

			if (result.success) {
				toast.success(editId ? "Kategori berhasil diperbarui" : "Kategori berhasil ditambahkan")
				onSuccess()
			} else {
				toast.error(result.error)
			}
		})
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
			<div className="flex flex-col gap-1.5">
				<Label htmlFor="nama" className="text-sm font-medium">
					Nama Kategori
				</Label>
				<Input id="nama" placeholder="Masukkan nama kategori" {...register("nama")} />
				{errors.nama && <p className="text-xs text-danger mt-1">{errors.nama.message}</p>}
			</div>
			<Button type="submit" disabled={isPending} className="w-full">
				{isPending ? "Menyimpan..." : "Simpan"}
			</Button>
		</form>
	)
}

function HapusKategoriButton({ id, nama }: { id: string; nama: string }) {
	const [isPending, startTransition] = useTransition()

	function handleDelete() {
		if (!confirm(`Hapus kategori "${nama}"?`)) return

		startTransition(async () => {
			const result = await hapusKategori(id)
			if (result.success) {
				toast.success("Kategori berhasil dihapus")
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
			aria-label={`Hapus kategori ${nama}`}
		>
			<Trash2 className="h-4 w-4 text-muted-foreground hover:text-danger" />
		</Button>
	)
}
