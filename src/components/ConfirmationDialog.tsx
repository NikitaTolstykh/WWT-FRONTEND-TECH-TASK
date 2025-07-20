import React from 'react'
import { useTranslation } from 'react-i18next'

import { X } from 'lucide-react'

interface ConfirmationDialogProps {
	isOpen: boolean
	onConfirm: () => void
	onCancel: () => void
	onClose: () => void
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
	isOpen,
	onConfirm,
	onCancel,
	onClose
}) => {
	const { t } = useTranslation()

	if (!isOpen) {
		return null
	}

	return (
		<div className="fixed inset-0 z-[60] bg-black bg-opacity-50 flex items-center justify-center">
			<div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
				<div className="flex justify-between items-center mb-4">
					<h3 className="text-lg font-semibold">
						{t('filter.confirmDialog.title', 'Do you want to apply new filter')}
					</h3>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				<div className="flex gap-3 justify-end">
					<button
						onClick={onCancel}
						className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
					>
						{t('filter.confirmDialog.useOld', 'Use old filter')}
					</button>
					<button
						onClick={onConfirm}
						className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md font-medium"
					>
						{t('filter.confirmDialog.applyNew', 'Apply new filter')}
					</button>
				</div>
			</div>
		</div>
	)
}
