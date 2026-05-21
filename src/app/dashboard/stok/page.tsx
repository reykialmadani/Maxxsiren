import { redirect } from "next/navigation"

export default function StokPage() {
	redirect("/dashboard/barang?tab=stok")
}
