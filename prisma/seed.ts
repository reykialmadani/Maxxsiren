import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
	await prisma.barangKeluar.deleteMany()
	await prisma.barangMasuk.deleteMany()
	await prisma.barang.deleteMany()
	await prisma.kategori.deleteMany()
	await prisma.user.deleteMany()

	const manajer = await prisma.user.create({
		data: {
			supabaseId: "fc28c9c5-00db-4ed6-823f-23faeb6ff7b8",
			nama: "Manajer Maxxsiren",
			email: "manajer@maxxsiren.com",
			isActive: true,
		},
	})

	const staf = await prisma.user.create({
		data: {
			supabaseId: "5a5dd067-85e6-4131-ad37-4fefd11e0068",
			nama: "Staf Inventaris",
			email: "staf@maxxsiren.com",
			isActive: true,
		},
	})

	const katSirine = await prisma.kategori.create({ data: { nama: "Sirine" } })
	const katStrobo = await prisma.kategori.create({
		data: { nama: "Lampu Strobo" },
	})
	const katAksesoris = await prisma.kategori.create({
		data: { nama: "Aksesoris" },
	})

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
	await prisma.barang.create({
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

	await prisma.barangMasuk.create({
		data: {
			barangId: srn001.id,
			userId: staf.id,
			jumlah: 10,
			keterangan: "Restock from main supplier",
		},
	})
	await prisma.barangMasuk.create({
		data: {
			barangId: str001.id,
			userId: manajer.id,
			jumlah: 25,
			keterangan: "Monthly routine procurement",
		},
	})
	await prisma.barangKeluar.create({
		data: {
			barangId: srn002.id,
			userId: staf.id,
			jumlah: 3,
			keterangan: "Retail sale",
		},
	})
	await prisma.barangKeluar.create({
		data: {
			barangId: srn003.id,
			userId: staf.id,
			jumlah: 5,
			keterangan: "Transportation department order",
		},
	})
	await prisma.barangKeluar.create({
		data: {
			barangId: aks002.id,
			userId: manajer.id,
			jumlah: 2,
			keterangan: "Special project installation",
		},
	})

	console.log("Database seed completed successfully.")
}

main()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
