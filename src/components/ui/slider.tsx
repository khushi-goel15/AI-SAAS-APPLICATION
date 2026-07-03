"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  showTooltip?: boolean
  marks?: { value: number; label?: string }[]
  showValue?: boolean
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(
  (
    { className, showTooltip = false, marks, showValue = false, value, ...props },
    ref
  ) => {
    const [hoveredValue, setHoveredValue] = React.useState<number | null>(null)
    const [isHovering, setIsHovering] = React.useState(false)
    const thumbRef = React.useRef<HTMLSpanElement>(null)

    const currentValue = value?.[0] ?? 0

    return (
      <div className="w-full space-y-2">
        {showValue && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-secondary">
              {props.min ?? 0}
            </span>
            <span className="text-xs font-medium text-text-primary">
              {currentValue}
            </span>
            <span className="text-xs text-text-secondary">
              {props.max ?? 100}
            </span>
          </div>
        )}
        <SliderPrimitive.Root
          ref={ref}
          className={cn(
            "relative flex w-full touch-none select-none items-center py-1",
            className
          )}
          value={value}
          onValueChange={(val) => {
            props.onValueChange?.(val)
          }}
          {...props}
        >
          <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-surface-secondary">
            <SliderPrimitive.Range className="absolute h-full bg-primary" />
          </SliderPrimitive.Track>
          <SliderPrimitive.Thumb
            ref={thumbRef}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className={cn(
              "block h-4 w-4 rounded-full border-2 border-primary bg-white shadow-sm",
              "transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              "disabled:pointer-events-none disabled:opacity-50",
              "hover:bg-primary/5",
              "relative"
            )}
            aria-label="Slider value"
          >
            {showTooltip && isHovering && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 rounded-md bg-surface border border-border px-2 py-1 text-xs font-medium shadow-sm whitespace-nowrap">
                {currentValue}
              </span>
            )}
          </SliderPrimitive.Thumb>
        </SliderPrimitive.Root>
        {marks && marks.length > 0 && (
          <div className="relative w-full">
            <div className="flex justify-between px-[2px]">
              {marks.map((mark) => (
                <div key={mark.value} className="flex flex-col items-center">
                  <div className="h-1.5 w-0.5 bg-border rounded-full" />
                  {mark.label && (
                    <span className="text-[10px] text-text-tertiary mt-1">
                      {mark.label}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }
)
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
export type { SliderProps }
