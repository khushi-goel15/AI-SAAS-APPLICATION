"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  CreditCard,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Plus,
  FileText,
  BarChart3,
  TrendingUp,
  Sparkles,
  Zap,
  Shield,
  ChevronRight,
  Check,
  HelpCircle,
  RefreshCw,
} from "lucide-react"
import { PRICING_PLANS } from "@/constants"
import { formatDate, cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar } from "@/components/ui/avatar"
import { Skeleton, SkeletonCard } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const CURRENT_PLAN = PRICING_PLANS[1]

const USAGE_METRICS = [
  { label: "Chat Queries", used: 7842, limit: 10000, icon: BarChart3, color: "from-violet-500 to-purple-500" },
  { label: "Words Generated", used: 84500, limit: 100000, icon: FileText, color: "from-blue-500 to-cyan-500" },
  { label: "Images Generated", used: 342, limit: 500, icon: Zap, color: "from-pink-500 to-rose-500" },
  { label: "Storage Used", used: 512, limit: 1024, icon: Shield, color: "from-orange-500 to-amber-500", format: "gb" },
]

const BILLING_HISTORY = [
  { id: "INV-001", date: new Date("2026-06-01"), description: "Pro Plan - Monthly", amount: 29, status: "paid" as const },
  { id: "INV-002", date: new Date("2026-05-01"), description: "Pro Plan - Monthly", amount: 29, status: "paid" as const },
  { id: "INV-003", date: new Date("2026-04-01"), description: "Pro Plan - Monthly", amount: 29, status: "paid" as const },
  { id: "INV-004", date: new Date("2026-03-15"), description: "Additional Storage", amount: 9.99, status: "paid" as const },
  { id: "INV-005", date: new Date("2026-03-01"), description: "Pro Plan - Monthly", amount: 29, status: "pending" as const },
  { id: "INV-006", date: new Date("2026-02-01"), description: "Pro Plan - Monthly", amount: 29, status: "failed" as const },
]

const STATUS_CONFIG = {
  paid: { label: "Paid", variant: "success" as const, icon: CheckCircle2 },
  pending: { label: "Pending", variant: "warning" as const, icon: Clock },
  failed: { label: "Failed", variant: "error" as const, icon: XCircle },
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

function BillingSkeleton() {
  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="space-y-3">
        <Skeleton variant="text" className="h-8 w-64" />
        <Skeleton variant="text" className="h-5 w-80" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Skeleton variant="card" className="h-56" />
        </div>
        <Skeleton variant="card" className="h-56" />
      </div>
      <Skeleton variant="card" className="h-64" />
      <Skeleton variant="card" className="h-72" />
    </div>
  )
}

function BillingError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <Card variant="glass" className="p-8 text-center max-w-md">
        <CardContent className="pt-6">
          <div className="inline-flex p-3 rounded-full bg-error/10 mb-4">
            <AlertTriangle className="h-8 w-8 text-error" />
          </div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">Failed to load billing data</h2>
          <p className="text-text-secondary mb-6">Something went wrong. Please try again.</p>
          <Button onClick={onRetry} icon={<RefreshCw className="h-4 w-4" />}>
            Retry
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default function BillingPage() {
  const [state, setState] = useState<"loading" | "loaded" | "error">("loaded")
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [addCardOpen, setAddCardOpen] = useState(false)
  const [cancelConfirm, setCancelConfirm] = useState("")

  if (state === "loading") return <BillingSkeleton />
  if (state === "error") return <BillingError onRetry={() => setState("loaded")} />

  const renewalDate = new Date("2026-07-01")
  const daysRemaining = Math.ceil((renewalDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

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
              <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Billing & Plans</h1>
              <motion.span
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, -10, 10, -5, 0] }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Sparkles className="h-6 w-6 text-primary" />
              </motion.span>
            </div>
            <p className="text-text-secondary flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Manage your subscription, payment methods, and billing history
            </p>
          </div>
        </div>
      </motion.section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.section variants={itemVariants} className="lg:col-span-2">
          <Card variant="glass">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Current Plan
                </CardTitle>
                <Badge variant="primary" size="sm">{CURRENT_PLAN.name}</Badge>
              </div>
              <CardDescription>
                Your subscription renews on {formatDate(renewalDate)} ({daysRemaining} days remaining)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {USAGE_METRICS.map((metric) => {
                  const percentage = Math.min((metric.used / metric.limit) * 100, 100)
                  const displayUsed = metric.format === "gb" ? `${metric.used}GB` : metric.used.toLocaleString()
                  const displayLimit = metric.format === "gb" ? `${metric.limit}GB` : metric.limit.toLocaleString()
                  const progressVariant = percentage >= 90 ? "error" : percentage >= 75 ? "warning" : "primary"
                  return (
                    <div key={metric.label} className="p-4 rounded-xl bg-surface-secondary">
                      <div className={cn("inline-flex p-2 rounded-lg bg-gradient-to-br", metric.color, "mb-3")}>
                        <metric.icon className="h-4 w-4 text-white" />
                      </div>
                      <p className="text-xs text-text-secondary mb-1">{metric.label}</p>
                      <p className="text-sm font-semibold text-text-primary mb-2">
                        {displayUsed} <span className="text-xs font-normal text-text-tertiary">/ {displayLimit}</span>
                      </p>
                      <Progress value={metric.used} max={metric.limit} variant={progressVariant} />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        <motion.section variants={itemVariants}>
          <Card variant="glass" className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-surface-secondary flex items-center gap-4">
                <div className="inline-flex p-2.5 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary">Visa •••• 4242</p>
                  <p className="text-xs text-text-tertiary">Expires 12/27</p>
                </div>
                <Badge variant="success" size="sm">Default</Badge>
              </div>
              <Dialog open={addCardOpen} onOpenChange={setAddCardOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full" icon={<Plus className="h-4 w-4" />}>
                    Add New Card
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Payment Method</DialogTitle>
                    <DialogDescription>Add a new credit or debit card to your account.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Card Number</Label>
                      <Input placeholder="4242 4242 4242 4242" leftIcon={<CreditCard className="h-4 w-4" />} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Expiry Date</Label>
                        <Input placeholder="MM/YY" />
                      </div>
                      <div className="space-y-2">
                        <Label>CVC</Label>
                        <Input placeholder="123" />
                      </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Cardholder Name</Label>
                        <Input placeholder="John Doe" />
                      </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={() => setAddCardOpen(false)}>Add Card</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </motion.section>
      </div>

      <motion.section variants={itemVariants}>
        <Card variant="glass">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Plan Comparison
              </CardTitle>
            </div>
            <CardDescription>Compare features across all plans</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PRICING_PLANS.map((plan) => {
                const isActive = plan.id === CURRENT_PLAN.id
                return (
                  <motion.div
                    key={plan.id}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "relative rounded-xl border p-6 transition-all duration-300",
                      isActive
                        ? "border-primary/50 bg-primary/5 shadow-lg shadow-primary/10"
                        : "border-border bg-surface-secondary/50 hover:border-border/80"
                    )}
                  >
                    {isActive && (
                      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                        <Badge variant="primary" size="sm">Current Plan</Badge>
                      </div>
                    )}
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-semibold text-text-primary mb-1">{plan.name}</h3>
                      <p className="text-sm text-text-secondary mb-4">{plan.description}</p>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-3xl font-bold text-text-primary">${plan.price}</span>
                        <span className="text-sm text-text-tertiary">/{plan.interval}</span>
                      </div>
                    </div>
                    <Separator className="mb-4" />
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                          <span className="text-text-secondary">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant={isActive ? "outline" : plan.highlighted ? "primary" : "secondary"}
                      className="w-full"
                      disabled={isActive}
                    >
                      {isActive ? "Current Plan" : plan.cta}
                    </Button>
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.section>

      <motion.section variants={itemVariants}>
        <Card variant="glass">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Billing History
              </CardTitle>
            </div>
            <CardDescription>View and download your invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-text-secondary font-medium">Invoice</th>
                    <th className="text-left py-3 px-4 text-text-secondary font-medium">Date</th>
                    <th className="text-left py-3 px-4 text-text-secondary font-medium">Description</th>
                    <th className="text-right py-3 px-4 text-text-secondary font-medium">Amount</th>
                    <th className="text-center py-3 px-4 text-text-secondary font-medium">Status</th>
                    <th className="text-right py-3 px-4 text-text-secondary font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {BILLING_HISTORY.map((invoice, index) => {
                    const statusConfig = STATUS_CONFIG[invoice.status]
                    const StatusIcon = statusConfig.icon
                    return (
                      <motion.tr
                        key={invoice.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * index }}
                        className="border-b border-border/50 hover:bg-surface-secondary/50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <span className="font-medium text-text-primary">{invoice.id}</span>
                        </td>
                        <td className="py-3 px-4 text-text-secondary">{formatDate(invoice.date)}</td>
                        <td className="py-3 px-4 text-text-secondary">{invoice.description}</td>
                        <td className="py-3 px-4 text-right font-medium text-text-primary">
                          ${invoice.amount.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant={statusConfig.variant} size="sm">
                            <StatusIcon className="h-3 w-3" />
                            {statusConfig.label}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="ghost" size="sm" icon={<Download className="h-4 w-4" />}>
                            Invoice
                          </Button>
                        </td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            {BILLING_HISTORY.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-text-tertiary mb-3" />
                <p className="text-text-secondary font-medium">No billing history</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.section>

      <motion.section variants={itemVariants}>
        <Card variant="glass" className="border-error/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-error">
              <AlertTriangle className="h-5 w-5" />
              Cancel Subscription
            </CardTitle>
            <CardDescription>
              Once cancelled, your access will continue until the end of your billing period.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="danger">Cancel Subscription</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cancel Subscription</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to cancel your {CURRENT_PLAN.name} plan? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <div className="p-3 rounded-lg bg-warning/10 border border-warning/20 flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-warning">You will lose access to Pro features</p>
                      <p className="text-xs text-text-secondary mt-1">
                        Your access remains until {formatDate(renewalDate)}. After that, you&apos;ll be downgraded to the Free plan.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label required>Type &quot;DELETE&quot; to confirm</Label>
                    <Input
                      value={cancelConfirm}
                      onChange={(e) => setCancelConfirm(e.target.value)}
                      placeholder="Type DELETE to confirm"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Keep Subscription</Button>
                  </DialogClose>
                  <Button
                    variant="danger"
                    disabled={cancelConfirm !== "DELETE"}
                    onClick={() => { setCancelDialogOpen(false); setCancelConfirm("") }}
                  >
                    Confirm Cancellation
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </motion.section>
    </motion.div>
  )
}
