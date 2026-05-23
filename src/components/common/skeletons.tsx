import { Skeleton } from "@/components/ui/skeleton"

export function PageHeaderSkeleton() {
	return (
		<div className="flex items-start gap-3">
			<Skeleton className="h-7 w-7 rounded mt-0.5" />
			<div className="flex flex-col gap-2">
				<Skeleton className="h-7 w-56" />
				<Skeleton className="h-4 w-72" />
			</div>
		</div>
	)
}

export function FilterBarSkeleton() {
	return (
		<div className="flex flex-col sm:flex-row gap-3 justify-between">
			<Skeleton className="h-10 w-full max-w-md" />
			<Skeleton className="h-10 w-32" />
		</div>
	)
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
	return (
		<div className="bg-surface rounded-lg border border-border overflow-hidden">
			<div className="px-4 py-3 bg-surface-raised">
				<Skeleton className="h-4 w-full" />
			</div>
			{Array.from({ length: rows }).map((_, i) => (
				<div key={`row-${String(i)}`} className="px-4 py-4 border-b border-border-subtle">
					<Skeleton className="h-4 w-full" />
				</div>
			))}
		</div>
	)
}

export function MetricCardsSkeleton({ count = 5 }: { count?: number }) {
	return (
		<div className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-${count} gap-4`}>
			{Array.from({ length: count }).map((_, i) => (
				<div
					key={`metric-${String(i)}`}
					className="bg-surface rounded-xl border border-border p-6 flex flex-col gap-2"
				>
					<Skeleton className="h-10 w-10 rounded-lg" />
					<Skeleton className="h-4 w-24 mt-4" />
					<Skeleton className="h-8 w-20 mt-1" />
				</div>
			))}
		</div>
	)
}

export function ChartSkeleton() {
	return (
		<div className="bg-surface rounded-lg border border-border p-6">
			<Skeleton className="h-5 w-48 mb-2" />
			<Skeleton className="h-4 w-64 mb-4" />
			<Skeleton className="h-56 w-full" />
		</div>
	)
}

export function DetailHeaderSkeleton() {
	return (
		<div className="bg-surface rounded-lg border border-border p-6 flex flex-col md:flex-row gap-6">
			<Skeleton className="w-40 h-40 rounded-lg shrink-0" />
			<div className="flex-1 flex flex-col gap-3">
				<Skeleton className="h-3 w-20" />
				<Skeleton className="h-7 w-64" />
				<Skeleton className="h-4 w-32" />
				<Skeleton className="h-4 w-48 mt-2" />
			</div>
			<Skeleton className="w-48 h-32 shrink-0" />
		</div>
	)
}

export function StatCardsSkeleton({ count = 5 }: { count?: number }) {
	return (
		<div className={`grid grid-cols-2 sm:grid-cols-${count} gap-4`}>
			{Array.from({ length: count }).map((_, i) => (
				<div
					key={`stat-${String(i)}`}
					className="bg-surface rounded-lg border border-border p-4 flex flex-col gap-2"
				>
					<Skeleton className="h-3 w-20" />
					<Skeleton className="h-7 w-16" />
				</div>
			))}
		</div>
	)
}

export function LaporanFilterSkeleton() {
	return (
		<div className="bg-surface rounded-lg border border-border p-6 flex flex-col gap-5">
			<div className="flex flex-col gap-2">
				<Skeleton className="h-5 w-32" />
				<Skeleton className="h-4 w-64" />
			</div>
			<div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
				{Array.from({ length: 4 }).map((_, i) => (
					<Skeleton key={`preset-${String(i)}`} className="h-8 w-32" />
				))}
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
				<Skeleton className="h-10 w-full" />
				<Skeleton className="h-10 w-full" />
			</div>
			<Skeleton className="h-10 w-full sm:w-40" />
		</div>
	)
}

export function SummaryCardsSkeleton({ count = 4 }: { count?: number }) {
	return (
		<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
			{Array.from({ length: count }).map((_, i) => (
				<div
					key={`summary-${String(i)}`}
					className="bg-surface rounded-lg border border-border p-4 flex flex-col gap-2"
				>
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-6 w-16" />
				</div>
			))}
		</div>
	)
}
