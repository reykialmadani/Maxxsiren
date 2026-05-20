"use client"

import { Pencil, Plus, UserCheck, UserX } from "lucide-react"
import { useState, useTransition } from "react"
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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { aktifkanPengguna, nonaktifkanPengguna } from "@/features/pengguna/actions/pengguna.actions"
import type { PenggunaListItem } from "@/features/pengguna/queries/pengguna.queries"
import { formatWaktu } from "@/lib/utils"
import { FormPengguna } from "./FormPengguna"

type TabelPenggunaProps = {
	data: PenggunaListItem[]
	currentSupabaseId: string
}

export function TabelPengguna({ data, currentSupabaseId }: TabelPenggunaProps) {
	const [open, setOpen] = useState(false)
	const [editItem, setEditItem] = useState<PenggunaListItem | null>(null)

	function handleOpenCreate() {
		setEditItem(null)
		setOpen(true)
	}

	function handleOpenEdit(item: PenggunaListItem) {
		setEditItem(item)
		setOpen(true)
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex justify-end">
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogTrigger asChild>
						<Button onClick={handleOpenCreate}>
							<Plus className="h-4 w-4 mr-1" />
							Tambah Pengguna
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>{editItem ? "Edit Pengguna" : "Tambah Pengguna"}</DialogTitle>
						</DialogHeader>
						{editItem ? (
							<FormPengguna
								mode="edit"
								supabaseId={editItem.supabaseId}
								defaultValues={{ nama: editItem.nama, role: editItem.role }}
								onSuccess={() => setOpen(false)}
							/>
						) : (
							<FormPengguna mode="tambah" onSuccess={() => setOpen(false)} />
						)}
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
								Email
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								Role
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								Status
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								Terdaftar
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-right">
								Aksi
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data.length === 0 ? (
							<TableRow>
								<TableCell colSpan={7}>
									<EmptyState message="Belum ada pengguna" />
								</TableCell>
							</TableRow>
						) : (
							data.map((item, index) => (
								<TableRow key={item.id} className="hover:bg-surface-raised">
									<TableCell className="text-sm">{index + 1}</TableCell>
									<TableCell className="text-sm font-medium">{item.nama}</TableCell>
									<TableCell className="text-sm text-muted-foreground">{item.email}</TableCell>
									<TableCell>
										<span
											className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${
												item.role === "MANAJER"
													? "bg-primary-subtle text-primary border-primary/20"
													: "bg-muted text-muted-foreground border-border"
											}`}
										>
											{item.role === "MANAJER" ? "Manajer" : "Staf"}
										</span>
									</TableCell>
									<TableCell>
										<span
											className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${
												item.isActive
													? "bg-success-subtle text-success border-success/20"
													: "bg-muted text-muted-foreground border-border"
											}`}
										>
											{item.isActive ? "Aktif" : "Nonaktif"}
										</span>
									</TableCell>
									<TableCell className="text-sm text-muted-foreground">
										{formatWaktu(item.createdAt)}
									</TableCell>
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
											{item.supabaseId !== currentSupabaseId && <ToggleAktifButton item={item} />}
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

function ToggleAktifButton({ item }: { item: PenggunaListItem }) {
	const [isPending, startTransition] = useTransition()

	function handleToggle() {
		const action = item.isActive ? "nonaktifkan" : "aktifkan"
		if (
			!confirm(`${action === "nonaktifkan" ? "Nonaktifkan" : "Aktifkan"} pengguna "${item.nama}"?`)
		)
			return

		startTransition(async () => {
			const result = item.isActive
				? await nonaktifkanPengguna(item.supabaseId)
				: await aktifkanPengguna(item.supabaseId)

			if (result.success) {
				toast.success(
					item.isActive ? "Pengguna berhasil dinonaktifkan" : "Pengguna berhasil diaktifkan",
				)
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
			onClick={handleToggle}
			aria-label={item.isActive ? `Nonaktifkan ${item.nama}` : `Aktifkan ${item.nama}`}
		>
			{item.isActive ? (
				<UserX className="h-4 w-4 text-muted-foreground hover:text-danger" />
			) : (
				<UserCheck className="h-4 w-4 text-muted-foreground hover:text-success" />
			)}
		</Button>
	)
}
