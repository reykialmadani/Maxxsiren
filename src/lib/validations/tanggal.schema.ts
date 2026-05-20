import { z } from "zod"

export const tanggalTransaksiSchema = z.string().refine(
	(s) => {
		if (!s) return false
		const d = new Date(s)
		if (Number.isNaN(d.getTime())) return false
		const now = new Date()
		const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
		return d <= now && d >= thirtyDaysAgo
	},
	{ message: "Tanggal harus dalam 30 hari terakhir dan tidak boleh masa depan" },
)
