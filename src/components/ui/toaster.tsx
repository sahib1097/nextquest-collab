
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} className="pixel-border bg-gradient-to-r from-amber-900 to-amber-800 text-amber-100 font-medium shadow-lg">
            <div className="grid gap-1">
              {title && <ToastTitle className="text-amber-100">{title}</ToastTitle>}
              {description && (
                <ToastDescription className="text-amber-200">{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className="text-amber-200 hover:text-amber-100" />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}

