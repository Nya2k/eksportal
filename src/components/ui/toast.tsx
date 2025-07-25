"use client"

import { X } from "lucide-react"
import * as React from "react"
import { createPortal } from "react-dom"

interface ToastProps {
    message: string
    type?: 'info' | 'success' | 'warning' | 'error'
    duration?: number
    onClose: () => void
}

const Toast: React.FC<ToastProps> = ({ message, type = 'info', duration = 3000, onClose }) => {
    React.useEffect(() => {
        const timer = setTimeout(() => {
            onClose()
        }, duration)

        return () => clearTimeout(timer)
    }, [duration, onClose])

    const bgColor = {
        info: 'bg-blue-600',
        success: 'bg-green-600',
        warning: 'bg-yellow-600',
        error: 'bg-red-600'
    }[type]

    return createPortal(
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-right duration-300">
            <div className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-sm`}>
                <span className="text-sm">{message}</span>
                <button
                    onClick={onClose}
                    className="text-white hover:text-gray-200 transition-colors"
                    title="Tutup notifikasi"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>,
        document.body
    )
}

// Toast context for global toast management
interface ToastContextType {
    showToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = React.useState<Array<{ id: string; message: string; type: 'info' | 'success' | 'warning' | 'error' }>>([])

    const showToast = React.useCallback((message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
        const id = Math.random().toString(36).substr(2, 9)
        setToasts(prev => [...prev, { id, message, type }])
    }, [])

    const removeToast = React.useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id))
    }, [])

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toasts.map(toast => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </ToastContext.Provider>
    )
}

export const useToast = () => {
    const context = React.useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider')
    }
    return context
}
