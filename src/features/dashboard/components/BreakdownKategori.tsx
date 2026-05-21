"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import type { StokPerKategoriItem } from "@/features/dashboard/queries/dashboard.queries"

type BreakdownKategoriProps = {
	data: StokPerKategoriItem[]
}

const COLORS = [
	"var(--primary)",
	"var(--info)",
	"var(--success)",
	"var(--warning)",
	"var(--secondary)",
]

export function BreakdownKategori({ data }: BreakdownKategoriProps) {
	return (
		<div className="bg-surface rounded-lg border border-border shadow-card p-6">
			<div className="mb-4">
				<h2 className="text-lg font-semibold text-foreground">Stok per Kategori</h2>
				<p className="text-sm text-muted-foreground mt-0.5">Distribusi total stok</p>
			</div>
			<ResponsiveContainer width="100%" height={160}>
				<PieChart>
					<Pie
						data={data}
						dataKey="totalStok"
						nameKey="kategori"
						cx="50%"
						cy="50%"
						outerRadius={65}
						innerRadius={35}
					>
						{data.map((entry, index) => (
							<Cell key={entry.kategori} fill={COLORS[index % COLORS.length]} />
						))}
					</Pie>
					<Tooltip
						contentStyle={{
							backgroundColor: "var(--surface)",
							border: "1px solid var(--border)",
							borderRadius: "8px",
							fontSize: "12px",
						}}
					/>
				</PieChart>
			</ResponsiveContainer>
			<div className="flex flex-col gap-1.5 mt-2">
				{data.map((item, index) => (
					<div key={item.kategori} className="flex items-center justify-between text-xs">
						<div className="flex items-center gap-2">
							<div
								className="w-2.5 h-2.5 rounded-full shrink-0"
								style={{ backgroundColor: COLORS[index % COLORS.length] }}
							/>
							<span className="text-foreground">{item.kategori}</span>
						</div>
						<span className="text-muted-foreground font-medium">{item.totalStok} unit</span>
					</div>
				))}
			</div>
		</div>
	)
}
