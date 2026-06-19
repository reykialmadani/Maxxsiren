"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRef, useState, useTransition } from "react"
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
import { SATUAN_OPTIONS } from "@/lib/constants"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
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
	const [isUploading, setIsUploading] = useState(false)
	const [previewUrl, setPreviewUrl] = useState<string>(defaultValues?.gambarUrl ?? "")
	const fileInputRef = useRef<HTMLInputElement>(null)

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
			satuan: defaultValues?.satuan ?? undefined,
			minStok: defaultValues?.minStok ?? 0,
			gambarUrl: defaultValues?.gambarUrl ?? "",
		},
	})

	const kategoriId = watch("kategoriId")
	const satuan = watch("satuan")

	async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0]
		if (!file) return

		setIsUploading(true)
		try {
			const supabase = createSupabaseBrowserClient()
			const ext = file.name.split(".").pop()
			const filename = `items/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

			const { error } = await supabase.storage.from("barang-images").upload(filename, file, {
				cacheControl: "3600",
				upsert: false,
			})
			if (error) throw error

			const { data: urlData } = supabase.storage.from("barang-images").getPublicUrl(filename)
			setValue("gambarUrl", urlData.publicUrl, { shouldValidate: true })
			setPreviewUrl(urlData.publicUrl)
		} catch (err) {
			const msg = err instanceof Error ? err.message : JSON.stringify(err)
			toast.error(`Gagal mengunggah gambar: ${msg}`)
			console.error("[upload-error]", err)
			if (fileInputRef.current) fileInputRef.current.value = ""
		} finally {
			setIsUploading(false)
		}
	}

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
					<Select
						value={satuan ?? ""}
						onValueChange={(value) =>
							setValue("satuan", value as BarangInput["satuan"], { shouldValidate: true })
						}
					>
						<SelectTrigger id="satuan">
							<SelectValue placeholder="Pilih satuan" />
						</SelectTrigger>
						<SelectContent>
							{SATUAN_OPTIONS.map((s) => (
								<SelectItem key={s} value={s}>
									{s}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
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

			<div className="flex flex-col gap-1.5">
				<Label htmlFor="gambarFile" className="text-sm font-medium">
					Gambar Barang <span className="text-muted-foreground">(opsional)</span>
				</Label>
				<div className="flex items-center gap-3">
					{previewUrl && (
						<img
							src={previewUrl}
							alt="Preview"
							className="w-12 h-12 object-cover rounded border border-border shrink-0"
						/>
					)}
					<div className="flex-1">
						<input
							ref={fileInputRef}
							id="gambarFile"
							type="file"
							accept="image/*"
							disabled={isUploading}
							onChange={handleImageUpload}
							className="block w-full text-sm text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
						/>
						{isUploading && (
							<p className="text-xs text-muted-foreground mt-1">Mengunggah gambar...</p>
						)}
					</div>
				</div>
				{/* hidden field keeps the uploaded URL in the form state */}
				<input type="hidden" {...register("gambarUrl")} />
				{errors.gambarUrl && <p className="text-xs text-danger mt-1">{errors.gambarUrl.message}</p>}
			</div>

			<Button type="submit" disabled={isPending || isUploading} className="w-full">
				{isPending ? "Menyimpan..." : "Simpan"}
			</Button>
		</form>
	)
}
