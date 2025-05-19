"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type Toast = {
  id: string
  title: string
  description?: string
  variant?: "default" | "destructive" | "success"
}

type ToastContextType = {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, "id">) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { ...toast, id }])

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      removeToast(id)
    }, 5000)
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}

      {/* Render toasts */}
      <div className="fixed bottom-0 right-0 p-4 space-y-4 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-lg shadow-lg p-4 transition-all transform ${
              toast.variant === "destructive"
                ? "bg-red-500 text-white"
                : toast.variant === "success"
                  ? "bg-green-500 text-white"
                  : "bg-white text-gray-900"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{toast.title}</h3>
                {toast.description && <p className="text-sm mt-1">{toast.description}</p>}
              </div>
              <button onClick={() => removeToast(toast.id)} className="ml-4 text-sm">
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
