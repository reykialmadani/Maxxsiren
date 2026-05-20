"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { tambahPengguna, updatePengguna } from "@/features/pengguna/actions/pengguna.actions"
import {
	type TambahPenggunaInput,
	tambahPenggunaSchema,
	type UpdatePenggunaInput,
	updatePenggunaSchema,
} from "@/lib/validations/pengguna.schema"

type FormTambahProps = {
	mode: "tambah"
	onSuccess: () => void
}

type FormEditProps = {
	mode: "edit"
	supabaseId: string
	defaultValues: UpdatePenggunaInput
	onSuccess: () => void
}

type FormPenggunaProps = FormTambahProps | FormEditProps

export function FormPengguna(props: FormPenggunaProps) {
	if (props.mode === "tambah") {
		return <FormTambah onSuccess={props.onSuccess} />
	}
	return (
		<FormEdit
			supabaseId={props.supabaseId}
			defaultValues={props.defaultValues}
			onSuccess={props.onSuccess}
		/>
	)
}

function FormTambah({ onSuccess }: { onSuccess: () => void }) {
	const [isPending, startTransition] = useTransition()
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm<TambahPenggunaInput>({
		resolver: zodResolver(tambahPenggunaSchema),
		defaultValues: { role: "STAF" },
	})

	const role = watch("role")

	function onSubmit(data: TambahPenggunaInput) {
		startTransition(async () => {
			const result = await tambahPengguna(data)
			if (result.success) {
				toast.success("Pengguna berhasil ditambahkan")
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
					Nama
				</Label>
				<Input id="nama" placeholder="Nama lengkap" {...register("nama")} />
				{errors.nama && <p className="text-xs text-danger mt-1">{errors.nama.message}</p>}
			</div>

			<div className="flex flex-col gap-1.5">
				<Label htmlFor="email" className="text-sm font-medium">
					Email
				</Label>
				<Input id="email" type="email" placeholder="email@maxxsiren.com" {...register("email")} />
				{errors.email && <p className="text-xs text-danger mt-1">{errors.email.message}</p>}
			</div>

			<div className="flex flex-col gap-1.5">
				<Label htmlFor="password" className="text-sm font-medium">
					Password
				</Label>
				<Input
					id="password"
					type="password"
					placeholder="Minimal 6 karakter"
					{...register("password")}
				/>
				{errors.password && <p className="text-xs text-danger mt-1">{errors.password.message}</p>}
			</div>

			<div className="flex flex-col gap-1.5">
				<Label className="text-sm font-medium">Role</Label>
				<Select
					value={role}
					onValueChange={(v) => setValue("role", v as "MANAJER" | "STAF", { shouldValidate: true })}
				>
					<SelectTrigger>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="STAF">Staf</SelectItem>
						<SelectItem value="MANAJER">Manajer</SelectItem>
					</SelectContent>
				</Select>
				{errors.role && <p className="text-xs text-danger mt-1">{errors.role.message}</p>}
			</div>

			<Button type="submit" disabled={isPending} className="w-full">
				{isPending ? "Menyimpan..." : "Tambah Pengguna"}
			</Button>
		</form>
	)
}

function FormEdit({
	supabaseId,
	defaultValues,
	onSuccess,
}: {
	supabaseId: string
	defaultValues: UpdatePenggunaInput
	onSuccess: () => void
}) {
	const [isPending, startTransition] = useTransition()
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm<UpdatePenggunaInput>({
		resolver: zodResolver(updatePenggunaSchema),
		defaultValues,
	})

	const role = watch("role")

	function onSubmit(data: UpdatePenggunaInput) {
		startTransition(async () => {
			const result = await updatePengguna(supabaseId, data)
			if (result.success) {
				toast.success("Pengguna berhasil diperbarui")
				onSuccess()
			} else {
				toast.error(result.error)
			}
		})
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
			<div className="flex flex-col gap-1.5">
				<Label htmlFor="nama-edit" className="text-sm font-medium">
					Nama
				</Label>
				<Input id="nama-edit" placeholder="Nama lengkap" {...register("nama")} />
				{errors.nama && <p className="text-xs text-danger mt-1">{errors.nama.message}</p>}
			</div>

			<div className="flex flex-col gap-1.5">
				<Label className="text-sm font-medium">Role</Label>
				<Select
					value={role}
					onValueChange={(v) => setValue("role", v as "MANAJER" | "STAF", { shouldValidate: true })}
				>
					<SelectTrigger>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="STAF">Staf</SelectItem>
						<SelectItem value="MANAJER">Manajer</SelectItem>
					</SelectContent>
				</Select>
				{errors.role && <p className="text-xs text-danger mt-1">{errors.role.message}</p>}
			</div>

			<Button type="submit" disabled={isPending} className="w-full">
				{isPending ? "Menyimpan..." : "Simpan Perubahan"}
			</Button>
		</form>
	)
}
