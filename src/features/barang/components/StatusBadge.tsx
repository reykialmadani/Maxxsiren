import { cn } from "@/lib/utils"

type StatusBadgeProps = {
	stok: number
	minStok: number
}

export function StatusBadge({ stok, minStok }: StatusBadgeProps) {
	if (stok === 0) {
		return (
			<span
				className={cn(
					"inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border",
					"bg-danger-subtle text-danger border-danger/20",
				)}
			>
				Habis
			</span>
		)
	}

	if (stok <= minStok) {
		return (
			<span
				className={cn(
					"inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border",
					"bg-warning-subtle text-warning border-warning/20",
				)}
			>
				Menipis
			</span>
		)
	}

	return (
		<span
			className={cn(
				"inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border",
				"bg-success-subtle text-success border-success/20",
			)}
		>
			Tersedia
		</span>
	)
}
