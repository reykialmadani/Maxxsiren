"use client"

import { useRouter } from "next/navigation"
import type { ReactNode } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type BarangTabsProps = {
	activeTab: string
	barangContent: ReactNode
	stokContent: ReactNode
	kategoriContent: ReactNode
}

export function BarangTabs({
	activeTab,
	barangContent,
	stokContent,
	kategoriContent,
}: BarangTabsProps) {
	const router = useRouter()

	function handleTabChange(value: string) {
		const params = new URLSearchParams()
		params.set("tab", value)
		router.push(`/dashboard/barang?${params.toString()}`)
	}

	return (
		<Tabs value={activeTab} onValueChange={handleTabChange}>
			<TabsList>
				<TabsTrigger value="barang">Barang</TabsTrigger>
				<TabsTrigger value="stok">Stok</TabsTrigger>
				<TabsTrigger value="kategori">Kategori</TabsTrigger>
			</TabsList>

			<TabsContent value="barang" className="mt-4">
				{barangContent}
			</TabsContent>
			<TabsContent value="stok" className="mt-4">
				{stokContent}
			</TabsContent>
			<TabsContent value="kategori" className="mt-4">
				{kategoriContent}
			</TabsContent>
		</Tabs>
	)
}
