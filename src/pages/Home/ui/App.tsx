import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Filter } from 'lucide-react'

import { FilterModal } from '../../../components/FilterModal'
import { SearchRequestFilter } from '../../../shared/api/types/SearchRequest/SearchRequestFilter'
import { useFilterStore } from '../../../store/filterStore'

export const App: React.FC = () => {
	const { t } = useTranslation()
	const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
	const { selectedFilters, setFilters } = useFilterStore()

	const handleOpenFilter = () => {
		setIsFilterModalOpen(true)
	}

	const handleCloseFilter = () => {
		setIsFilterModalOpen(false)
	}

	const handleApplyFilter = (filters: SearchRequestFilter) => {
		setFilters(filters)
	}

	const getSelectedFiltersCount = () => {
		return selectedFilters.reduce(
			(total, filter) => total + (filter.optionsIds?.length || 0),
			0
		)
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-4">
						{t('app.title', 'WinWinTravel Filter Demo')}
					</h1>

					<button
						onClick={handleOpenFilter}
						className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md font-medium transition-colors"
					>
						<Filter className="w-4 h-4" />
						{t('filter.openButton', 'Open Filters')}
						{getSelectedFiltersCount() > 0 && (
							<span className="bg-white text-orange-500 text-xs px-2 py-1 rounded-full">
								{getSelectedFiltersCount()}
							</span>
						)}
					</button>
				</div>

				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
					<h2 className="text-xl font-semibold text-gray-900 mb-4">
						{t('filter.selectedTitle', 'Selected Filters (Debug Display)')}
					</h2>

					{selectedFilters.length === 0 ? (
						<p className="text-gray-500 italic">
							{t('filter.noFilters', 'No filters selected')}
						</p>
					) : (
						<div className="space-y-4">
							<div>
								<h3 className="text-lg font-medium text-gray-800 mb-2">
									{t('filter.summary', 'Filter Summary')}:
								</h3>
								<div className="flex flex-wrap gap-2">
									{selectedFilters.map(filter => (
										<div
											key={filter.id}
											className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm"
										>
											{filter.id}: {filter.optionsIds?.length || 0}{' '}
											{t('filter.optionCount', 'options')}
										</div>
									))}
								</div>
							</div>

							<div>
								<h3 className="text-lg font-medium text-gray-800 mb-2">
									{t('filter.jsonTitle', 'JSON Output (SearchRequestFilter)')}:
								</h3>
								<pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto border">
									{JSON.stringify(selectedFilters, null, 2)}
								</pre>
							</div>
						</div>
					)}
				</div>
			</div>

			<FilterModal
				isOpen={isFilterModalOpen}
				onClose={handleCloseFilter}
				onApply={handleApplyFilter}
				initialFilters={selectedFilters}
			/>
		</div>
	)
}
