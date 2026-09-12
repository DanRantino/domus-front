import { createContext } from 'react'

export type ToastSeverity = 'error' | 'success' | 'info'

export type Toast = {
  message: string
  severity: ToastSeverity
}

export type ToastContextValue = {
  showToast: (toast: Toast) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)
