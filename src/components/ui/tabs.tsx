"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"

const Tabs = TabsPrimitive.Root

const tabsListVariants = cva(
  "inline-flex items-center",
  {
    variants: {
      variant: {
        underline:
          "border-b border-border w-full gap-0",
        pills:
          "rounded-xl bg-surface-secondary p-1 gap-0",
        segmented:
          "rounded-xl border border-border p-0.5 gap-0 bg-surface",
      },
    },
    defaultVariants: {
      variant: "underline",
    },
  }
)

interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {}

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, variant, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(tabsListVariants({ variant, className }))}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
  icon?: React.ReactNode
}

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, children, icon, value, ...props }, ref) => {
  const [isActive, setIsActive] = React.useState(false)

  return (
    <TabsPrimitive.Trigger
      value={value}
      className={cn(
        "group relative inline-flex items-center justify-center whitespace-nowrap px-4 py-2.5 text-sm font-medium transition-all duration-200",
        "data-[state=inactive]:text-text-tertiary data-[state=inactive]:hover:text-text-secondary",
        "data-[state=active]:text-primary",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
      ref={(node) => {
        if (typeof ref === "function") ref(node)
        else if (ref) ref.current = node
        if (node) {
          setIsActive(node.getAttribute("data-state") === "active")
        }
      }}
    >
      {icon && (
        <span className="mr-2 h-4 w-4 shrink-0" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </TabsPrimitive.Trigger>
  )
})
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-4 ring-offset-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

const TabsUnderlineIndicator = ({
  containerRef,
  activeTriggerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>
  activeTriggerRef: React.RefObject<HTMLButtonElement | null>
}) => {
  const [indicatorStyle, setIndicatorStyle] = React.useState({ left: 0, width: 0 })

  React.useEffect(() => {
    const updateIndicator = () => {
      if (activeTriggerRef.current && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect()
        const triggerRect = activeTriggerRef.current.getBoundingClientRect()
        setIndicatorStyle({
          left: triggerRect.left - containerRect.left,
          width: triggerRect.width,
        })
      }
    }

    updateIndicator()
    const observer = new ResizeObserver(updateIndicator)
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [activeTriggerRef, containerRef])

  return (
    <motion.div
      className="absolute bottom-0 h-0.5 bg-primary"
      layout
      layoutId="tab-underline"
      style={indicatorStyle}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    />
  )
}

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsUnderlineIndicator,
  tabsListVariants,
}
export type { TabsListProps, TabsTriggerProps }
