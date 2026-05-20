"use client"

import { Download, FileSpreadsheet, FileText } from "lucide-react"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type FormFilterLaporanProps = {
	tipe: "masuk" | "keluar"
	canExport: boolean
}

export function FormFilterLaporan({ tipe, canExport }: FormFilterLaporanProps) {
	const [dateFrom, setDateFrom] = useState("")
	const [dateTo, setDateTo] = useState("")
	const [isPending, startTransition] = useTransition()
	const [pendingFormat, setPendingFormat] = useState<"pdf" | "excel" | null>(null)

	function handleDownload(format: "pdf" | "excel") {
		if (!dateFrom || !dateTo) {
			toast.error("Tanggal mulai dan akhir wajib diisi")
			return
		}
		if (new Date(dateFrom) > new Date(dateTo)) {
			toast.error("Tanggal mulai tidak boleh lebih dari tanggal akhir")
			return
		}

		setPendingFormat(format)
		startTransition(async () => {
			try {
				const params = new URLSearchParams({ format, dateFrom, dateTo })
				const res = await fetch(`/api/laporan-${tipe}?${params.toString()}`)
				if (!res.ok) {
					const err = await res.json()
					toast.error(err.error ?? "Gagal mengunduh laporan")
					return
				}

				const blob = await res.blob()
				const url = URL.createObjectURL(blob)
				const a = document.createElement("a")
				a.href = url
				const ext = format === "pdf" ? "pdf" : "xlsx"
				const tanggal = new Date().toISOString().slice(0, 10)
				a.download = `laporan-${tipe}-${tanggal}.${ext}`
				a.click()
				URL.revokeObjectURL(url)
				toast.success("Laporan berhasil diunduh")
			} catch {
				toast.error("Terjadi kesalahan saat mengunduh laporan")
			} finally {
				setPendingFormat(null)
			}
		})
	}

	return (
		<div className="bg-surface rounded-lg border border-border shadow-card p-6 flex flex-col gap-6">
			<div>
				<h2 className="text-lg font-semibold text-foreground">Filter Periode</h2>
				<p className="text-sm text-muted-foreground mt-0.5">
					Pilih rentang tanggal untuk melihat data laporan
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="flex flex-col gap-1.5">
					<Label htmlFor="dateFrom" className="text-sm font-medium">
						Tanggal Mulai
					</Label>
					<Input
						id="dateFrom"
						type="date"
						value={dateFrom}
						onChange={(e) => setDateFrom(e.target.value)}
					/>
				</div>
				<div className="flex flex-col gap-1.5">
					<Label htmlFor="dateTo" className="text-sm font-medium">
						Tanggal Akhir
					</Label>
					<Input
						id="dateTo"
						type="date"
						value={dateTo}
						onChange={(e) => setDateTo(e.target.value)}
					/>
				</div>
			</div>

			{canExport && (
				<div className="flex flex-wrap gap-3">
					<Button variant="outline" disabled={isPending} onClick={() => handleDownload("pdf")}>
						{isPending && pendingFormat === "pdf" ? (
							<Download className="h-4 w-4 mr-2 animate-bounce" />
						) : (
							<FileText className="h-4 w-4 mr-2" />
						)}
						Unduh PDF
					</Button>
					<Button variant="outline" disabled={isPending} onClick={() => handleDownload("excel")}>
						{isPending && pendingFormat === "excel" ? (
							<Download className="h-4 w-4 mr-2 animate-bounce" />
						) : (
							<FileSpreadsheet className="h-4 w-4 mr-2" />
						)}
						Unduh Excel
					</Button>
				</div>
			)}
		</div>
	)
}
