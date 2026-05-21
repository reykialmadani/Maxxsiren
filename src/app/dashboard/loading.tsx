import {
	ChartSkeleton,
	MetricCardsSkeleton,
	PageHeaderSkeleton,
} from "@/components/common/skeletons"

export default function Loading() {
	return (
		<div className="px-6 py-8 lg:px-8 flex flex-col gap-8 max-w-7xl mx-auto">
			<PageHeaderSkeleton />
			<MetricCardsSkeleton count={5} />
			<div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
				<div className="xl:col-span-2">
					<ChartSkeleton />
				</div>
				<div>
					<ChartSkeleton />
				</div>
			</div>
		</div>
	)
}
