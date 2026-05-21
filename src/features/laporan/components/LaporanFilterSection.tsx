"use client"

import { Download, FileSpreadsheet, FileText, Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type LaporanFilterSectionProps = {
	tipe: "masuk" | "keluar"
	canExport: boolean
	dateFrom: string
	dateTo: string
	hasData: boolean
}

function getPresetDates(preset: string): { dateFrom: string; dateTo: string } {
	const today = new Date()
	const formatDate = (d: Date) => d.toISOString().slice(0, 10)

	switch (preset) {
		case "7-hari": {
			const from = new Date(today)
			from.setDate(from.getDate() - 6)
			return { dateFrom: formatDate(from), dateTo: formatDate(today) }
		}
		case "bulan-ini": {
			const from = new Date(today.getFullYear(), today.getMonth(), 1)
			return { dateFrom: formatDate(from), dateTo: formatDate(today) }
		}
		case "bulan-lalu": {
			const from = new Date(today.getFullYear(), today.getMonth() - 1, 1)
			const to = new Date(today.getFullYear(), today.getMonth(), 0)
			return { dateFrom: formatDate(from), dateTo: formatDate(to) }
		}
		default: {
			const from = new Date(today)
			from.setDate(from.getDate() - 29)
			return { dateFrom: formatDate(from), dateTo: formatDate(today) }
		}
	}
}

export function LaporanFilterSection({
	tipe,
	canExport,
	dateFrom,
	dateTo,
	hasData,
}: LaporanFilterSectionProps) {
	const router = useRouter()
	const searchParams = useSearchParams()
	const [localFrom, setLocalFrom] = useState(dateFrom)
	const [localTo, setLocalTo] = useState(dateTo)
	const [isPending, startTransition] = useTransition()
	const [pendingFormat, setPendingFormat] = useState<"pdf" | "excel" | null>(null)

	function navigateWithDates(from: string, to: string) {
		const params = new URLSearchParams(searchParams.toString())
		params.set("dateFrom", from)
		params.set("dateTo", to)
		params.set("page", "1")
		router.push(`/dashboard/laporan-${tipe}?${params.toString()}`)
	}

	function handlePreset(preset: string) {
		const { dateFrom: from, dateTo: to } = getPresetDates(preset)
		setLocalFrom(from)
		setLocalTo(to)
		navigateWithDates(from, to)
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		if (!localFrom || !localTo) {
			toast.error("Tanggal mulai dan akhir wajib diisi")
			return
		}
		if (new Date(localFrom) > new Date(localTo)) {
			toast.error("Tanggal mulai tidak boleh lebih dari tanggal akhir")
			return
		}
		navigateWithDates(localFrom, localTo)
	}

	function handleDownload(format: "pdf" | "excel") {
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
		<div className="bg-surface rounded-lg border border-border shadow-card p-6 flex flex-col gap-5">
			<div>
				<h2 className="text-base font-semibold text-foreground">Filter Periode</h2>
				<p className="text-sm text-muted-foreground mt-0.5">
					Pilih rentang tanggal atau gunakan preset cepat
				</p>
			</div>

			<div className="flex flex-wrap gap-2">
				{[
					{ key: "7-hari", label: "7 Hari Terakhir" },
					{ key: "bulan-ini", label: "Bulan Ini" },
					{ key: "bulan-lalu", label: "Bulan Lalu" },
					{ key: "30-hari", label: "30 Hari Terakhir" },
				].map((preset) => (
					<Button
						key={preset.key}
						variant="outline"
						size="sm"
						onClick={() => handlePreset(preset.key)}
					>
						{preset.label}
					</Button>
				))}
			</div>

			<form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-end">
				<div className="flex flex-col gap-1.5 flex-1">
					<Label htmlFor="dateFrom" className="text-sm font-medium">
						Tanggal Mulai
					</Label>
					<Input
						id="dateFrom"
						type="date"
						value={localFrom}
						onChange={(e) => setLocalFrom(e.target.value)}
					/>
				</div>
				<div className="flex flex-col gap-1.5 flex-1">
					<Label htmlFor="dateTo" className="text-sm font-medium">
						Tanggal Akhir
					</Label>
					<Input
						id="dateTo"
						type="date"
						value={localTo}
						onChange={(e) => setLocalTo(e.target.value)}
					/>
				</div>
				<Button type="submit" variant="secondary" className="shrink-0">
					<Search className="h-4 w-4 mr-1" />
					Tampilkan Data
				</Button>
			</form>

			{canExport && (
				<div className="flex flex-wrap gap-3 pt-2 border-t border-border-subtle">
					<Button
						variant="outline"
						size="sm"
						disabled={isPending || !hasData}
						onClick={() => handleDownload("pdf")}
					>
						{isPending && pendingFormat === "pdf" ? (
							<Download className="h-4 w-4 mr-2 animate-bounce" />
						) : (
							<FileText className="h-4 w-4 mr-2" />
						)}
						Unduh PDF
					</Button>
					<Button
						variant="outline"
						size="sm"
						disabled={isPending || !hasData}
						onClick={() => handleDownload("excel")}
					>
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
