"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-surface disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-white hover:bg-primary-600 active:bg-primary-700 shadow-sm shadow-primary/20",
        secondary:
          "bg-surface-secondary text-text-primary hover:bg-surface-tertiary active:bg-border border border-border",
        outline:
          "border-2 border-border bg-transparent text-text-primary hover:bg-surface-secondary active:bg-surface-tertiary",
        ghost:
          "bg-transparent text-text-primary hover:bg-surface-secondary active:bg-surface-tertiary",
        danger:
          "bg-error text-white hover:bg-error-600 active:bg-error shadow-sm shadow-error/20",
        success:
          "bg-success text-white hover:bg-success-600 active:bg-success shadow-sm shadow-success/20",
      },
      size: {
        sm: "h-8 px-3 text-xs gap-1.5",
        md: "h-10 px-4 text-sm gap-2",
        lg: "h-12 px-6 text-base gap-2.5",
        xl: "h-14 px-8 text-lg gap-3",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading = false,
      icon,
      iconPosition = "left",
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const rippleRef = React.useRef<HTMLSpanElement>(null)

    const handleRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
      const button = e.currentTarget
      const rect = button.getBoundingClientRect()
      const ripple = document.createElement("span")
      const size = Math.max(rect.width, rect.height)
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2

      ripple.style.width = ripple.style.height = `${size}px`
      ripple.style.left = `${x}px`
      ripple.style.top = `${y}px`
      ripple.className =
        "absolute rounded-full bg-white/30 animate-scale-in pointer-events-none"

      button.appendChild(ripple)
      setTimeout(() => ripple.remove(), 600)
    }

    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || loading}
        onClick={(e) => {
          if (!disabled && !loading) handleRipple(e)
          props.onClick?.(e)
        }}
        aria-busy={loading}
        aria-disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden="true" />
        )}
        {!loading && icon && iconPosition === "left" && (
          <span className="shrink-0" aria-hidden="true">
            {icon}
          </span>
        )}
        {children && <span className="truncate">{children}</span>}
        {!loading && icon && iconPosition === "right" && (
          <span className="shrink-0" aria-hidden="true">
            {icon}
          </span>
        )}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
export type { ButtonProps }
