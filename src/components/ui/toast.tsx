"use client"

import * as React from "react"
import { Toaster as SonnerToaster, toast as sonnerToast } from "sonner"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from "lucide-react"
import type { ExternalToast } from "sonner"

type ToastVariant = "success" | "error" | "warning" | "info"

interface ToastProps extends ExternalToast {
  message: string
  description?: string
  variant?: ToastVariant
  action?: {
    label: string
    onClick: () => void
  }
  showProgress?: boolean
}

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between gap-3 overflow-hidden rounded-xl border p-4 shadow-lg transition-all duration-300",
  {
    variants: {
      variant: {
        success:
          "border-success/20 bg-success/5 dark:bg-success/10",
        error:
          "border-error/20 bg-error/5 dark:bg-error/10",
        warning:
          "border-warning/20 bg-warning/5 dark:bg-warning/10",
        info:
          "border-primary/20 bg-primary/5 dark:bg-primary/10",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
)

const iconMap: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle className="h-5 w-5 text-success shrink-0" />,
  error: <AlertCircle className="h-5 w-5 text-error shrink-0" />,
  warning: <AlertTriangle className="h-5 w-5 text-warning shrink-0" />,
  info: <Info className="h-5 w-5 text-primary shrink-0" />,
}

function toast({ message, description, variant = "info", action, showProgress, ...props }: ToastProps) {
  return sonnerToast.custom(
    (t) => (
      <div className={cn(toastVariants({ variant }))}>
        {iconMap[variant]}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-primary">{message}</p>
          {description && (
            <p className="text-xs text-text-secondary mt-0.5">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {action && (
            <button
              onClick={() => {
                action.onClick()
                sonnerToast.dismiss(t)
              }}
              className="text-xs font-medium text-primary hover:text-primary-600 transition-colors"
            >
              {action.label}
            </button>
          )}
          <button
            onClick={() => sonnerToast.dismiss(t)}
            className="text-text-tertiary hover:text-text-primary transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {showProgress && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-border overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-[5000ms] linear",
                variant === "success" && "bg-success",
                variant === "error" && "bg-error",
                variant === "warning" && "bg-warning",
                variant === "info" && "bg-primary"
              )}
              style={{ width: "100%" }}
              onAnimationEnd={() => sonnerToast.dismiss(t)}
            />
          </div>
        )}
      </div>
    ),
    {
      duration: showProgress ? 5000 : 4000,
      ...props,
    }
  )
}

function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        style: {
          background: "transparent",
          border: "none",
          boxShadow: "none",
          padding: 0,
        },
      }}
      className="toaster group"
      closeButton={false}
      richColors={false}
    />
  )
}

export { toast, Toaster }
export type { ToastProps, ToastVariant }
