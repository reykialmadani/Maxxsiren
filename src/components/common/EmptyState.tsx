import { PackageOpen } from "lucide-react"

type EmptyStateProps = {
	message?: string
	description?: string
}

export function EmptyState({
	message = "Tidak ada data",
	description = "Coba ubah filter atau tambahkan data baru",
}: EmptyStateProps) {
	return (
		<div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
			<PackageOpen size={40} className="mb-3 opacity-40" />
			<p className="text-sm font-medium">{message}</p>
			<p className="text-xs mt-1">{description}</p>
		</div>
	)
}
