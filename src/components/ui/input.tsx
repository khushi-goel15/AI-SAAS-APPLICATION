"use client"

import * as React from "react"
import { AlertCircle, Eye, EyeOff, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  showPasswordToggle?: boolean
  showClearButton?: boolean
  containerClassName?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      containerClassName,
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      showPasswordToggle = false,
      showClearButton = false,
      id,
      type = "text",
      value,
      onChange,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId()
    const inputId = id || generatedId
    const [showPassword, setShowPassword] = React.useState(false)
    const [hasValue, setHasValue] = React.useState(false)

    const inputType = showPasswordToggle && showPassword ? "text" : type

    React.useEffect(() => {
      setHasValue(value !== undefined && value !== "" && value !== null)
    }, [value])

    const handleClear = () => {
      if (onChange) {
        const syntheticEvent = {
          target: { value: "" },
          currentTarget: { value: "" },
        } as React.ChangeEvent<HTMLInputElement>
        onChange(syntheticEvent)
      }
      setHasValue(false)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value !== "")
      onChange?.(e)
    }

    return (
      <div className={cn("w-full space-y-1.5", containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "block text-sm font-medium text-text-primary",
              disabled && "opacity-50"
            )}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            value={value}
            onChange={handleChange}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            className={cn(
              "flex h-10 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary",
              "transition-colors duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-secondary",
              "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-text-primary",
              error &&
                "border-error focus-visible:ring-error/50 hover:border-error",
              leftIcon && "pl-10",
              (rightIcon || showPasswordToggle || showClearButton) && "pr-10",
              "autofill:bg-surface autofill:text-text-primary",
              className
            )}
            {...props}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {showClearButton && hasValue && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="text-text-tertiary hover:text-text-primary transition-colors p-0.5"
                aria-label="Clear input"
                tabIndex={-1}
              >
                <X className="h-4 w-4" />
              </button>
            )}
            {showPasswordToggle && type === "password" && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-text-tertiary hover:text-text-primary transition-colors p-0.5"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            )}
            {rightIcon && !showPasswordToggle && !showClearButton && (
              <span className="text-text-tertiary pointer-events-none">
                {rightIcon}
              </span>
            )}
            {error && !showClearButton && !showPasswordToggle && !rightIcon && (
              <AlertCircle
                className="h-4 w-4 text-error shrink-0"
                aria-hidden="true"
              />
            )}
          </div>
        </div>
        {error && (
          <p
            id={`${inputId}-error`}
            className="text-sm text-error flex items-center gap-1.5"
            role="alert"
          >
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {error}
          </p>
        )}
        {helperText && !error && (
          <p
            id={`${inputId}-helper`}
            className="text-sm text-text-tertiary"
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
export type { InputProps }
