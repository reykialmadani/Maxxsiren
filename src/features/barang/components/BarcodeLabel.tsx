"use client"

import Barcode from "react-barcode"

type BarcodeLabelProps = {
	kode: string
	namaBarang: string
}

export function BarcodeLabel({ kode, namaBarang }: BarcodeLabelProps) {
	function handlePrint() {
		window.print()
	}

	return (
		<div className="flex flex-col items-center gap-2">
			<div className="barcode-label bg-white p-4 border border-border rounded-md flex flex-col items-center">
				<p className="text-xs font-medium text-foreground mb-1">{namaBarang}</p>
				<Barcode
					value={kode}
					format="CODE128"
					width={1.5}
					height={40}
					fontSize={12}
					margin={4}
					displayValue={true}
				/>
			</div>
			<button
				type="button"
				onClick={handlePrint}
				className="text-xs text-primary font-medium hover:underline print:hidden"
			>
				Print Label
			</button>
		</div>
	)
}
