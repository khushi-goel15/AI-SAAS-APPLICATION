"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  autoResize?: boolean
  maxLength?: number
  showCharCount?: boolean
  containerClassName?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      containerClassName,
      label,
      error,
      helperText,
      autoResize = true,
      maxLength,
      showCharCount = false,
      id,
      value,
      onChange,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId()
    const textareaId = id || generatedId
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null)
    const [charCount, setCharCount] = React.useState(
      typeof value === "string" ? value.length : 0
    )

    const setRef = React.useCallback(
      (node: HTMLTextAreaElement | null) => {
        textareaRef.current = node
        if (typeof ref === "function") ref(node)
        else if (ref) ref.current = node
      },
      [ref]
    )

    const adjustHeight = React.useCallback(() => {
      const textarea = textareaRef.current
      if (textarea && autoResize) {
        textarea.style.height = "auto"
        textarea.style.height = `${textarea.scrollHeight}px`
      }
    }, [autoResize])

    React.useEffect(() => {
      adjustHeight()
    }, [value, adjustHeight])

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length)
      onChange?.(e)
    }

    return (
      <div className={cn("w-full space-y-1.5", containerClassName)}>
        {(label || (showCharCount && maxLength)) && (
          <div className="flex items-center justify-between">
            {label && (
              <label
                htmlFor={textareaId}
                className={cn(
                  "block text-sm font-medium text-text-primary",
                  disabled && "opacity-50"
                )}
              >
                {label}
              </label>
            )}
            {showCharCount && maxLength && (
              <span
                className={cn(
                  "text-xs",
                  charCount > maxLength * 0.9
                    ? "text-error"
                    : charCount > maxLength * 0.75
                    ? "text-warning"
                    : "text-text-tertiary"
                )}
              >
                {charCount}/{maxLength}
              </span>
            )}
          </div>
        )}
        <textarea
          ref={setRef}
          id={textareaId}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          maxLength={maxLength}
          aria-invalid={!!error}
          aria-describedby={
            error
              ? `${textareaId}-error`
              : helperText
              ? `${textareaId}-helper`
              : undefined
          }
          className={cn(
            "flex min-h-[80px] w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary",
            "transition-colors duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-secondary",
            error &&
              "border-error focus-visible:ring-error/50 hover:border-error",
            autoResize && "resize-none overflow-hidden",
            className
          )}
          rows={4}
          {...props}
        />
        {error && (
          <p
            id={`${textareaId}-error`}
            className="text-sm text-error flex items-center gap-1.5"
            role="alert"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p
            id={`${textareaId}-helper`}
            className="text-sm text-text-tertiary"
          >
            {helperText}
          </p>
        )}
        {showCharCount && !maxLength && (
          <p className="text-xs text-text-tertiary text-right">
            {charCount} characters
          </p>
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
export type { TextareaProps }
