import { FilterType } from '.'

export interface FilterBase {
	id: string
	name: string
	description?: string
	type: FilterType
}
