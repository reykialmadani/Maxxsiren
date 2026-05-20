"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle } from "lucide-react"
import { useState, useTransition } from "react"
import { Controller, useForm } from "react-hook-form"
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
import { tambahRetur } from "@/features/retur/actions/retur.actions"
import { type ReturInput, returSchema } from "@/lib/validations/retur.schema"

type BarangOption = { id: string; kode: string; namaBarang: string; stok: number }
type SupplierOption = { id: string; nama: string }

type FormReturProps = {
	barangList: BarangOption[]
	supplierList: SupplierOption[]
	onSuccess: () => void
}

export function FormRetur({ barangList, supplierList, onSuccess }: FormReturProps) {
	const [isPending, startTransition] = useTransition()
	const [tipe, setTipe] = useState<"MASUK" | "KELUAR">("MASUK")

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		reset,
		control,
		formState: { errors },
	} = useForm<ReturInput>({
		resolver: zodResolver(returSchema),
		defaultValues: {
			tipe: "MASUK",
			barangId: "",
			jumlah: undefined,
			keterangan: "",
			namaPenerima: "",
		},
	})

	const barangId = watch("barangId")
	const selectedBarang = barangList.find((b) => b.id === barangId)

	function handleTipeChange(newTipe: "MASUK" | "KELUAR") {
		setTipe(newTipe)
		reset({
			tipe: newTipe,
			barangId: "",
			jumlah: undefined,
			keterangan: "",
			...(newTipe === "MASUK" ? { namaPenerima: "" } : { supplierId: "" }),
		} as unknown as ReturInput)
	}

	function onSubmit(data: ReturInput) {
		startTransition(async () => {
			const result = await tambahRetur(data)
			if (result.success) {
				toast.success("Retur berhasil dicatat")
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
					Pastikan tipe retur sudah benar. Retur Masuk menambah stok, Retur Keluar mengurangi stok.
				</span>
			</div>

			<div className="flex flex-col gap-1.5">
				<Label className="text-sm font-medium">Tipe Retur</Label>
				<div className="grid grid-cols-2 gap-2">
					<button
						type="button"
						onClick={() => handleTipeChange("MASUK")}
						className={`px-4 py-3 rounded-md border text-sm font-medium transition-colors ${
							tipe === "MASUK"
								? "bg-success-subtle border-success text-success"
								: "bg-surface border-border text-foreground hover:bg-surface-raised"
						}`}
					>
						Retur MASUK
						<br />
						<span className="text-xs font-normal opacity-80">Dari customer (stok +)</span>
					</button>
					<button
						type="button"
						onClick={() => handleTipeChange("KELUAR")}
						className={`px-4 py-3 rounded-md border text-sm font-medium transition-colors ${
							tipe === "KELUAR"
								? "bg-danger-subtle border-danger text-danger"
								: "bg-surface border-border text-foreground hover:bg-surface-raised"
						}`}
					>
						Retur KELUAR
						<br />
						<span className="text-xs font-normal opacity-80">Ke supplier (stok −)</span>
					</button>
				</div>
			</div>

			{tipe === "MASUK" ? (
				<div className="flex flex-col gap-1.5">
					<Label htmlFor="namaPenerima" className="text-sm font-medium">
						Nama Customer/Pengirim
					</Label>
					<Input
						id="namaPenerima"
						placeholder="Nama yang mengembalikan barang"
						{...register("namaPenerima")}
					/>
					{"namaPenerima" in errors && errors.namaPenerima && (
						<p className="text-xs text-danger mt-1">{errors.namaPenerima.message}</p>
					)}
				</div>
			) : (
				<div className="flex flex-col gap-1.5">
					<Label className="text-sm font-medium">Supplier Tujuan</Label>
					<Controller
						control={control}
						name="supplierId"
						render={({ field }) => (
							<Select value={field.value ?? ""} onValueChange={field.onChange}>
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
						)}
					/>
					{"supplierId" in errors && errors.supplierId && (
						<p className="text-xs text-danger mt-1">{errors.supplierId.message}</p>
					)}
				</div>
			)}

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
				{tipe === "KELUAR" && selectedBarang && (
					<p className="text-xs text-muted-foreground">
						Stok tersedia: <span className="font-medium">{selectedBarang.stok}</span>
					</p>
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
						max={tipe === "KELUAR" ? selectedBarang?.stok : undefined}
						placeholder="0"
						{...register("jumlah", { valueAsNumber: true })}
					/>
					{errors.jumlah && <p className="text-xs text-danger mt-1">{errors.jumlah.message}</p>}
				</div>

				<div className="flex flex-col gap-1.5">
					<Label htmlFor="tanggalRetur" className="text-sm font-medium">
						Tanggal Retur
					</Label>
					<Input id="tanggalRetur" type="date" {...register("tanggalRetur")} />
					{errors.tanggalRetur && (
						<p className="text-xs text-danger mt-1">{errors.tanggalRetur.message}</p>
					)}
				</div>
			</div>

			<div className="flex flex-col gap-1.5">
				<Label htmlFor="keterangan" className="text-sm font-medium">
					Keterangan <span className="text-muted-foreground">(opsional)</span>
				</Label>
				<Input id="keterangan" placeholder="Alasan retur, dll" {...register("keterangan")} />
			</div>

			<Button type="submit" disabled={isPending} className="w-full">
				{isPending ? "Menyimpan..." : "Simpan Retur"}
			</Button>
		</form>
	)
}
