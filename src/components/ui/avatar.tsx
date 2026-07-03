"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const avatarVariants = cva(
  "relative inline-flex items-center justify-center overflow-hidden rounded-full bg-surface-secondary shrink-0",
  {
    variants: {
      size: {
        xs: "h-6 w-6 text-[10px]",
        sm: "h-8 w-8 text-xs",
        md: "h-10 w-10 text-sm",
        lg: "h-12 w-12 text-base",
        xl: "h-16 w-16 text-lg",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

const statusVariants = cva(
  "absolute bottom-0 right-0 block rounded-full ring-2 ring-surface",
  {
    variants: {
      size: {
        xs: "h-1.5 w-1.5",
        sm: "h-2 w-2",
        md: "h-2.5 w-2.5",
        lg: "h-3 w-3",
        xl: "h-3.5 w-3.5",
      },
      status: {
        online: "bg-success",
        offline: "bg-text-tertiary",
        away: "bg-warning",
        busy: "bg-error",
      },
    },
    defaultVariants: {
      size: "md",
      status: "online",
    },
  }
)

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl"

interface AvatarProps
  extends React.ImgHTMLAttributes<HTMLImageElement>,
    VariantProps<typeof avatarVariants> {
  src?: string
  alt?: string
  fallback?: string
  status?: "online" | "offline" | "away" | "busy"
  fallbackDelay?: number
}

const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  (
    {
      className,
      size = "md",
      src,
      alt = "",
      fallback,
      status,
      fallbackDelay = 600,
      ...props
    },
    ref
  ) => {
    const [showFallback, setShowFallback] = React.useState(!src)

    React.useEffect(() => {
      if (!src) {
        setShowFallback(true)
        return
      }
      setShowFallback(false)
    }, [src])

    const handleError = () => {
      if (fallbackDelay > 0) {
        setTimeout(() => setShowFallback(true), fallbackDelay)
      } else {
        setShowFallback(true)
      }
    }

    return (
      <span
        ref={ref}
        className={cn(avatarVariants({ size }), "relative", className)}
        role="img"
        aria-label={alt || fallback || "Avatar"}
      >
        {!showFallback && src ? (
          <img
            src={src}
            alt={alt}
            onError={handleError}
            className="h-full w-full object-cover"
            {...props}
          />
        ) : (
          <span aria-hidden="true" className="font-medium text-text-secondary">
            {fallback || "?"}
          </span>
        )}
        {status && (
          <span
            className={cn(statusVariants({ size, status }))}
            aria-label={status}
            role="status"
          />
        )}
      </span>
    )
  }
)
Avatar.displayName = "Avatar"

interface AvatarGroupProps {
  children: React.ReactNode
  max?: number
  size?: AvatarSize
  className?: string
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ children, max = 4, size = "md", className }, ref) => {
    const childrenArray = React.Children.toArray(children)
    const visibleAvatars = childrenArray.slice(0, max)
    const remaining = childrenArray.length - max

    const overlapMap: Record<AvatarSize, string> = {
      xs: "-ml-1.5",
      sm: "-ml-2",
      md: "-ml-2.5",
      lg: "-ml-3",
      xl: "-ml-4",
    }

    return (
      <div
        ref={ref}
        className={cn("flex items-center", className)}
        role="group"
        aria-label="Avatar group"
      >
        {visibleAvatars.map((child, i) =>
          React.isValidElement(child)
            ? React.cloneElement(child, {
                key: i,
                size,
                className: cn(
                  overlapMap[size],
                  i === 0 && "ml-0",
                  "ring-2 ring-surface"
                ),
              } as Partial<AvatarProps>)
            : child
        )}
        {remaining > 0 && (
          <span
            className={cn(
              avatarVariants({ size }),
              overlapMap[size],
              "ring-2 ring-surface text-xs font-medium text-text-secondary"
            )}
            aria-label={`${remaining} more`}
          >
            +{remaining}
          </span>
        )}
      </div>
    )
  }
)
AvatarGroup.displayName = "AvatarGroup"

export { Avatar, AvatarGroup }
export type { AvatarProps, AvatarGroupProps, AvatarSize }
