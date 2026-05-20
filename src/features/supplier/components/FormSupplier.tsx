"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { tambahSupplier, updateSupplier } from "@/features/supplier/actions/supplier.actions"
import { type SupplierInput, supplierSchema } from "@/lib/validations/supplier.schema"

type FormSupplierProps = {
	defaultValues?: SupplierInput
	editId?: string
	onSuccess: () => void
}

export function FormSupplier({ defaultValues, editId, onSuccess }: FormSupplierProps) {
	const [isPending, startTransition] = useTransition()
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SupplierInput>({
		resolver: zodResolver(supplierSchema),
		defaultValues: defaultValues ?? { nama: "", telepon: "", alamat: "" },
	})

	function onSubmit(data: SupplierInput) {
		startTransition(async () => {
			const result = editId ? await updateSupplier(editId, data) : await tambahSupplier(data)

			if (result.success) {
				toast.success(editId ? "Supplier berhasil diperbarui" : "Supplier berhasil ditambahkan")
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
					Nama Supplier
				</Label>
				<Input id="nama" placeholder="Nama perusahaan/toko" {...register("nama")} />
				{errors.nama && <p className="text-xs text-danger mt-1">{errors.nama.message}</p>}
			</div>

			<div className="flex flex-col gap-1.5">
				<Label htmlFor="telepon" className="text-sm font-medium">
					Nomor Telepon
				</Label>
				<Input id="telepon" placeholder="021-1234567" {...register("telepon")} />
				{errors.telepon && <p className="text-xs text-danger mt-1">{errors.telepon.message}</p>}
			</div>

			<div className="flex flex-col gap-1.5">
				<Label htmlFor="alamat" className="text-sm font-medium">
					Alamat
				</Label>
				<Input id="alamat" placeholder="Alamat lengkap supplier" {...register("alamat")} />
				{errors.alamat && <p className="text-xs text-danger mt-1">{errors.alamat.message}</p>}
			</div>

			<Button type="submit" disabled={isPending} className="w-full">
				{isPending ? "Menyimpan..." : "Simpan"}
			</Button>
		</form>
	)
}
