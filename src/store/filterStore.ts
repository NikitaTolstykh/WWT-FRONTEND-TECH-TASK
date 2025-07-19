import { create } from 'zustand'

export interface SelectedFilters {
	[filterId: string]: string[]
}

interface FilterState {
	selectedFilters: SelectedFilters
	setFilters: (filters: SelectedFilters) => void
	resetFilters: () => void
}

export const useFilterStore = create<FilterState>(set => ({
	selectedFilters: {},
	setFilters: filters => set({ selectedFilters: filters }),
	resetFilters: () => set({ selectedFilters: {} })
}))
