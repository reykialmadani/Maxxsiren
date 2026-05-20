import type { ReactNode } from "react"

type PageHeaderProps = {
	title: string
	subtitle?: string
	action?: ReactNode
	icon?: React.ComponentType<{ className?: string }>
}

export function PageHeader({ title, subtitle, action, icon: Icon }: PageHeaderProps) {
	return (
		<div className="flex justify-between items-start gap-4">
			<div className="flex items-start gap-3">
				{Icon && (
					<div className="mt-0.5">
						<Icon className="h-7 w-7 text-primary" />
					</div>
				)}
				<div>
					<h1 className="text-2xl font-bold text-foreground">{title}</h1>
					{subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
				</div>
			</div>
			{action && <div className="shrink-0">{action}</div>}
		</div>
	)
}
