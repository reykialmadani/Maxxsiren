"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle } from "lucide-react"
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
import { tambahBarangMasuk } from "@/features/barang-masuk/actions/barang-masuk.actions"
import { type BarangMasukInput, barangMasukSchema } from "@/lib/validations/barang-masuk.schema"

type BarangOption = { id: string; kode: string; namaBarang: string; stok: number }
type SupplierOption = { id: string; nama: string }

type FormBarangMasukProps = {
	barangList: BarangOption[]
	supplierList: SupplierOption[]
	onSuccess: () => void
}

export function FormBarangMasuk({ barangList, supplierList, onSuccess }: FormBarangMasukProps) {
	const [isPending, startTransition] = useTransition()
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm<BarangMasukInput>({
		resolver: zodResolver(barangMasukSchema),
		defaultValues: { barangId: "", supplierId: "", jumlah: undefined, keterangan: "" },
	})

	const barangId = watch("barangId")
	const supplierId = watch("supplierId")

	function onSubmit(data: BarangMasukInput) {
		startTransition(async () => {
			const result = await tambahBarangMasuk(data)
			if (result.success) {
				toast.success("Barang masuk berhasil dicatat")
				onSuccess()
			} else {
				toast.error(result.error)
			}
		})
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
			<div className="rounded-md border border-warning/30 bg-warning-subtle px-4 py-3 text-sm text-warning flex gap-2 items-start">
				<AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
				<span>
					Pastikan data sudah benar sebelum menyimpan. Transaksi tidak dapat diubah setelah
					disimpan.
				</span>
			</div>

			<div className="flex flex-col gap-1.5">
				<Label className="text-sm font-medium">Supplier</Label>
				<Select
					value={supplierId}
					onValueChange={(v) => setValue("supplierId", v, { shouldValidate: true })}
				>
					<SelectTrigger>
						<SelectValue placeholder="Pilih supplier" />
					</SelectTrigger>
					<SelectContent>
						{supplierList.map((s) => (
							<SelectItem key={s.id} value={s.id}>
								{s.nama}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{errors.supplierId && (
					<p className="text-xs text-danger mt-1">{errors.supplierId.message}</p>
				)}
			</div>

			<div className="flex flex-col gap-1.5">
				<Label className="text-sm font-medium">Barang</Label>
				<Select
					value={barangId}
					onValueChange={(v) => setValue("barangId", v, { shouldValidate: true })}
				>
					<SelectTrigger>
						<SelectValue placeholder="Pilih barang" />
					</SelectTrigger>
					<SelectContent>
						{barangList.map((b) => (
							<SelectItem key={b.id} value={b.id}>
								{b.kode} — {b.namaBarang} (stok: {b.stok})
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{errors.barangId && <p className="text-xs text-danger mt-1">{errors.barangId.message}</p>}
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div className="flex flex-col gap-1.5">
					<Label htmlFor="jumlah" className="text-sm font-medium">
						Jumlah
					</Label>
					<Input
						id="jumlah"
						type="number"
						min={1}
						placeholder="0"
						{...register("jumlah", { valueAsNumber: true })}
					/>
					{errors.jumlah && <p className="text-xs text-danger mt-1">{errors.jumlah.message}</p>}
				</div>

				<div className="flex flex-col gap-1.5">
					<Label htmlFor="tanggalMasuk" className="text-sm font-medium">
						Tanggal Masuk
					</Label>
					<Input id="tanggalMasuk" type="date" {...register("tanggalMasuk")} />
					{errors.tanggalMasuk && (
						<p className="text-xs text-danger mt-1">{errors.tanggalMasuk.message}</p>
					)}
				</div>
			</div>

			<div className="flex flex-col gap-1.5">
				<Label htmlFor="keterangan" className="text-sm font-medium">
					Keterangan <span className="text-muted-foreground">(opsional)</span>
				</Label>
				<Input id="keterangan" placeholder="Keterangan tambahan" {...register("keterangan")} />
			</div>

			<Button type="submit" disabled={isPending} className="w-full">
				{isPending ? "Menyimpan..." : "Simpan Barang Masuk"}
			</Button>
		</form>
	)
}
