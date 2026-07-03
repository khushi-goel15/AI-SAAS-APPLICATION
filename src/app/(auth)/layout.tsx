"use client"

import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === "dark"

  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return null

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: isDark
            ? "radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.15), transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(6,182,212,0.1), transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(245,158,11,0.08), transparent 50%)"
            : "radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.1), transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(6,182,212,0.08), transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(245,158,11,0.06), transparent 50%)",
        }}
      />
      <motion.div
        className="absolute inset-0 -z-10 opacity-30"
        animate={{
          background: [
            "radial-gradient(circle at 30% 40%, rgba(99,102,241,0.12) 0%, transparent 50%)",
            "radial-gradient(circle at 70% 60%, rgba(6,182,212,0.12) 0%, transparent 50%)",
            "radial-gradient(circle at 40% 80%, rgba(99,102,241,0.12) 0%, transparent 50%)",
            "radial-gradient(circle at 30% 40%, rgba(99,102,241,0.12) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${isDark ? "rgba(99,102,241,0.07)" : "rgba(99,102,241,0.06)"} 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="relative">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-shadow duration-300">
                <Sparkles className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight text-text-primary">
              AI <span className="text-gradient">Workspace</span>
            </span>
          </Link>
          <p className="mt-2 text-sm text-text-secondary">
            Your AI-Powered Productivity Suite
          </p>
        </div>
        {children}
      </motion.div>
    </div>
  )
}
