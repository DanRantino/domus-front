import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import { createContext, useContext, useState, type ReactNode } from 'react'

export type ToastSeverity = 'error' | 'success' | 'info'

export type Toast = {
  message: string
  severity: ToastSeverity
}

type ToastContextValue = {
  showToast: (toast: Toast) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [toast, setToast] = useState<Toast>({ message: '', severity: 'info' })

  return (
    <ToastContext.Provider
      value={{
        showToast: (next) => {
          setToast(next)
          setOpen(true)
        },
      }}
    >
      {children}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={toast.severity}
          variant="filled"
          onClose={() => setOpen(false)}
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
