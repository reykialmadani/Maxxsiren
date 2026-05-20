import * as XLSX from "xlsx"
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

export function generateLaporanBarangMasukExcel(data: LaporanBarangMasukItem[]): ArrayBuffer {
	const rows = data.map((item, index) => ({
		No: index + 1,
		Waktu: formatTanggal(item.createdAt),
		Kode: item.barang.kode,
		"Nama Barang": item.barang.namaBarang,
		Kategori: item.barang.kategori.nama,
		Jumlah: item.jumlah,
		Satuan: item.barang.satuan,
		Keterangan: item.keterangan ?? "-",
		"Dicatat oleh": item.user.nama,
	}))

	const ws = XLSX.utils.json_to_sheet(rows)
	const wb = XLSX.utils.book_new()
	XLSX.utils.book_append_sheet(wb, ws, "Barang Masuk")

	return XLSX.write(wb, { type: "array", bookType: "xlsx" }) as ArrayBuffer
}

export function generateLaporanBarangKeluarExcel(data: LaporanBarangKeluarItem[]): ArrayBuffer {
	const rows = data.map((item, index) => ({
		No: index + 1,
		Waktu: formatTanggal(item.createdAt),
		Kode: item.barang.kode,
		"Nama Barang": item.barang.namaBarang,
		Kategori: item.barang.kategori.nama,
		Jumlah: item.jumlah,
		Satuan: item.barang.satuan,
		Keterangan: item.keterangan ?? "-",
		"Dicatat oleh": item.user.nama,
	}))

	const ws = XLSX.utils.json_to_sheet(rows)
	const wb = XLSX.utils.book_new()
	XLSX.utils.book_append_sheet(wb, ws, "Barang Keluar")

	return XLSX.write(wb, { type: "array", bookType: "xlsx" }) as ArrayBuffer
}

export function generateLaporanStokExcel(data: LaporanStokItem[]): ArrayBuffer {
	const rows = data.map((item, index) => {
		let status = "Tersedia"
		if (item.stok === 0) status = "Habis"
		else if (item.stok <= item.minStok) status = "Menipis"

		return {
			No: index + 1,
			Kode: item.kode,
			"Nama Barang": item.namaBarang,
			Kategori: item.kategori.nama,
			Stok: item.stok,
			"Min. Stok": item.minStok,
			Satuan: item.satuan,
			Status: status,
		}
	})

	const ws = XLSX.utils.json_to_sheet(rows)
	const wb = XLSX.utils.book_new()
	XLSX.utils.book_append_sheet(wb, ws, "Stok Barang")

	return XLSX.write(wb, { type: "array", bookType: "xlsx" }) as ArrayBuffer
}
