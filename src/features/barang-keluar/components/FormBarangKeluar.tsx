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
import { tambahBarangKeluar } from "@/features/barang-keluar/actions/barang-keluar.actions"
import { type BarangKeluarInput, barangKeluarSchema } from "@/lib/validations/barang-keluar.schema"

type BarangOption = { id: string; kode: string; namaBarang: string; stok: number }

type FormBarangKeluarProps = {
	barangList: BarangOption[]
	onSuccess: () => void
}

export function FormBarangKeluar({ barangList, onSuccess }: FormBarangKeluarProps) {
	const [isPending, startTransition] = useTransition()
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm<BarangKeluarInput>({
		resolver: zodResolver(barangKeluarSchema),
		defaultValues: { barangId: "", namaPenerima: "", jumlah: undefined, keterangan: "" },
	})

	const barangId = watch("barangId")
	const selectedBarang = barangList.find((b) => b.id === barangId)

	function onSubmit(data: BarangKeluarInput) {
		startTransition(async () => {
			const result = await tambahBarangKeluar(data)
			if (result.success) {
				toast.success("Barang keluar berhasil dicatat")
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
				{selectedBarang && (
					<p className="text-xs text-muted-foreground">
						Stok tersedia: <span className="font-medium">{selectedBarang.stok}</span>
					</p>
				)}
			</div>

			<div className="flex flex-col gap-1.5">
				<Label htmlFor="namaPenerima" className="text-sm font-medium">
					Nama Penerima / Bagian
				</Label>
				<Input
					id="namaPenerima"
					placeholder="Nama penerima atau bagian tujuan"
					{...register("namaPenerima")}
				/>
				{errors.namaPenerima && (
					<p className="text-xs text-danger mt-1">{errors.namaPenerima.message}</p>
				)}
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
						max={selectedBarang?.stok}
						placeholder="0"
						{...register("jumlah", { valueAsNumber: true })}
					/>
					{errors.jumlah && <p className="text-xs text-danger mt-1">{errors.jumlah.message}</p>}
				</div>

				<div className="flex flex-col gap-1.5">
					<Label htmlFor="tanggalKeluar" className="text-sm font-medium">
						Tanggal Keluar
					</Label>
					<Input id="tanggalKeluar" type="date" {...register("tanggalKeluar")} />
					{errors.tanggalKeluar && (
						<p className="text-xs text-danger mt-1">{errors.tanggalKeluar.message}</p>
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
				{isPending ? "Menyimpan..." : "Simpan Barang Keluar"}
			</Button>
		</form>
	)
}
