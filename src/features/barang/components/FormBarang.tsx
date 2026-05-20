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
import { tambahBarang, updateBarang } from "@/features/barang/actions/barang.actions"
import { type BarangInput, barangSchema } from "@/lib/validations/barang.schema"

type Kategori = { id: string; nama: string }

type FormBarangProps = {
	kategoriList: Kategori[]
	defaultValues?: Partial<BarangInput>
	editId?: string
	onSuccess: () => void
}

export function FormBarang({ kategoriList, defaultValues, editId, onSuccess }: FormBarangProps) {
	const [isPending, startTransition] = useTransition()
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm<BarangInput>({
		resolver: zodResolver(barangSchema),
		defaultValues: {
			kode: defaultValues?.kode ?? "",
			namaBarang: defaultValues?.namaBarang ?? "",
			kategoriId: defaultValues?.kategoriId ?? "",
			satuan: defaultValues?.satuan ?? "",
			minStok: defaultValues?.minStok ?? 0,
		},
	})

	const kategoriId = watch("kategoriId")

	function onSubmit(data: BarangInput) {
		startTransition(async () => {
			const result = editId ? await updateBarang(editId, data) : await tambahBarang(data)

			if (result.success) {
				toast.success(editId ? "Barang berhasil diperbarui" : "Barang berhasil ditambahkan")
				onSuccess()
			} else {
				toast.error(result.error)
			}
		})
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="flex flex-col gap-1.5">
					<Label htmlFor="kode" className="text-sm font-medium">
						Kode Barang
					</Label>
					<Input id="kode" placeholder="Contoh: SRN-001" {...register("kode")} />
					{errors.kode && <p className="text-xs text-danger mt-1">{errors.kode.message}</p>}
				</div>

				<div className="flex flex-col gap-1.5">
					<Label htmlFor="satuan" className="text-sm font-medium">
						Satuan
					</Label>
					<Input id="satuan" placeholder="Unit, Pcs, Roll" {...register("satuan")} />
					{errors.satuan && <p className="text-xs text-danger mt-1">{errors.satuan.message}</p>}
				</div>
			</div>

			<div className="flex flex-col gap-1.5">
				<Label htmlFor="namaBarang" className="text-sm font-medium">
					Nama Barang
				</Label>
				<Input id="namaBarang" placeholder="Masukkan nama barang" {...register("namaBarang")} />
				{errors.namaBarang && (
					<p className="text-xs text-danger mt-1">{errors.namaBarang.message}</p>
				)}
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="flex flex-col gap-1.5">
					<Label htmlFor="kategoriId" className="text-sm font-medium">
						Kategori
					</Label>
					<Select
						value={kategoriId}
						onValueChange={(value) => setValue("kategoriId", value, { shouldValidate: true })}
					>
						<SelectTrigger id="kategoriId">
							<SelectValue placeholder="Pilih kategori" />
						</SelectTrigger>
						<SelectContent>
							{kategoriList.map((k) => (
								<SelectItem key={k.id} value={k.id}>
									{k.nama}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{errors.kategoriId && (
						<p className="text-xs text-danger mt-1">{errors.kategoriId.message}</p>
					)}
				</div>

				<div className="flex flex-col gap-1.5">
					<Label htmlFor="minStok" className="text-sm font-medium">
						Minimum Stok
					</Label>
					<Input
						id="minStok"
						type="number"
						min={0}
						placeholder="0"
						{...register("minStok", { valueAsNumber: true })}
					/>
					{errors.minStok && <p className="text-xs text-danger mt-1">{errors.minStok.message}</p>}
				</div>
			</div>

			<Button type="submit" disabled={isPending} className="w-full">
				{isPending ? "Menyimpan..." : "Simpan"}
			</Button>
		</form>
	)
}
