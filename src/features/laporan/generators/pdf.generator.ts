import { jsPDF } from "jspdf"
import type {
	LaporanKeluarData,
	LaporanMasukData,
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
	const fmt = new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "long", year: "numeric" })
	return `${fmt.format(from)} — ${fmt.format(to)}`
}

function truncate(str: string, max: number): string {
	return str.length > max ? `${str.substring(0, max - 1)}…` : str
}

export function generateLaporanMasukPdf(
	data: LaporanMasukData,
	dateFrom: Date,
	dateTo: Date,
): ArrayBuffer {
	const doc = new jsPDF({ orientation: "landscape" })
	const allRows = [
		...data.barangMasuk.map((item) => ({
			tanggal: formatTanggal(item.tanggalMasuk),
			tipe: "Masuk",
			pihak: item.supplier.nama,
			kode: item.barang.kode,
			nama: item.barang.namaBarang,
			jumlah: String(item.jumlah),
			satuan: item.barang.satuan,
			keterangan: item.keterangan ?? "-",
			user: item.user.nama,
		})),
		...data.returMasuk.map((item) => ({
			tanggal: formatTanggal(item.tanggalRetur),
			tipe: "Retur",
			pihak: item.namaPenerima ?? "-",
			kode: item.barang.kode,
			nama: item.barang.namaBarang,
			jumlah: String(item.jumlah),
			satuan: item.barang.satuan,
			keterangan: item.keterangan ?? "-",
			user: item.user.nama,
		})),
	]

	doc.setFontSize(16)
	doc.text("Laporan Barang Masuk", 14, 18)
	doc.setFontSize(9)
	doc.text(`Periode: ${formatPeriode(dateFrom, dateTo)}`, 14, 25)
	doc.text(`Dicetak: ${formatTanggal(new Date())}  |  Total: ${allRows.length} transaksi`, 14, 30)

	const headers = [
		"No",
		"Tanggal",
		"Tipe",
		"Supplier/Pengirim",
		"Kode",
		"Nama Barang",
		"Jml",
		"Satuan",
		"Keterangan",
		"Oleh",
	]
	const colW = [8, 32, 14, 38, 20, 45, 12, 16, 40, 28]
	let y = 38

	doc.setFontSize(7.5)
	doc.setFont("helvetica", "bold")
	let x = 14
	for (let i = 0; i < headers.length; i++) {
		doc.text(headers[i], x, y)
		x += colW[i]
	}
	doc.setFont("helvetica", "normal")
	y += 5

	for (let i = 0; i < allRows.length; i++) {
		if (y > 190) {
			doc.addPage()
			y = 18
		}
		const r = allRows[i]
		x = 14
		const cells = [
			String(i + 1),
			r.tanggal,
			r.tipe,
			truncate(r.pihak, 18),
			r.kode,
			truncate(r.nama, 22),
			r.jumlah,
			r.satuan,
			truncate(r.keterangan, 20),
			truncate(r.user, 14),
		]
		for (let j = 0; j < cells.length; j++) {
			doc.text(cells[j], x, y)
			x += colW[j]
		}
		y += 5
	}

	return doc.output("arraybuffer")
}

export function generateLaporanKeluarPdf(
	data: LaporanKeluarData,
	dateFrom: Date,
	dateTo: Date,
): ArrayBuffer {
	const doc = new jsPDF({ orientation: "landscape" })
	const allRows = [
		...data.barangKeluar.map((item) => ({
			tanggal: formatTanggal(item.tanggalKeluar),
			tipe: "Keluar",
			pihak: item.namaPenerima,
			kode: item.barang.kode,
			nama: item.barang.namaBarang,
			jumlah: String(item.jumlah),
			satuan: item.barang.satuan,
			keterangan: item.keterangan ?? "-",
			user: item.user.nama,
		})),
		...data.returKeluar.map((item) => ({
			tanggal: formatTanggal(item.tanggalRetur),
			tipe: "Retur",
			pihak: item.supplier?.nama ?? "-",
			kode: item.barang.kode,
			nama: item.barang.namaBarang,
			jumlah: String(item.jumlah),
			satuan: item.barang.satuan,
			keterangan: item.keterangan ?? "-",
			user: item.user.nama,
		})),
	]

	doc.setFontSize(16)
	doc.text("Laporan Barang Keluar", 14, 18)
	doc.setFontSize(9)
	doc.text(`Periode: ${formatPeriode(dateFrom, dateTo)}`, 14, 25)
	doc.text(`Dicetak: ${formatTanggal(new Date())}  |  Total: ${allRows.length} transaksi`, 14, 30)

	const headers = [
		"No",
		"Tanggal",
		"Tipe",
		"Penerima/Supplier",
		"Kode",
		"Nama Barang",
		"Jml",
		"Satuan",
		"Keterangan",
		"Oleh",
	]
	const colW = [8, 32, 14, 38, 20, 45, 12, 16, 40, 28]
	let y = 38

	doc.setFontSize(7.5)
	doc.setFont("helvetica", "bold")
	let x = 14
	for (let i = 0; i < headers.length; i++) {
		doc.text(headers[i], x, y)
		x += colW[i]
	}
	doc.setFont("helvetica", "normal")
	y += 5

	for (let i = 0; i < allRows.length; i++) {
		if (y > 190) {
			doc.addPage()
			y = 18
		}
		const r = allRows[i]
		x = 14
		const cells = [
			String(i + 1),
			r.tanggal,
			r.tipe,
			truncate(r.pihak, 18),
			r.kode,
			truncate(r.nama, 22),
			r.jumlah,
			r.satuan,
			truncate(r.keterangan, 20),
			truncate(r.user, 14),
		]
		for (let j = 0; j < cells.length; j++) {
			doc.text(cells[j], x, y)
			x += colW[j]
		}
		y += 5
	}

	return doc.output("arraybuffer")
}
