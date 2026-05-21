export const PAGE_SIZE_OPTIONS = [10, 25, 50] as const
export const DEFAULT_PAGE_SIZE = 10

export const SATUAN_OPTIONS = [
	"Unit",
	"Pcs",
	"Set",
	"Pasang",
	"Roll",
	"Box",
	"Pak",
	"Lusin",
	"Meter",
] as const

export type Satuan = (typeof SATUAN_OPTIONS)[number]
