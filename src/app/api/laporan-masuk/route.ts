import { type NextRequest, NextResponse } from "next/server"
import { generateLaporanMasukExcel } from "@/features/laporan/generators/excel.generator"
import { generateLaporanMasukPdf } from "@/features/laporan/generators/pdf.generator"
import { getLaporanMasukData } from "@/features/laporan/queries/laporan.queries"
import { requireRole } from "@/server/auth"

export async function GET(request: NextRequest) {
	await requireRole("MANAJER")

	const { searchParams } = new URL(request.url)
	const format = searchParams.get("format")
	const dateFromStr = searchParams.get("dateFrom")
	const dateToStr = searchParams.get("dateTo")

	if (!format || !["pdf", "excel"].includes(format)) {
		return NextResponse.json({ error: "Format tidak valid" }, { status: 400 })
	}
	if (!dateFromStr || !dateToStr) {
		return NextResponse.json({ error: "Tanggal mulai dan akhir wajib diisi" }, { status: 400 })
	}

	const dateFrom = new Date(dateFromStr)
	const dateTo = new Date(dateToStr)
	dateTo.setHours(23, 59, 59, 999)

	if (Number.isNaN(dateFrom.getTime()) || Number.isNaN(dateTo.getTime())) {
		return NextResponse.json({ error: "Format tanggal tidak valid" }, { status: 400 })
	}
	if (dateFrom > dateTo) {
		return NextResponse.json(
			{ error: "Tanggal mulai tidak boleh lebih dari tanggal akhir" },
			{ status: 400 },
		)
	}

	const data = await getLaporanMasukData({ dateFrom, dateTo })

	const tanggal = new Date().toISOString().slice(0, 10)
	const ext = format === "pdf" ? "pdf" : "xlsx"
	const filename = `laporan-masuk-${tanggal}.${ext}`
	const contentType =
		format === "pdf"
			? "application/pdf"
			: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

	const buffer =
		format === "pdf"
			? generateLaporanMasukPdf(data, dateFrom, dateTo)
			: generateLaporanMasukExcel(data)

	return new NextResponse(buffer, {
		status: 200,
		headers: {
			"Content-Type": contentType,
			"Content-Disposition": `attachment; filename="${filename}"`,
		},
	})
}
