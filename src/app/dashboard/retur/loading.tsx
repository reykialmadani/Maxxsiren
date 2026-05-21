import { FilterBarSkeleton, PageHeaderSkeleton, TableSkeleton } from "@/components/common/skeletons"

export default function Loading() {
	return (
		<div className="px-6 py-8 lg:px-8 flex flex-col gap-6 max-w-7xl mx-auto">
			<PageHeaderSkeleton />
			<FilterBarSkeleton />
			<TableSkeleton rows={5} />
		</div>
	)
}
