"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { PAGE_SIZE_OPTIONS } from "@/lib/constants"

type PaginationProps = {
	page: number
	totalPages: number
	pageSize: number
	total: number
	onPageChange: (page: number) => void
	onPageSizeChange: (pageSize: number) => void
}

export function Pagination({
	page,
	totalPages,
	pageSize,
	total,
	onPageChange,
	onPageSizeChange,
}: PaginationProps) {
	const startItem = total === 0 ? 0 : (page - 1) * pageSize + 1
	const endItem = Math.min(page * pageSize, total)

	return (
		<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-3 bg-surface-raised border-t border-border">
			<p className="text-xs text-muted-foreground">
				Menampilkan <span className="font-medium text-foreground">{startItem}</span>-
				<span className="font-medium text-foreground">{endItem}</span> dari{" "}
				<span className="font-medium text-foreground">{total}</span> data
			</p>

			<div className="flex items-center gap-3">
				<div className="flex items-center gap-2">
					<span className="text-xs text-muted-foreground">Per halaman</span>
					<Select
						value={String(pageSize)}
						onValueChange={(value) => onPageSizeChange(Number(value))}
					>
						<SelectTrigger className="h-8 w-[70px] text-xs">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{PAGE_SIZE_OPTIONS.map((size) => (
								<SelectItem key={size} value={String(size)}>
									{size}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="flex items-center gap-1">
					<Button
						variant="outline"
						size="sm"
						className="h-8 w-8 p-0"
						disabled={page <= 1}
						onClick={() => onPageChange(page - 1)}
						aria-label="Halaman sebelumnya"
					>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<span className="text-xs text-muted-foreground px-2">
						Halaman {page} dari {totalPages || 1}
					</span>
					<Button
						variant="outline"
						size="sm"
						className="h-8 w-8 p-0"
						disabled={page >= totalPages}
						onClick={() => onPageChange(page + 1)}
						aria-label="Halaman berikutnya"
					>
						<ChevronRight className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	)
}
