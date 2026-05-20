import type { ReactNode } from "react"

type PageHeaderProps = {
	title: string
	subtitle?: string
	action?: ReactNode
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
	return (
		<div className="flex justify-between items-start gap-4">
			<div>
				<h1 className="text-2xl font-bold text-foreground">{title}</h1>
				{subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
			</div>
			{action && <div className="shrink-0">{action}</div>}
		</div>
	)
}
