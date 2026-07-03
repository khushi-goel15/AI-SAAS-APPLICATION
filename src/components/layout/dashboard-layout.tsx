"use client"

import { Sidebar } from "./sidebar"
import { Navbar } from "./navbar"
import { useSidebarStore } from "@/store/use-sidebar-store"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebarStore()

  return (
    <div className="min-h-screen bg-surface-secondary/50">
      <Sidebar />
      <div
        className={`transition-all duration-300 ease-in-out ${
          isCollapsed ? "ml-[72px]" : "ml-64"
        }`}
      >
        <Navbar />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
