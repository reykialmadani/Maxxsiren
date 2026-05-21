"use client"

import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts"
import type { TrenTransaksi7HariItem } from "@/features/dashboard/queries/dashboard.queries"

type GrafikTren7HariProps = {
	data: TrenTransaksi7HariItem[]
}

export function GrafikTren7Hari({ data }: GrafikTren7HariProps) {
	return (
		<div className="bg-surface rounded-lg border border-border shadow-card p-6">
			<div className="mb-4">
				<h2 className="text-lg font-semibold text-foreground">Tren Transaksi 7 Hari</h2>
				<p className="text-sm text-muted-foreground mt-0.5">
					Jumlah unit masuk dan keluar per hari
				</p>
			</div>
			<ResponsiveContainer width="100%" height={220}>
				<BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
					<CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
					<XAxis
						dataKey="tanggal"
						tick={{ fontSize: 11, fill: "var(--foreground-muted)" }}
						axisLine={false}
						tickLine={false}
					/>
					<YAxis
						tick={{ fontSize: 11, fill: "var(--foreground-muted)" }}
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
					<Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
					<Bar dataKey="masuk" name="Masuk" fill="var(--primary)" radius={[3, 3, 0, 0]} />
					<Bar dataKey="keluar" name="Keluar" fill="var(--danger)" radius={[3, 3, 0, 0]} />
				</BarChart>
			</ResponsiveContainer>
		</div>
	)
}
