import {
	DetailHeaderSkeleton,
	PageHeaderSkeleton,
	StatCardsSkeleton,
	TableSkeleton,
} from "@/components/common/skeletons"

export default function Loading() {
	return (
		<div className="px-6 py-8 lg:px-8 flex flex-col gap-6 max-w-5xl mx-auto">
			<PageHeaderSkeleton />
			<DetailHeaderSkeleton />
			<StatCardsSkeleton count={5} />
			<TableSkeleton rows={4} />
		</div>
	)
}
