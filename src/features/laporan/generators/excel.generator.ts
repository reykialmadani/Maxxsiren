import * as XLSX from "xlsx"
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

export function generateLaporanMasukExcel(data: LaporanMasukData): ArrayBuffer {
	const rows = [
		...data.barangMasuk.map((item, i) => ({
			No: i + 1,
			Tanggal: formatTanggal(item.tanggalMasuk),
			Tipe: "Barang Masuk",
			Supplier: item.supplier.nama,
			Kode: item.barang.kode,
			"Nama Barang": item.barang.namaBarang,
			Kategori: item.barang.kategori.nama,
			Jumlah: item.jumlah,
			Satuan: item.barang.satuan,
			Keterangan: item.keterangan ?? "-",
			"Dicatat oleh": item.user.nama,
		})),
		...data.returMasuk.map((item, i: number) => ({
			No: data.barangMasuk.length + i + 1,
			Tanggal: formatTanggal(item.tanggalRetur),
			Tipe: "Retur Masuk",
			Supplier: item.namaPenerima ?? "-",
			Kode: item.barang.kode,
			"Nama Barang": item.barang.namaBarang,
			Kategori: item.barang.kategori.nama,
			Jumlah: item.jumlah,
			Satuan: item.barang.satuan,
			Keterangan: item.keterangan ?? "-",
			"Dicatat oleh": item.user.nama,
		})),
	]

	const ws = XLSX.utils.json_to_sheet(rows)
	const wb = XLSX.utils.book_new()
	XLSX.utils.book_append_sheet(wb, ws, "Laporan Masuk")
	return XLSX.write(wb, { type: "array", bookType: "xlsx" }) as ArrayBuffer
}

export function generateLaporanKeluarExcel(data: LaporanKeluarData): ArrayBuffer {
	const rows = [
		...data.barangKeluar.map((item, i: number) => ({
			No: i + 1,
			Tanggal: formatTanggal(item.tanggalKeluar),
			Tipe: "Barang Keluar",
			Penerima: item.namaPenerima,
			Kode: item.barang.kode,
			"Nama Barang": item.barang.namaBarang,
			Kategori: item.barang.kategori.nama,
			Jumlah: item.jumlah,
			Satuan: item.barang.satuan,
			Keterangan: item.keterangan ?? "-",
			"Dicatat oleh": item.user.nama,
		})),
		...data.returKeluar.map((item, i: number) => ({
			No: data.barangKeluar.length + i + 1,
			Tanggal: formatTanggal(item.tanggalRetur),
			Tipe: "Retur Keluar",
			Penerima: item.supplier?.nama ?? "-",
			Kode: item.barang.kode,
			"Nama Barang": item.barang.namaBarang,
			Kategori: item.barang.kategori.nama,
			Jumlah: item.jumlah,
			Satuan: item.barang.satuan,
			Keterangan: item.keterangan ?? "-",
			"Dicatat oleh": item.user.nama,
		})),
	]

	const ws = XLSX.utils.json_to_sheet(rows)
	const wb = XLSX.utils.book_new()
	XLSX.utils.book_append_sheet(wb, ws, "Laporan Keluar")
	return XLSX.write(wb, { type: "array", bookType: "xlsx" }) as ArrayBuffer
}
