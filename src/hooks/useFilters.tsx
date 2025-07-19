import { useQuery } from '@tanstack/react-query'

import { FilterItem } from '../shared/api/types/Filter/FilterItem'
import { FilterType } from '../shared/api/types/Filter/FilterType'
import filterData from '../shared/temp/filterData.json'

export const useFilters = () => {
	return useQuery<FilterItem[], Error>({
		queryKey: ['filters'],
		queryFn: async () => {
			await new Promise(resolve => setTimeout(resolve, 200))

			const typedFilterItems = filterData.filterItems.map(item => ({
				...item,
				type: item.type as FilterType
			}))

			return typedFilterItems
		}
	})
}
