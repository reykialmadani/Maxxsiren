import { jsPDF } from "jspdf"
import type {
	LaporanBarangKeluarItem,
	LaporanBarangMasukItem,
	LaporanStokItem,
} from "@/features/laporan/queries/laporan.queries"

function formatTanggal(date: Date): string {
	return new Intl.DateTimeFormat("id-ID", {
		day: "2-digit",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(date)
}

function formatPeriode(from: Date, to: Date): string {
	const fmt = new Intl.DateTimeFormat("id-ID", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	})
	return `${fmt.format(from)} — ${fmt.format(to)}`
}

export function generateLaporanBarangMasukPdf(
	data: LaporanBarangMasukItem[],
	dateFrom: Date,
	dateTo: Date,
): ArrayBuffer {
	const doc = new jsPDF({ orientation: "landscape" })

	doc.setFontSize(16)
	doc.text("Laporan Barang Masuk", 14, 20)
	doc.setFontSize(10)
	doc.text(`Periode: ${formatPeriode(dateFrom, dateTo)}`, 14, 28)
	doc.text(`Dicetak: ${formatTanggal(new Date())}`, 14, 34)
	doc.text(`Total transaksi: ${data.length}`, 14, 40)

	const headers = [
		"No",
		"Waktu",
		"Kode",
		"Nama Barang",
		"Kategori",
		"Jumlah",
		"Satuan",
		"Keterangan",
		"Dicatat oleh",
	]
	const startY = 48
	const colWidths = [10, 35, 25, 50, 30, 18, 20, 50, 35]
	let y = startY

	doc.setFontSize(8)
	doc.setFont("helvetica", "bold")
	let x = 14
	for (let i = 0; i < headers.length; i++) {
		doc.text(headers[i], x, y)
		x += colWidths[i]
	}

	doc.setFont("helvetica", "normal")
	y += 6

	for (let i = 0; i < data.length; i++) {
		if (y > 190) {
			doc.addPage()
			y = 20
		}

		const item = data[i]
		x = 14
		const row = [
			String(i + 1),
			formatTanggal(item.createdAt),
			item.barang.kode,
			item.barang.namaBarang,
			item.barang.kategori.nama,
			String(item.jumlah),
			item.barang.satuan,
			item.keterangan ?? "-",
			item.user.nama,
		]

		for (let j = 0; j < row.length; j++) {
			doc.text(row[j].substring(0, Math.floor(colWidths[j] / 2)), x, y)
			x += colWidths[j]
		}
		y += 5
	}

	return doc.output("arraybuffer")
}

export function generateLaporanBarangKeluarPdf(
	data: LaporanBarangKeluarItem[],
	dateFrom: Date,
	dateTo: Date,
): ArrayBuffer {
	const doc = new jsPDF({ orientation: "landscape" })

	doc.setFontSize(16)
	doc.text("Laporan Barang Keluar", 14, 20)
	doc.setFontSize(10)
	doc.text(`Periode: ${formatPeriode(dateFrom, dateTo)}`, 14, 28)
	doc.text(`Dicetak: ${formatTanggal(new Date())}`, 14, 34)
	doc.text(`Total transaksi: ${data.length}`, 14, 40)

	const headers = [
		"No",
		"Waktu",
		"Kode",
		"Nama Barang",
		"Kategori",
		"Jumlah",
		"Satuan",
		"Keterangan",
		"Dicatat oleh",
	]
	const startY = 48
	const colWidths = [10, 35, 25, 50, 30, 18, 20, 50, 35]
	let y = startY

	doc.setFontSize(8)
	doc.setFont("helvetica", "bold")
	let x = 14
	for (let i = 0; i < headers.length; i++) {
		doc.text(headers[i], x, y)
		x += colWidths[i]
	}

	doc.setFont("helvetica", "normal")
	y += 6

	for (let i = 0; i < data.length; i++) {
		if (y > 190) {
			doc.addPage()
			y = 20
		}

		const item = data[i]
		x = 14
		const row = [
			String(i + 1),
			formatTanggal(item.createdAt),
			item.barang.kode,
			item.barang.namaBarang,
			item.barang.kategori.nama,
			String(item.jumlah),
			item.barang.satuan,
			item.keterangan ?? "-",
			item.user.nama,
		]

		for (let j = 0; j < row.length; j++) {
			doc.text(row[j].substring(0, Math.floor(colWidths[j] / 2)), x, y)
			x += colWidths[j]
		}
		y += 5
	}

	return doc.output("arraybuffer")
}

export function generateLaporanStokPdf(data: LaporanStokItem[]): ArrayBuffer {
	const doc = new jsPDF()

	doc.setFontSize(16)
	doc.text("Laporan Stok Barang", 14, 20)
	doc.setFontSize(10)
	doc.text(`Dicetak: ${formatTanggal(new Date())}`, 14, 28)
	doc.text(`Total jenis barang: ${data.length}`, 14, 34)

	const headers = ["No", "Kode", "Nama Barang", "Kategori", "Stok", "Min. Stok", "Satuan", "Status"]
	const startY = 42
	const colWidths = [10, 22, 45, 28, 15, 20, 18, 22]
	let y = startY

	doc.setFontSize(8)
	doc.setFont("helvetica", "bold")
	let x = 14
	for (let i = 0; i < headers.length; i++) {
		doc.text(headers[i], x, y)
		x += colWidths[i]
	}

	doc.setFont("helvetica", "normal")
	y += 6

	for (let i = 0; i < data.length; i++) {
		if (y > 280) {
			doc.addPage()
			y = 20
		}

		const item = data[i]
		let status = "Tersedia"
		if (item.stok === 0) status = "Habis"
		else if (item.stok <= item.minStok) status = "Menipis"

		x = 14
		const row = [
			String(i + 1),
			item.kode,
			item.namaBarang,
			item.kategori.nama,
			String(item.stok),
			String(item.minStok),
			item.satuan,
			status,
		]

		for (let j = 0; j < row.length; j++) {
			doc.text(row[j].substring(0, Math.floor(colWidths[j] / 2)), x, y)
			x += colWidths[j]
		}
		y += 5
	}

	return doc.output("arraybuffer")
}
