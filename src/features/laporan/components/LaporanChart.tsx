"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

type LaporanChartProps = {
	data: { tanggal: string; jumlah: number }[]
	color: "primary" | "danger"
}

export function LaporanChart({ data, color }: LaporanChartProps) {
	const fillColor = color === "primary" ? "var(--primary)" : "var(--danger)"

	if (data.length === 0) return null

	return (
		<div className="bg-surface rounded-lg border border-border shadow-card p-6">
			<h3 className="text-sm font-semibold text-foreground mb-4">Tren Harian dalam Periode</h3>
			<ResponsiveContainer width="100%" height={180}>
				<BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
					<CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
					<XAxis
						dataKey="tanggal"
						tick={{ fontSize: 10, fill: "var(--foreground-muted)" }}
						axisLine={false}
						tickLine={false}
					/>
					<YAxis
						tick={{ fontSize: 10, fill: "var(--foreground-muted)" }}
						axisLine={false}
						tickLine={false}
					/>
					<Tooltip
						contentStyle={{
							backgroundColor: "var(--surface)",
							border: "1px solid var(--border)",
							borderRadius: "8px",
							fontSize: "12px",
						}}
					/>
					<Bar dataKey="jumlah" name="Unit" fill={fillColor} radius={[3, 3, 0, 0]} />
				</BarChart>
			</ResponsiveContainer>
		</div>
	)
}
