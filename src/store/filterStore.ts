import { create } from 'zustand'

import { SearchRequestFilter } from '@/shared/api/types/SearchRequest/SearchRequestFilter'

interface FilterState {
	selectedFilters: SearchRequestFilter
	setFilters: (filters: SearchRequestFilter) => void
	resetFilters: () => void
}

export const useFilterStore = create<FilterState>(set => ({
	selectedFilters: [],
	setFilters: filters => set({ selectedFilters: filters }),
	resetFilters: () => set({ selectedFilters: [] })
}))
