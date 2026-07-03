"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Users,
  UserCheck,
  DollarSign,
  TrendingUp,
  MessageSquare,
  Activity,
  Search,
  Mail,
  Flag,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  RefreshCw,
  AlertTriangle,
  Cpu,
  HardDrive,
  Database,
  Zap,
  Bell,
  ToggleLeft,
  Clock,
  ChevronLeft,
  ChevronRight,
  Download,
  Shield,
  Server,
} from "lucide-react"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { cn, formatNumber, formatDate, getInitials } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

const REVENUE_DATA = [
  { day: "Jun 1", revenue: 12400, users: 120 },
  { day: "Jun 3", revenue: 14800, users: 145 },
  { day: "Jun 5", revenue: 11200, users: 108 },
  { day: "Jun 7", revenue: 16200, users: 162 },
  { day: "Jun 9", revenue: 18900, users: 178 },
  { day: "Jun 11", revenue: 15400, users: 155 },
  { day: "Jun 13", revenue: 17200, users: 168 },
  { day: "Jun 15", revenue: 19800, users: 190 },
  { day: "Jun 17", revenue: 16500, users: 158 },
  { day: "Jun 19", revenue: 21000, users: 205 },
  { day: "Jun 21", revenue: 23500, users: 228 },
  { day: "Jun 23", revenue: 20100, users: 195 },
  { day: "Jun 25", revenue: 22200, users: 215 },
  { day: "Jun 27", revenue: 24800, users: 242 },
  { day: "Jun 29", revenue: 26100, users: 258 },
]

const USER_GROWTH_DATA = [
  { month: "Jan", newUsers: 520, total: 5200 },
  { month: "Feb", newUsers: 680, total: 5880 },
  { month: "Mar", newUsers: 890, total: 6770 },
  { month: "Apr", newUsers: 1240, total: 8010 },
  { month: "May", newUsers: 1560, total: 9570 },
  { month: "Jun", newUsers: 1890, total: 11460 },
]

const ACTIVE_USERS_DATA = [
  { name: "Free", value: 65, color: "#6366f1" },
  { name: "Pro", value: 25, color: "#06b6d4" },
  { name: "Enterprise", value: 10, color: "#10b981" },
]

const STATS_CARDS = [
  { label: "Total Users", value: 11460, icon: Users, change: 12.5, changeLabel: "vs last month", color: "from-violet-500 to-purple-500" },
  { label: "Active Users", value: 8450, icon: UserCheck, change: 8.2, changeLabel: "vs last month", color: "from-blue-500 to-cyan-500" },
  { label: "Revenue", value: 26100, icon: DollarSign, change: 15.8, changeLabel: "vs last month", color: "from-emerald-500 to-green-500", prefix: "$" },
  { label: "Growth", value: 32.4, icon: TrendingUp, change: 5.3, changeLabel: "vs last month", color: "from-pink-500 to-rose-500", suffix: "%" },
  { label: "Queries Today", value: 12450, icon: MessageSquare, change: 22.1, changeLabel: "vs yesterday", color: "from-orange-500 to-amber-500" },
  { label: "System Uptime", value: 99.97, icon: Activity, change: 0.02, changeLabel: "vs last month", color: "from-indigo-500 to-blue-500", suffix: "%" },
]

const USERS_TABLE_DATA = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", role: "Admin", status: "active" as const, joinDate: new Date("2025-01-15"), avatar: "https://i.pravatar.cc/150?u=alice" },
  { id: "2", name: "Bob Smith", email: "bob@example.com", role: "User", status: "active" as const, joinDate: new Date("2025-03-22"), avatar: "https://i.pravatar.cc/150?u=bob" },
  { id: "3", name: "Carol Davis", email: "carol@example.com", role: "User", status: "suspended" as const, joinDate: new Date("2025-02-10"), avatar: "https://i.pravatar.cc/150?u=carol" },
  { id: "4", name: "David Wilson", email: "david@example.com", role: "User", status: "active" as const, joinDate: new Date("2025-05-05"), avatar: "https://i.pravatar.cc/150?u=david" },
  { id: "5", name: "Eve Martinez", email: "eve@example.com", role: "Admin", status: "active" as const, joinDate: new Date("2024-11-01"), avatar: "https://i.pravatar.cc/150?u=eve" },
  { id: "6", name: "Frank Lee", email: "frank@example.com", role: "User", status: "inactive" as const, joinDate: new Date("2025-04-18"), avatar: "https://i.pravatar.cc/150?u=frank" },
  { id: "7", name: "Grace Kim", email: "grace@example.com", role: "User", status: "active" as const, joinDate: new Date("2025-06-01"), avatar: "https://i.pravatar.cc/150?u=grace" },
  { id: "8", name: "Henry Brown", email: "henry@example.com", role: "User", status: "active" as const, joinDate: new Date("2025-03-30"), avatar: "https://i.pravatar.cc/150?u=henry" },
]

const SUPPORT_TICKETS = [
  { id: "1", user: "Alice Johnson", subject: "Cannot access premium features", status: "open" as const, priority: "high" as const, date: new Date("2026-06-29") },
  { id: "2", user: "Bob Smith", subject: "API rate limit too low", status: "in-progress" as const, priority: "medium" as const, date: new Date("2026-06-28") },
  { id: "3", user: "Carol Davis", subject: "Billing issue with upgrade", status: "open" as const, priority: "high" as const, date: new Date("2026-06-28") },
  { id: "4", user: "David Wilson", subject: "Feature request: dark mode", status: "resolved" as const, priority: "low" as const, date: new Date("2026-06-27") },
  { id: "5", user: "Eve Martinez", subject: "Login authentication error", status: "in-progress" as const, priority: "urgent" as const, date: new Date("2026-06-27") },
]

const SYSTEM_HEALTH = [
  { label: "CPU Usage", value: 45, icon: Cpu, color: "from-violet-500 to-purple-500", variant: "primary" as const },
  { label: "Memory", value: 72, icon: Database, color: "from-blue-500 to-cyan-500", variant: "warning" as const },
  { label: "Storage", value: 58, icon: HardDrive, color: "from-emerald-500 to-green-500", variant: "primary" as const },
  { label: "API Response Time", value: 28, icon: Zap, color: "from-orange-500 to-amber-500", variant: "success" as const, suffix: "ms" },
]

const PRIORITY_CONFIG = {
  urgent: { label: "Urgent", variant: "error" as const },
  high: { label: "High", variant: "warning" as const },
  medium: { label: "Medium", variant: "primary" as const },
  low: { label: "Low", variant: "secondary" as const },
}

const STATUS_CONFIG = {
  active: { label: "Active", variant: "success" as const },
  inactive: { label: "Inactive", variant: "secondary" as const },
  suspended: { label: "Suspended", variant: "error" as const },
}

const TICKET_STATUS_CONFIG = {
  open: { label: "Open", variant: "warning" as const },
  "in-progress": { label: "In Progress", variant: "primary" as const },
  resolved: { label: "Resolved", variant: "success" as const },
}

const ITEMS_PER_PAGE = 5

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

function AdminSkeleton() {
  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="space-y-3">
        <Skeleton variant="text" className="h-8 w-64" />
        <Skeleton variant="text" className="h-5 w-80" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} variant="card" className="h-28" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton variant="card" className="h-80" />
        <Skeleton variant="card" className="h-80" />
      </div>
      <Skeleton variant="card" className="h-96" />
    </div>
  )
}

export default function AdminPage() {
  const [state, setState] = useState<"loading" | "loaded" | "error">("loaded")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [notifDialogOpen, setNotifDialogOpen] = useState(false)
  const [notifMessage, setNotifMessage] = useState("")

  const lastUpdated = useMemo(() => {
    const now = new Date()
    return `Last updated: ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`
  }, [])

  const filteredUsers = useMemo(() => {
    if (!searchQuery) return USERS_TABLE_DATA
    const q = searchQuery.toLowerCase()
    return USERS_TABLE_DATA.filter(
      (user) => user.name.toLowerCase().includes(q) || user.email.toLowerCase().includes(q)
    )
  }, [searchQuery])

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  if (state === "loading") return <AdminSkeleton />
  if (state === "error") {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <Card variant="glass" className="p-8 text-center max-w-md">
          <CardContent className="pt-6">
            <div className="inline-flex p-3 rounded-full bg-error/10 mb-4">
              <AlertTriangle className="h-8 w-8 text-error" />
            </div>
            <h2 className="text-xl font-semibold text-text-primary mb-2">Failed to load admin dashboard</h2>
            <p className="text-text-secondary mb-6">Something went wrong. Please try again.</p>
            <Button onClick={() => setState("loaded")} icon={<RefreshCw className="h-4 w-4" />}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto"
    >
      <motion.section variants={itemVariants}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Admin Dashboard</h1>
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <p className="text-text-secondary flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <time>{lastUpdated}</time>
            </p>
          </div>
          <Button variant="outline" size="sm" icon={<RefreshCw className="h-4 w-4" />} onClick={() => setState("loaded")}>
            Refresh
          </Button>
        </div>
      </motion.section>

      <motion.section variants={itemVariants}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {STATS_CARDS.map((stat) => {
            const isUp = stat.change >= 0
            const Icon = stat.icon
            const displayValue = stat.prefix || stat.suffix
              ? `${stat.prefix || ""}${stat.value.toLocaleString()}${stat.suffix || ""}`
              : formatNumber(stat.value)
            return (
              <motion.div
                key={stat.label}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Card variant="glass" className="h-full">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className={cn("inline-flex p-1.5 rounded-lg bg-gradient-to-br", stat.color)}>
                        <Icon className="h-3.5 w-3.5 text-white" />
                      </div>
                      <span className={cn(
                        "flex items-center gap-0.5 text-xs font-medium",
                        isUp ? "text-success" : "text-error"
                      )}>
                        {isUp ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                        {Math.abs(stat.change)}%
                      </span>
                    </div>
                    <p className="text-lg font-bold text-text-primary">{displayValue}</p>
                    <p className="text-xs text-text-tertiary mt-0.5">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </motion.section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.section variants={itemVariants}>
          <Card variant="glass">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Revenue (Last 30 Days)
                </CardTitle>
                <Badge variant="secondary" size="sm">+15.8%</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={REVENUE_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" opacity={0.3} />
                    <XAxis dataKey="day" className="text-text-tertiary" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis className="text-text-tertiary" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "12px", backdropFilter: "blur(12px)" }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#revenueGradient)" dot={{ r: 3, fill: "#6366f1", strokeWidth: 0 }} activeDot={{ r: 5, fill: "#6366f1", strokeWidth: 2, stroke: "var(--color-surface)" }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        <motion.section variants={itemVariants}>
          <Card variant="glass">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  User Growth
                </CardTitle>
                <Badge variant="secondary" size="sm">+19.7%</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={USER_GROWTH_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" opacity={0.3} />
                    <XAxis dataKey="month" className="text-text-tertiary" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis className="text-text-tertiary" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "12px", backdropFilter: "blur(12px)" }}
                    />
                    <Line type="monotone" dataKey="newUsers" stroke="#06b6d4" strokeWidth={2} dot={{ r: 4, fill: "#06b6d4", strokeWidth: 0 }} activeDot={{ r: 6, fill: "#06b6d4", strokeWidth: 2, stroke: "var(--color-surface)" }} name="New Users" />
                    <Line type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={2} dot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }} activeDot={{ r: 6, fill: "#6366f1", strokeWidth: 2, stroke: "var(--color-surface)" }} name="Total Users" />
                    <Legend />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.section variants={itemVariants}>
          <Card variant="glass" className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Active Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ACTIVE_USERS_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {ACTIVE_USERS_DATA.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "12px", backdropFilter: "blur(12px)" }}
                      formatter={(value: number) => [`${value}%`]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        <motion.section variants={itemVariants} className="lg:col-span-2">
          <Card variant="glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {SYSTEM_HEALTH.map((metric) => (
                  <div key={metric.label} className="p-4 rounded-xl bg-surface-secondary">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={cn("inline-flex p-1.5 rounded-lg bg-gradient-to-br", metric.color)}>
                        <metric.icon className="h-3.5 w-3.5 text-white" />
                      </div>
                      <span className="text-xs font-medium text-text-secondary">{metric.label}</span>
                    </div>
                    <p className="text-xl font-bold text-text-primary mb-2">
                      {metric.value}{metric.suffix || "%"}
                    </p>
                    <Progress value={metric.suffix ? (metric.value / 100) * 100 : metric.value} max={100} variant={metric.variant} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </div>

      <motion.section variants={itemVariants}>
        <Card variant="glass">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                User Management
              </CardTitle>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
                  leftIcon={<Search className="h-4 w-4" />}
                  containerClassName="w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-3 text-text-secondary font-medium">User</th>
                    <th className="text-left py-3 px-3 text-text-secondary font-medium">Email</th>
                    <th className="text-left py-3 px-3 text-text-secondary font-medium">Role</th>
                    <th className="text-center py-3 px-3 text-text-secondary font-medium">Status</th>
                    <th className="text-left py-3 px-3 text-text-secondary font-medium">Joined</th>
                    <th className="text-right py-3 px-3 text-text-secondary font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.03 * index }}
                      className="border-b border-border/50 hover:bg-surface-secondary/50 transition-colors"
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <Avatar size="sm" src={user.avatar} fallback={getInitials(user.name)} alt={user.name} />
                          <span className="font-medium text-text-primary">{user.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-text-secondary">{user.email}</td>
                      <td className="py-3 px-3">
                        <Badge variant={user.role === "Admin" ? "primary" : "secondary"} size="sm">{user.role}</Badge>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <Badge variant={STATUS_CONFIG[user.status].variant} size="sm" dot>
                          {STATUS_CONFIG[user.status].label}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-text-secondary">{formatDate(user.joinDate)}</td>
                      <td className="py-3 px-3 text-right">
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredUsers.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-text-tertiary mb-3" />
                <p className="text-text-secondary font-medium">No users found</p>
              </div>
            )}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
                <p className="text-sm text-text-secondary">
                  Page {currentPage} of {totalPages} ({filteredUsers.length} total)
                </p>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <Button
                      key={i}
                      variant={currentPage === i + 1 ? "primary" : "outline"}
                      size="sm"
                      className="min-w-[2rem]"
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                  <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.section variants={itemVariants}>
          <Card variant="glass">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Recent Support Tickets
                </CardTitle>
                <Badge variant="warning" size="sm">{SUPPORT_TICKETS.filter(t => t.status !== "resolved").length} open</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {SUPPORT_TICKETS.map((ticket, index) => {
                  const priorityConfig = PRIORITY_CONFIG[ticket.priority]
                  const statusConfig = TICKET_STATUS_CONFIG[ticket.status]
                  return (
                    <motion.div
                      key={ticket.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * index }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-surface-secondary hover:bg-surface-tertiary/50 transition-colors cursor-pointer"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium text-text-primary">{ticket.subject}</p>
                          <Badge variant={priorityConfig.variant} size="sm">{priorityConfig.label}</Badge>
                        </div>
                        <p className="text-xs text-text-tertiary">
                          {ticket.user} · {formatDate(ticket.date)}
                        </p>
                      </div>
                      <Badge variant={statusConfig.variant} size="sm">{statusConfig.label}</Badge>
                    </motion.div>
                  )
                })}
              </div>
              {SUPPORT_TICKETS.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                  <MessageSquare className="h-12 w-12 text-text-tertiary mb-3" />
                  <p className="text-text-secondary font-medium">No support tickets</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.section>

        <motion.section variants={itemVariants}>
          <Card variant="glass" className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Dialog open={notifDialogOpen} onOpenChange={setNotifDialogOpen}>
                <DialogTrigger asChild>
                  <div className="p-4 rounded-xl bg-surface-secondary hover:bg-surface-tertiary/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="inline-flex p-2 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500">
                        <Bell className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-text-primary">Send Notification to All Users</p>
                        <p className="text-xs text-text-tertiary">Broadcast a message to every user on the platform</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-text-tertiary" />
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Send Notification</DialogTitle>
                    <DialogDescription>This will send a notification to all registered users.</DialogDescription>
                  </DialogHeader>
                  <div className="py-4 space-y-4">
                    <div className="space-y-2">
                      <Label>Subject</Label>
                      <Input placeholder="Notification subject" />
                    </div>
                    <div className="space-y-2">
                      <Label>Message</Label>
                      <textarea
                        value={notifMessage}
                        onChange={(e) => setNotifMessage(e.target.value)}
                        placeholder="Type your notification message..."
                        className="flex min-h-[120px] w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={() => { setNotifDialogOpen(false); setNotifMessage("") }}>Send to All Users</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <div className="p-4 rounded-xl bg-surface-secondary hover:bg-surface-tertiary/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="inline-flex p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500">
                    <ToggleLeft className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text-primary">Toggle Feature Flags</p>
                    <p className="text-xs text-text-tertiary">Enable or disable features across the platform</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-text-tertiary" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-surface-secondary hover:bg-surface-tertiary/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="inline-flex p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                    <Download className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text-primary">Export Analytics Report</p>
                    <p className="text-xs text-text-tertiary">Download a comprehensive CSV report of platform analytics</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-text-tertiary" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-surface-secondary hover:bg-surface-tertiary/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="inline-flex p-2 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500">
                    <Server className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text-primary">System Maintenance</p>
                    <p className="text-xs text-text-tertiary">Schedule maintenance or restart services</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-text-tertiary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </motion.div>
  )
}
