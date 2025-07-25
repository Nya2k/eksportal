"use client"

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface ConfirmationDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    description: string
    confirmText?: string
    cancelText?: string
}

export default function ConfirmationDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel"
}: ConfirmationDialogProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted || !isOpen) return null

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    const dialogContent = (
        <div 
            className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-6 w-full max-w-sm mx-auto">
                <div className="flex flex-col space-y-2 text-center mb-6">
                    <h2 className="text-lg font-semibold text-white">
                        {title}
                    </h2>
                    <p className="text-sm text-slate-300">
                        {description}
                    </p>
                </div>
                
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-slate-700 text-slate-300 hover:bg-slate-600 px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    )

    return createPortal(dialogContent, document.body)
}
