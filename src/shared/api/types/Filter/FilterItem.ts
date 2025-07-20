import { FilterChoose } from '.'

export type FilterItem = FilterChoose

export interface FilterOption {
	id: string
	name: string
	description?: string
}
