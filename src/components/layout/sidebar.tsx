"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  MessageSquare,
  Pen,
  Code,
  Image,
  FileText,
  Languages,
  FileSearch,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Settings,
  CreditCard,
  Users,
  BarChart3,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useSidebarStore } from "@/store/use-sidebar-store"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "AI Chat", href: "/chat", icon: MessageSquare },
  { label: "AI Writer", href: "/writer", icon: Pen },
  { label: "Code Generator", href: "/code-generator", icon: Code },
  { label: "Image Generator", href: "/image-generator", icon: Image },
  { label: "Resume Builder", href: "/resume-builder", icon: FileText },
  { label: "Translator", href: "/translator", icon: Languages },
  { label: "PDF Analyzer", href: "/pdf-analyzer", icon: FileSearch },
]

const bottomItems = [
  { label: "Billing", href: "/billing", icon: CreditCard, role: "user" as const },
  { label: "Settings", href: "/settings", icon: Settings, role: "user" as const },
  { label: "Admin", href: "/admin", icon: BarChart3, role: "admin" as const },
]

export function Sidebar() {
  const pathname = usePathname()
  const { isOpen, isCollapsed, toggle } = useSidebarStore()

  const sidebarWidth = isCollapsed ? "w-[72px]" : "w-64"
  const displayMode = isCollapsed ? "collapsed" : "expanded"

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        layout
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen flex-col border-r bg-surface/80 backdrop-blur-xl",
          sidebarWidth,
          "transition-all duration-300 ease-in-out"
        )}
        aria-label="Main navigation sidebar"
      >
        <div className="flex h-16 items-center gap-3 border-b border-border/50 px-4">
          <motion.div
            layout
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700"
          >
            <Sparkles className="h-5 w-5 text-white" />
          </motion.div>
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="text-lg font-bold tracking-tight"
              >
                AI Workspace
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3 scrollbar-hide" role="navigation" aria-label="Main navigation">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary/10 text-primary shadow-sm"
                        : "text-text-secondary hover:bg-surface-secondary hover:text-text-primary"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary")} />
                    <AnimatePresence mode="wait">
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-y-0 left-0 w-0.5 rounded-full bg-primary"
                      />
                    )}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
              </Tooltip>
            )
          })}
        </nav>

        <div className="border-t border-border/50 p-3">
          {bottomItems.slice(0, 2).map((item) => {
            const isActive = pathname === item.href
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-text-secondary hover:bg-surface-secondary hover:text-text-primary"
                    )}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    <AnimatePresence mode="wait">
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                </TooltipTrigger>
                {isCollapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
              </Tooltip>
            )
          })}

          <div className="mt-2 flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggle}
              className="h-8 w-full justify-center rounded-lg text-text-secondary hover:text-text-primary"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </motion.aside>
    </TooltipProvider>
  )
}
