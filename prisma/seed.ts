import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

type AuthUser = { id: string; email?: string }

async function getSupabaseIdByEmail(email: string): Promise<string | null> {
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL
	const key = process.env.SUPABASE_SERVICE_ROLE_KEY
	if (!url || !key) return null

	const res = await fetch(`${url}/auth/v1/admin/users?per_page=200`, {
		headers: {
			apikey: key,
			Authorization: `Bearer ${key}`,
		},
	})
	if (!res.ok) return null

	const json = (await res.json()) as { users?: AuthUser[] }
	const user = json.users?.find((u) => u.email === email)
	return user?.id ?? null
}

async function main() {
	await prisma.retur.deleteMany()
	await prisma.barangKeluar.deleteMany()
	await prisma.barangMasuk.deleteMany()
	await prisma.barang.deleteMany()
	await prisma.kategori.deleteMany()
	await prisma.supplier.deleteMany()
	await prisma.user.deleteMany()

	const manajerEmail = "manajer@maxxsiren.com"
	const stafEmail = "staf@maxxsiren.com"

	const manajerSupabaseId = (await getSupabaseIdByEmail(manajerEmail)) ?? "seed-supabase-id-manajer"
	const stafSupabaseId = (await getSupabaseIdByEmail(stafEmail)) ?? "seed-supabase-id-staf"

	if (manajerSupabaseId.startsWith("seed-")) {
		console.warn(
			`WARNING: Tidak menemukan user "${manajerEmail}" di Supabase Auth. Memakai dummy ID. Login dengan akun ini tidak akan berfungsi sampai akun dibuat di Supabase Auth dan seed dijalankan ulang.`,
		)
	}
	if (stafSupabaseId.startsWith("seed-")) {
		console.warn(`WARNING: Tidak menemukan user "${stafEmail}" di Supabase Auth. Memakai dummy ID.`)
	}

	const manajer = await prisma.user.create({
		data: {
			supabaseId: manajerSupabaseId,
			nama: "Manajer Maxxsiren",
			email: manajerEmail,
			isActive: true,
		},
	})

	const staf = await prisma.user.create({
		data: {
			supabaseId: stafSupabaseId,
			nama: "Staf Inventaris",
			email: stafEmail,
			isActive: true,
		},
	})

	const sup1 = await prisma.supplier.create({
		data: {
			nama: "PT Supplier Utama",
			telepon: "021-5551234",
			alamat: "Jl. Industri No. 10, Jakarta Barat",
		},
	})

	const sup2 = await prisma.supplier.create({
		data: {
			nama: "CV Mitra Sirine",
			telepon: "022-7654321",
			alamat: "Jl. Raya Cimahi No. 45, Bandung",
		},
	})

	const sup3 = await prisma.supplier.create({
		data: {
			nama: "Toko Elektronik Jaya",
			telepon: "031-8889999",
			alamat: "Jl. Pasar Besar No. 12, Surabaya",
		},
	})

	const katSirine = await prisma.kategori.create({ data: { nama: "Sirine" } })
	const katStrobo = await prisma.kategori.create({ data: { nama: "Lampu Strobo" } })
	const katAksesoris = await prisma.kategori.create({ data: { nama: "Aksesoris" } })

	const srn001 = await prisma.barang.create({
		data: {
			kode: "SRN-001",
			namaBarang: "Sirine Polisi 100W",
			kategoriId: katSirine.id,
			stok: 50,
			minStok: 10,
			satuan: "Unit",
		},
	})
	const srn002 = await prisma.barang.create({
		data: {
			kode: "SRN-002",
			namaBarang: "Sirine Patwal 200W",
			kategoriId: katSirine.id,
			stok: 20,
			minStok: 5,
			satuan: "Unit",
		},
	})
	const srn003 = await prisma.barang.create({
		data: {
			kode: "SRN-003",
			namaBarang: "Sirine Ambulans 150W",
			kategoriId: katSirine.id,
			stok: 30,
			minStok: 10,
			satuan: "Unit",
		},
	})
	const str001 = await prisma.barang.create({
		data: {
			kode: "STR-001",
			namaBarang: "Lampu Strobo Dashboard",
			kategoriId: katStrobo.id,
			stok: 100,
			minStok: 15,
			satuan: "Unit",
		},
	})
	await prisma.barang.create({
		data: {
			kode: "STR-002",
			namaBarang: "Lampu Strobo Grill",
			kategoriId: katStrobo.id,
			stok: 3,
			minStok: 10,
			satuan: "Unit",
		},
	})
	await prisma.barang.create({
		data: {
			kode: "STR-003",
			namaBarang: "Lampu Strobo Rotari",
			kategoriId: katStrobo.id,
			stok: 60,
			minStok: 15,
			satuan: "Unit",
		},
	})
	const aks001 = await prisma.barang.create({
		data: {
			kode: "AKS-001",
			namaBarang: "Kabel Ekstensi 5m",
			kategoriId: katAksesoris.id,
			stok: 0,
			minStok: 20,
			satuan: "Roll",
		},
	})
	const aks002 = await prisma.barang.create({
		data: {
			kode: "AKS-002",
			namaBarang: "Modul Kontrol Suara",
			kategoriId: katAksesoris.id,
			stok: 45,
			minStok: 5,
			satuan: "Unit",
		},
	})

	const today = new Date()
	const threeDaysAgo = new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000)
	const fiveDaysAgo = new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000)
	const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

	await prisma.barangMasuk.create({
		data: {
			barangId: srn001.id,
			userId: staf.id,
			supplierId: sup1.id,
			jumlah: 10,
			keterangan: "Restock dari supplier utama",
			tanggalMasuk: fiveDaysAgo,
		},
	})
	await prisma.barangMasuk.create({
		data: {
			barangId: str001.id,
			userId: manajer.id,
			supplierId: sup2.id,
			jumlah: 25,
			keterangan: "Pengadaan rutin bulanan",
			tanggalMasuk: threeDaysAgo,
		},
	})

	await prisma.barangKeluar.create({
		data: {
			barangId: srn002.id,
			userId: staf.id,
			namaPenerima: "Toko Retail A",
			jumlah: 3,
			keterangan: "Penjualan retail",
			tanggalKeluar: threeDaysAgo,
		},
	})
	await prisma.barangKeluar.create({
		data: {
			barangId: srn003.id,
			userId: staf.id,
			namaPenerima: "Dinas Perhubungan Kota",
			jumlah: 5,
			keterangan: "Pesanan dinas perhubungan",
			tanggalKeluar: fiveDaysAgo,
		},
	})
	await prisma.barangKeluar.create({
		data: {
			barangId: aks002.id,
			userId: manajer.id,
			namaPenerima: "PT Instalasi Jaya",
			jumlah: 2,
			keterangan: "Proyek instalasi khusus",
			tanggalKeluar: sevenDaysAgo,
		},
	})

	await prisma.retur.create({
		data: {
			tipe: "MASUK",
			barangId: srn002.id,
			userId: staf.id,
			jumlah: 1,
			keterangan: "Retur dari customer - barang cacat",
			tanggalRetur: threeDaysAgo,
			namaPenerima: "Toko Retail A",
		},
	})
	await prisma.retur.create({
		data: {
			tipe: "KELUAR",
			barangId: aks001.id,
			userId: manajer.id,
			jumlah: 2,
			keterangan: "Retur ke supplier - salah kirim",
			tanggalRetur: fiveDaysAgo,
			supplierId: sup3.id,
		},
	})

	console.log("Database seed completed successfully.")
	console.log(`Manajer supabaseId: ${manajerSupabaseId}`)
	console.log(`Staf supabaseId:    ${stafSupabaseId}`)
}

main()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
