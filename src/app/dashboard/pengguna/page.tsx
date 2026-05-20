import { PageHeader } from "@/components/common/PageHeader"
import { TabelPengguna } from "@/features/pengguna/components/TabelPengguna"
import { getDaftarPengguna } from "@/features/pengguna/queries/pengguna.queries"
import { requireRole } from "@/server/auth"

export default async function PenggunaPage() {
	const session = await requireRole("MANAJER")
	const data = await getDaftarPengguna()

	return (
		<div className="px-6 py-8 lg:px-8 flex flex-col gap-6 max-w-7xl mx-auto">
			<PageHeader title="Manajemen Pengguna" subtitle="Kelola akun pengguna sistem inventaris" />
			<TabelPengguna data={data} currentSupabaseId={session.user.id} />
		</div>
	)
}
