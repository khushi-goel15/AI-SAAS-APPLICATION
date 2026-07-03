"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import {
  MessageSquare,
  Pen,
  Code,
  Image,
  Sparkles,
  ArrowRight,
  Clock,
  BarChart3,
  Zap,
  TrendingUp,
  type LucideIcon,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { useAuthStore } from "@/store/use-auth-store"
import { AI_TOOLS } from "@/constants"
import { formatNumber, formatBytes, cn, getInitials } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

interface QuickAction {
  label: string
  icon: LucideIcon
  href: string
  gradient: string
}

const QUICK_ACTIONS: QuickAction[] = [
  { label: "New Chat", icon: MessageSquare, href: "/chat", gradient: "from-violet-500 to-purple-500" },
  { label: "Write Content", icon: Pen, href: "/writer", gradient: "from-blue-500 to-cyan-500" },
  { label: "Generate Code", icon: Code, href: "/code-generator", gradient: "from-emerald-500 to-green-500" },
  { label: "Create Image", icon: Image, href: "/image-generator", gradient: "from-pink-500 to-rose-500" },
]

const MOCK_ACTIVITIES = [
  { id: "1", title: "Website redesign chat", type: "chat", time: "2 min ago", icon: MessageSquare },
  { id: "2", title: "Blog post draft", type: "writer", time: "15 min ago", icon: Pen },
  { id: "3", title: "React component generator", type: "code", time: "1 hour ago", icon: Code },
  { id: "4", title: "Product mockup", type: "image", time: "3 hours ago", icon: Image },
  { id: "5", title: "Resume updated", type: "resume", time: "5 hours ago", icon: Pen },
  { id: "6", title: "PDF analysis report", type: "pdf", time: "1 day ago", icon: Code },
]

const CHART_DATA = [
  { day: "Mon", queries: 12, words: 2400 },
  { day: "Tue", queries: 19, words: 3800 },
  { day: "Wed", queries: 15, words: 2200 },
  { day: "Thu", queries: 27, words: 5100 },
  { day: "Fri", queries: 22, words: 4300 },
  { day: "Sat", queries: 8, words: 1200 },
  { day: "Sun", queries: 14, words: 2800 },
]

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

function getGreetingEmoji(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "🌅"
  if (hour < 17) return "☀️"
  return "🌙"
}

function formatDate(): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date())
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

const chartVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
}

interface StatCardProps {
  label: string
  used: number
  limit: number
  icon: LucideIcon
  gradient: string
  format?: "number" | "bytes"
}

function StatCard({ label, used, limit, icon: Icon, gradient, format = "number" }: StatCardProps) {
  const percentage = Math.min((used / limit) * 100, 100)
  const formattedUsed = format === "bytes" ? formatBytes(used) : formatNumber(used)
  const formattedLimit = format === "bytes" ? formatBytes(limit) : formatNumber(limit)

  const progressVariant = percentage >= 90 ? "error" : percentage >= 75 ? "warning" : percentage >= 50 ? "primary" : "default"

  return (
    <motion.div variants={itemVariants}>
      <Card variant="glass" className="group h-full">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className={cn("inline-flex p-2.5 rounded-xl bg-gradient-to-br", gradient)}>
              <Icon className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <Badge variant={progressVariant} size="sm">
              {Math.round(percentage)}%
            </Badge>
          </div>
          <p className="text-sm text-text-secondary mb-1">{label}</p>
          <p className="text-lg font-semibold text-text-primary mb-3">
            {formattedUsed}
            <span className="text-sm font-normal text-text-tertiary"> / {formattedLimit}</span>
          </p>
          <Progress value={used} max={limit} variant={progressVariant} aria-label={`${label}: ${Math.round(percentage)}% used`} />
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface ToolCardProps {
  title: string
  description: string
  icon: LucideIcon
  href: string
  color: string
  index: number
}

function ToolCard({ title, description, icon: Icon, href, color, index }: ToolCardProps) {
  return (
    <motion.div
      variants={itemVariants}
      custom={index}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <a
        href={href}
        className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
        aria-label={`Open ${title}`}
      >
        <Card variant="glass" className="group h-full cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
          <CardContent className="p-5">
            <div className={cn("inline-flex p-3 rounded-xl bg-gradient-to-br", color, "mb-4 group-hover:scale-110 transition-transform duration-300")}>
              <Icon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <h3 className="font-semibold text-text-primary mb-1.5">{title}</h3>
            <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
          </CardContent>
        </Card>
      </a>
    </motion.div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-3">
        <Skeleton variant="text" className="h-8 w-72" />
        <Skeleton variant="text" className="h-5 w-96" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} variant="card" className="h-32" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} variant="card" className="h-40" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Skeleton variant="card" className="h-72" />
        <Skeleton variant="card" className="h-72" />
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user, isLoading } = useAuthStore()

  const greeting = useMemo(() => getGreeting(), [])
  const emoji = useMemo(() => getGreetingEmoji(), [])
  const date = useMemo(() => formatDate(), [])

  if (isLoading) return <DashboardSkeleton />

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]" role="status">
        <Card variant="glass" className="p-8 text-center max-w-md">
          <CardContent className="pt-4">
            <p className="text-text-secondary">No user data available. Please sign in again.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const usage = user.usage

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto"
    >
      <motion.section variants={itemVariants} aria-labelledby="welcome-heading">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-3xl" role="img" aria-label="Greeting emoji">
                {emoji}
              </span>
              <h1 id="welcome-heading" className="text-2xl md:text-3xl font-bold text-text-primary">
                {greeting}, {user.name.split(" ")[0]}!
              </h1>
              <motion.span
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, -10, 10, -5, 0] }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-2xl"
                role="img"
                aria-label="Sparkle"
              >
                ✨
              </motion.span>
            </div>
            <p className="text-text-secondary flex items-center gap-2">
              <Clock className="h-4 w-4" aria-hidden="true" />
              <time dateTime={new Date().toISOString().split("T")[0]}>{date}</time>
            </p>
          </div>
          <Avatar
            size="lg"
            src={user.avatar}
            fallback={getInitials(user.name)}
            alt={user.name}
          />
        </div>
      </motion.section>

      <section aria-labelledby="quick-actions-heading">
        <div className="flex items-center justify-between mb-4">
          <h2 id="quick-actions-heading" className="text-lg font-semibold text-text-primary flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" aria-hidden="true" />
            Quick Actions
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3" role="list" aria-label="Quick actions">
          {QUICK_ACTIONS.map((action) => (
            <motion.div key={action.label} variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <a
                href={action.href}
                role="listitem"
                aria-label={action.label}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 border-2 border-border bg-transparent text-text-primary hover:bg-surface-secondary active:bg-surface-tertiary w-full h-auto flex-col py-4 px-3 gap-2 group"
              >
                <div className={cn("inline-flex p-2.5 rounded-xl bg-gradient-to-br", action.gradient, "group-hover:scale-110 transition-transform duration-300")}>
                  <action.icon className="h-5 w-5 text-white" aria-hidden="true" />
                </div>
                <span className="text-sm font-medium">{action.label}</span>
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      <section aria-labelledby="usage-stats-heading">
        <div className="flex items-center justify-between mb-4">
          <h2 id="usage-stats-heading" className="text-lg font-semibold text-text-primary flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" aria-hidden="true" />
            Usage Statistics
          </h2>
          <Badge variant="secondary" size="sm">
            <TrendingUp className="h-3 w-3 mr-1" aria-hidden="true" />
            Updated just now
          </Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Chat Queries"
            used={usage.chatQueries}
            limit={usage.chatLimit}
            icon={MessageSquare}
            gradient="from-violet-500 to-purple-500"
          />
          <StatCard
            label="Words Generated"
            used={usage.wordsGenerated}
            limit={usage.wordLimit}
            icon={Pen}
            gradient="from-blue-500 to-cyan-500"
          />
          <StatCard
            label="Images Generated"
            used={usage.imagesGenerated}
            limit={usage.imageLimit}
            icon={Image}
            gradient="from-pink-500 to-rose-500"
          />
          <StatCard
            label="Storage Used"
            used={usage.storageUsed}
            limit={usage.storageLimit}
            icon={BarChart3}
            gradient="from-orange-500 to-amber-500"
            format="bytes"
          />
        </div>
      </section>

      <section aria-labelledby="ai-tools-heading">
        <div className="flex items-center justify-between mb-4">
          <h2 id="ai-tools-heading" className="text-lg font-semibold text-text-primary flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
            AI Tools
          </h2>
          <a href="/chat" className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 bg-transparent text-primary hover:bg-surface-secondary h-8 px-3 gap-1">
            View All <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" role="list" aria-label="AI Tools">
          {AI_TOOLS.slice(0, 8).map((tool, index) => (
            <ToolCard key={tool.title} {...tool} index={index} />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.section variants={itemVariants} aria-labelledby="recent-activity-heading">
          <Card variant="glass" className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle id="recent-activity-heading" className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" aria-hidden="true" />
                  Recent Activity
                </CardTitle>
                <a href="/dashboard/activity" className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-xs font-medium transition-all duration-200 bg-transparent text-text-secondary hover:bg-surface-secondary h-8 px-3">
                  View all
                </a>
              </div>
            </CardHeader>
            <CardContent>
              {MOCK_ACTIVITIES.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center" role="status">
                  <Clock className="h-12 w-12 text-text-tertiary mb-3" aria-hidden="true" />
                  <p className="text-text-secondary font-medium">No recent activity</p>
                  <p className="text-sm text-text-tertiary mt-1">Start using AI tools to see your activity here.</p>
                </div>
              ) : (
                <ul className="space-y-1" role="list">
                  {MOCK_ACTIVITIES.map((activity, index) => (
                    <motion.li
                      key={activity.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index, duration: 0.3 }}
                    >
                      <a
                        href="#"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-secondary transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary group"
                        aria-label={`${activity.title} - ${activity.time}`}
                      >
                        <div className="inline-flex p-2 rounded-lg bg-surface-secondary group-hover:bg-primary/10 transition-colors duration-200">
                          <activity.icon className="h-4 w-4 text-text-secondary group-hover:text-primary transition-colors duration-200" aria-hidden="true" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary truncate">{activity.title}</p>
                          <p className="text-xs text-text-tertiary">{activity.time}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-text-tertiary opacity-0 group-hover:opacity-100 transition-all duration-200" aria-hidden="true" />
                      </a>
                    </motion.li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </motion.section>

        <motion.section variants={chartVariants} aria-labelledby="chart-heading">
          <Card variant="glass" className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle id="chart-heading" className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" aria-hidden="true" />
                  AI Usage Over Time
                </CardTitle>
                <Badge variant="secondary" size="sm">Last 7 days</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full" role="img" aria-label="Area chart showing AI usage over the last 7 days">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={CHART_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="queriesGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="wordsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" stroke="currentColor" opacity={0.3} />
                    <XAxis
                      dataKey="day"
                      className="text-text-tertiary"
                      tick={{ fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis className="text-text-tertiary" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--color-surface)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "12px",
                        backdropFilter: "blur(12px)",
                      }}
                      labelStyle={{ fontWeight: 600, marginBottom: 4 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="queries"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      fill="url(#queriesGradient)"
                      name="Chat Queries"
                      dot={{ r: 3, fill: "#8b5cf6", strokeWidth: 0 }}
                      activeDot={{ r: 5, fill: "#8b5cf6", strokeWidth: 2, stroke: "var(--color-surface)" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="words"
                      stroke="#06b6d4"
                      strokeWidth={2}
                      fill="url(#wordsGradient)"
                      name="Words Generated"
                      dot={{ r: 3, fill: "#06b6d4", strokeWidth: 0 }}
                      activeDot={{ r: 5, fill: "#06b6d4", strokeWidth: 2, stroke: "var(--color-surface)" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </motion.div>
  )
}
