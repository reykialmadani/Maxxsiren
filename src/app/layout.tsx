import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const plusJakartaSans = Plus_Jakarta_Sans({
	variable: "--font-family-sans",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
	title: "Maxxsiren — Sistem Informasi Inventaris",
	description: "Sistem informasi inventaris berbasis web untuk Maxxsiren",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="id">
			<body className={`${plusJakartaSans.variable} antialiased`}>
				{children}
				<Toaster position="top-right" richColors />
			</body>
		</html>
	)
}
