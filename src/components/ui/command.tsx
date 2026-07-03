"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Search, X, Command as CommandIcon } from "lucide-react"

interface CommandDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

function CommandDialog({ open, onOpenChange, children }: CommandDialogProps) {
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [open, onOpenChange])

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay asChild>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />
        </DialogPrimitive.Overlay>
        <DialogPrimitive.Content asChild>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "fixed left-1/2 top-[15%] z-50 w-full max-w-lg",
              "rounded-xl border border-border bg-surface shadow-2xl",
              "focus:outline-none"
            )}
          >
            {children}
          </motion.div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

interface CommandInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string
  onValueChange?: (value: string) => void
}

const CommandInput = React.forwardRef<HTMLInputElement, CommandInputProps>(
  ({ className, placeholder = "Type a command or search...", onValueChange, onChange, ...props }, ref) => {
    return (
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <Search className="h-4 w-4 shrink-0 text-text-tertiary" />
        <input
          ref={ref}
          className={cn(
            "flex h-8 w-full bg-transparent text-sm text-text-primary placeholder:text-text-tertiary outline-none",
            className
          )}
          placeholder={placeholder}
          onChange={(e) => {
            onValueChange?.(e.target.value)
            onChange?.(e)
          }}
          autoFocus
          {...props}
        />
        <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded-md border border-border bg-surface-secondary px-1.5 py-0.5 text-[10px] font-medium text-text-tertiary">
          <CommandIcon className="h-3 w-3" />
          K
        </kbd>
        <DialogPrimitive.Close className="text-text-tertiary hover:text-text-primary transition-colors">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </div>
    )
  }
)
CommandInput.displayName = "CommandInput"

interface CommandGroupProps {
  heading?: string
  children: React.ReactNode
  className?: string
}

const CommandGroup = React.forwardRef<HTMLDivElement, CommandGroupProps>(
  ({ className, heading, children }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("overflow-hidden p-1", className)}
        role="group"
        aria-label={heading}
      >
        {heading && (
          <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
            {heading}
          </div>
        )}
        {children}
      </div>
    )
  }
)
CommandGroup.displayName = "CommandGroup"

interface CommandItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  onSelect?: (value: string) => void
  value?: string
  shortcut?: string
  icon?: React.ReactNode
  disabled?: boolean
}

const CommandItem = React.forwardRef<HTMLDivElement, CommandItemProps>(
  (
    {
      className,
      onSelect,
      value = "",
      shortcut,
      icon,
      disabled,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        role="option"
        aria-disabled={disabled}
        data-value={value}
        className={cn(
          "relative flex cursor-default select-none items-center rounded-lg px-3 py-2.5 text-sm outline-none",
          "transition-colors duration-150",
          "aria-selected:bg-surface-secondary aria-selected:text-text-primary",
          "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          "hover:bg-surface-secondary cursor-pointer",
          className
        )}
        onClick={(e) => {
          if (!disabled) {
            onSelect?.(value)
            onClick?.(e)
          }
        }}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !disabled) {
            onSelect?.(value)
          }
        }}
        {...props}
      >
        {icon && (
          <span className="mr-2 flex h-4 w-4 items-center justify-center text-text-tertiary shrink-0">
            {icon}
          </span>
        )}
        <span className="flex-1 truncate">{children}</span>
        {shortcut && (
          <kbd className="ml-auto text-[10px] text-text-tertiary bg-surface-secondary rounded px-1.5 py-0.5 border border-border">
            {shortcut}
          </kbd>
        )}
      </div>
    )
  }
)
CommandItem.displayName = "CommandItem"

interface CommandListProps {
  children: React.ReactNode
  className?: string
}

const CommandList = React.forwardRef<HTMLDivElement, CommandListProps>(
  ({ className, children }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "max-h-[300px] overflow-y-auto overflow-x-hidden p-1",
          "scrollbar-custom",
          className
        )}
        role="listbox"
      >
        {children}
      </div>
    )
  }
)
CommandList.displayName = "CommandList"

interface CommandEmptyProps {
  children?: React.ReactNode
  className?: string
}

const CommandEmpty = React.forwardRef<HTMLDivElement, CommandEmptyProps>(
  ({ className, children = "No results found." }, ref) => (
    <div
      ref={ref}
      className={cn("py-6 text-center text-sm text-text-tertiary", className)}
      role="status"
    >
      {children}
    </div>
  )
)
CommandEmpty.displayName = "CommandEmpty"

interface CommandLoadingProps {
  className?: string
}

const CommandLoading = React.forwardRef<HTMLDivElement, CommandLoadingProps>(
  ({ className }, ref) => (
    <div
      ref={ref}
      className={cn("py-6 text-center text-sm text-text-tertiary", className)}
      role="status"
      aria-label="Loading"
    >
      <div className="inline-flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" />
        <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.1s]" />
        <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
      </div>
    </div>
  )
)
CommandLoading.displayName = "CommandLoading"

export {
  CommandDialog,
  CommandInput,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandEmpty,
  CommandLoading,
}
export type {
  CommandDialogProps,
  CommandInputProps,
  CommandGroupProps,
  CommandItemProps,
  CommandListProps,
  CommandEmptyProps,
  CommandLoadingProps,
}
