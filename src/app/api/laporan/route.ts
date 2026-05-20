import { type NextRequest, NextResponse } from "next/server"
import {
	generateLaporanBarangKeluarExcel,
	generateLaporanBarangMasukExcel,
	generateLaporanStokExcel,
} from "@/features/laporan/generators/excel.generator"
import {
	generateLaporanBarangKeluarPdf,
	generateLaporanBarangMasukPdf,
	generateLaporanStokPdf,
} from "@/features/laporan/generators/pdf.generator"
import {
	getLaporanBarangKeluar,
	getLaporanBarangMasuk,
	getLaporanStokSaatIni,
} from "@/features/laporan/queries/laporan.queries"
import { requireRole } from "@/server/auth"

const TIPE_VALID = ["barang-masuk", "barang-keluar", "stok"] as const
const FORMAT_VALID = ["pdf", "excel"] as const

type Tipe = (typeof TIPE_VALID)[number]
type Format = (typeof FORMAT_VALID)[number]

export async function GET(request: NextRequest) {
	await requireRole("MANAJER")

	const { searchParams } = new URL(request.url)
	const tipe = searchParams.get("tipe") as Tipe | null
	const format = searchParams.get("format") as Format | null
	const dateFromStr = searchParams.get("dateFrom")
	const dateToStr = searchParams.get("dateTo")

	if (!tipe || !TIPE_VALID.includes(tipe)) {
		return NextResponse.json({ error: "Tipe laporan tidak valid" }, { status: 400 })
	}
	if (!format || !FORMAT_VALID.includes(format)) {
		return NextResponse.json({ error: "Format laporan tidak valid" }, { status: 400 })
	}

	let dateFrom: Date
	let dateTo: Date

	if (tipe !== "stok") {
		if (!dateFromStr || !dateToStr) {
			return NextResponse.json({ error: "Tanggal mulai dan akhir wajib diisi" }, { status: 400 })
		}
		dateFrom = new Date(dateFromStr)
		dateTo = new Date(dateToStr)
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
	} else {
		dateFrom = new Date()
		dateTo = new Date()
	}

	let buffer: ArrayBuffer

	const tanggal = new Date().toISOString().slice(0, 10)
	const ext = format === "pdf" ? "pdf" : "xlsx"
	const filename = `laporan-${tipe}-${tanggal}.${ext}`
	const contentType =
		format === "pdf"
			? "application/pdf"
			: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

	if (tipe === "barang-masuk") {
		const data = await getLaporanBarangMasuk({ dateFrom, dateTo })
		buffer =
			format === "pdf"
				? generateLaporanBarangMasukPdf(data, dateFrom, dateTo)
				: generateLaporanBarangMasukExcel(data)
	} else if (tipe === "barang-keluar") {
		const data = await getLaporanBarangKeluar({ dateFrom, dateTo })
		buffer =
			format === "pdf"
				? generateLaporanBarangKeluarPdf(data, dateFrom, dateTo)
				: generateLaporanBarangKeluarExcel(data)
	} else {
		const data = await getLaporanStokSaatIni()
		buffer = format === "pdf" ? generateLaporanStokPdf(data) : generateLaporanStokExcel(data)
	}

	return new NextResponse(buffer, {
		status: 200,
		headers: {
			"Content-Type": contentType,
			"Content-Disposition": `attachment; filename="${filename}"`,
		},
	})
}
