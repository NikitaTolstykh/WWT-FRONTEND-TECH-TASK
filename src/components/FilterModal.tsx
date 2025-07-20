import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { X } from 'lucide-react'

import { useFilters } from '../hooks/useFilters'
import { FilterItem } from '../shared/api/types/Filter'
import { FilterType } from '../shared/api/types/Filter/FilterType'
import { SearchRequestFilter } from '../shared/api/types/SearchRequest/SearchRequestFilter'
import { ConfirmationDialog } from './ConfirmationDialog'

interface FilterModalProps {
	isOpen: boolean
	onClose: () => void
	onApply: (filters: SearchRequestFilter) => void
	initialFilters: SearchRequestFilter
}

interface SelectedOptions {
	[filterId: string]: string[]
}

export const FilterModal: React.FC<FilterModalProps> = ({
	isOpen,
	onClose,
	onApply,
	initialFilters
}) => {
	const { t } = useTranslation()
	const { data: filterItems, isLoading } = useFilters()
	const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({})
	const [showConfirmation, setShowConfirmation] = useState(false)
	const [pendingFilters, setPendingFilters] = useState<SearchRequestFilter>([])

	const convertFiltersToOptions = (
		filters: SearchRequestFilter
	): SelectedOptions => {
		const options: SelectedOptions = {}
		filters.forEach(filter => {
			if (filter.type === FilterType.OPTION) {
				options[filter.id] = filter.optionsIds || []
			}
		})
		return options
	}

	const convertOptionsToFilters = (
		options: SelectedOptions
	): SearchRequestFilter => {
		return Object.entries(options)
			.filter(([, optionIds]) => optionIds.length > 0)
			.map(([filterId, optionIds]) => ({
				id: filterId,
				type: FilterType.OPTION,
				optionsIds: optionIds
			}))
	}

	useEffect(() => {
		if (isOpen) {
			setSelectedOptions(convertFiltersToOptions(initialFilters))
		}
	}, [initialFilters, isOpen])

	const toggleOption = (filterId: string, optionId: string) => {
		setSelectedOptions(prev => {
			const currentOptions = prev[filterId] || []
			const isSelected = currentOptions.includes(optionId)

			return {
				...prev,
				[filterId]: isSelected
					? currentOptions.filter(id => id !== optionId)
					: [...currentOptions, optionId]
			}
		})
	}

	const clearAllFilters = () => {
		setSelectedOptions({})
	}

	const handleApply = () => {
		const newFilters = convertOptionsToFilters(selectedOptions)

		const hasChanges =
			JSON.stringify(newFilters) !== JSON.stringify(initialFilters)

		if (hasChanges && initialFilters.length > 0) {
			setPendingFilters(newFilters)
			setShowConfirmation(true)
		} else {
			onApply(newFilters)
			onClose()
		}
	}

	const handleConfirmApply = () => {
		onApply(pendingFilters)
		setShowConfirmation(false)
		onClose()
	}

	const handleCancelApply = () => {
		setShowConfirmation(false)
		onClose()
	}

	const handleCloseConfirmation = () => {
		setShowConfirmation(false)
	}

	if (!isOpen) {
		return null
	}
	return (
		<>
			<div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
				<div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
					<div className="flex justify-between items-center p-6 border-b border-gray-200">
						<h2 className="text-xl font-semibold text-gray-900">
							{t('filter.title', 'Filter')}
						</h2>
						<button
							onClick={onClose}
							className="text-gray-400 hover:text-gray-600 transition-colors"
						>
							<X className="w-6 h-6" />
						</button>
					</div>

					<div className="flex-1 overflow-y-auto p-6">
						{isLoading ? (
							<div className="flex justify-center items-center py-12">
								<p className="text-gray-500">
									{t('common.loading', 'Loading...')}
								</p>
							</div>
						) : (
							<div className="space-y-8">
								{filterItems?.map((filterItem: FilterItem) => {
									const selectedCount =
										selectedOptions[filterItem.id]?.length || 0

									return (
										<div
											key={filterItem.id}
											className="space-y-4"
										>
											<div>
												<h3 className="text-lg font-semibold text-gray-900">
													{filterItem.name}
													{selectedCount > 0 && (
														<span className="ml-2 text-sm text-orange-500 font-normal">
															({selectedCount})
														</span>
													)}
												</h3>
												{filterItem.description && (
													<p className="text-sm text-gray-600 mt-1">
														{filterItem.description}
													</p>
												)}
											</div>

											<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
												{filterItem.options.map(option => {
													const isSelected =
														selectedOptions[filterItem.id]?.includes(
															option.id
														) || false

													return (
														<label
															key={option.id}
															className={`
                                flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-all
                                ${
																	isSelected
																		? 'border-orange-200 bg-orange-50'
																		: 'border-gray-200 hover:border-gray-300'
																}
                              `}
														>
															<input
																type="checkbox"
																checked={isSelected}
																onChange={() =>
																	toggleOption(filterItem.id, option.id)
																}
																className="mt-1 w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
															/>
															<div className="flex-1 min-w-0">
																<div className="text-sm font-medium text-gray-900">
																	{option.name}
																</div>
																{option.description && (
																	<p className="text-xs text-gray-500 mt-1">
																		{option.description}
																	</p>
																)}
															</div>
														</label>
													)
												})}
											</div>
										</div>
									)
								})}
							</div>
						)}
					</div>

					<div className="border-t border-gray-200 p-6 flex justify-between items-center">
						<button
							onClick={clearAllFilters}
							className="text-orange-500 hover:text-orange-600 text-sm font-medium"
						>
							{t('filter.clearAll', 'Clear all parameters')}
						</button>

						<div className="flex gap-3">
							<button
								onClick={onClose}
								className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium"
							>
								{t('common.cancel', 'Cancel')}
							</button>
							<button
								onClick={handleApply}
								className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md font-medium transition-colors"
							>
								{t('filter.apply', 'Apply')}
							</button>
						</div>
					</div>
				</div>
			</div>

			<ConfirmationDialog
				isOpen={showConfirmation}
				onConfirm={handleConfirmApply}
				onCancel={handleCancelApply}
				onClose={handleCloseConfirmation}
			/>
		</>
	)
}
