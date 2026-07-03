"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { AlertCircle } from "lucide-react"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50 transition-colors duration-200",
  {
    variants: {
      variant: {
        default: "text-text-primary",
        error: "text-error",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {
  required?: boolean
  helperText?: string
}

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, variant, required, helperText, children, ...props }, ref) => {
  const generatedId = React.useId()
  const helperId = `${generatedId}-helper`

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1">
        <LabelPrimitive.Root
          ref={ref}
          className={cn(labelVariants({ variant, className }))}
          {...props}
        >
          {children}
          {required && (
            <span className="ml-0.5 text-error" aria-hidden="true">
              *
            </span>
          )}
        </LabelPrimitive.Root>
        {variant === "error" && (
          <AlertCircle className="h-3.5 w-3.5 text-error" aria-hidden="true" />
        )}
      </div>
      {helperText && (
        <p
          id={helperId}
          className={cn(
            "text-xs",
            variant === "error" ? "text-error" : "text-text-tertiary"
          )}
        >
          {helperText}
        </p>
      )}
    </div>
  )
})
Label.displayName = LabelPrimitive.Root.displayName

export { Label, labelVariants }
export type { LabelProps }
