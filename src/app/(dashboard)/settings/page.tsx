"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  User,
  Shield,
  KeyRound,
  Bell,
  Palette,
  Globe,
  Key,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  Download,
  AlertTriangle,
  CheckCircle2,
  X,
  Plus,
  RefreshCw,
  LogOut,
  Smartphone,
  Laptop,
  Monitor,
  Sun,
  Moon,
  ChevronRight,
  Check,
  ExternalLink,
  Clock,
  Fingerprint,
} from "lucide-react"
import { LANGUAGES, PRICING_PLANS } from "@/constants"
import { cn, getInitials } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Avatar } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  bio: z.string().max(500, "Bio must be under 500 characters").optional(),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(8, "Password must be at least 8 characters"),
  newPassword: z.string().min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type ProfileData = z.infer<typeof profileSchema>
type PasswordData = z.infer<typeof passwordSchema>

const SETTINGS_SECTIONS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Shield },
  { id: "password", label: "Password", icon: KeyRound },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "theme", label: "Theme", icon: Palette },
  { id: "language", label: "Language", icon: Globe },
  { id: "api-keys", label: "API Keys", icon: Key },
  { id: "privacy", label: "Privacy", icon: Shield },
  { id: "delete-account", label: "Delete Account", icon: Trash2 },
]

type SectionId = typeof SETTINGS_SECTIONS[number]["id"]

const DEVICE_SESSIONS = [
  { id: "1", device: "MacBook Pro", browser: "Chrome 125", location: "San Francisco, US", ip: "192.168.1.1", lastActive: "2 min ago", icon: Laptop, current: true },
  { id: "2", device: "iPhone 15", browser: "Safari", location: "San Francisco, US", ip: "192.168.1.2", lastActive: "1 hour ago", icon: Smartphone },
  { id: "3", device: "Windows PC", browser: "Firefox 127", location: "New York, US", ip: "10.0.0.1", lastActive: "2 days ago", icon: Monitor },
]

const MOCK_API_KEYS = [
  { id: "1", name: "Production API Key", key: "sk-prod-xxxxxxxxxxxx", created: "Jan 15, 2026", lastUsed: "2 hours ago", enabled: true },
  { id: "2", name: "Development API Key", key: "sk-dev-xxxxxxxxxxxx", created: "Mar 20, 2026", lastUsed: "Yesterday", enabled: true },
  { id: "3", name: "Staging API Key", key: "sk-stag-xxxxxxxxxxxx", created: "Apr 1, 2026", lastUsed: "3 days ago", enabled: false },
]

function getPasswordStrength(password: string): { score: number; label: string; color: string; variant: "error" | "warning" | "success" | "primary" } {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  if (score <= 1) return { score, label: "Weak", color: "bg-error", variant: "error" }
  if (score <= 3) return { score, label: "Medium", color: "bg-warning", variant: "warning" }
  if (score === 4) return { score, label: "Strong", color: "bg-primary", variant: "primary" }
  return { score, label: "Very Strong", color: "bg-success", variant: "success" }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
}

const sectionVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
}

function SettingsSkeleton() {
  return (
    <div className="flex gap-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="hidden lg:block w-64 shrink-0 space-y-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-lg" />
        ))}
      </div>
      <div className="flex-1 space-y-6">
        <Skeleton variant="text" className="h-8 w-48" />
        <Skeleton variant="card" className="h-96" />
      </div>
    </div>
  )
}

export default function SettingsPage() {
  const [state, setState] = useState<"loading" | "loaded" | "error">("loaded")
  const [activeSection, setActiveSection] = useState<SectionId>("profile")
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [loginAlerts, setLoginAlerts] = useState(true)
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [pushNotifs, setPushNotifs] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(false)
  const [productUpdates, setProductUpdates] = useState(true)
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system")
  const [language, setLanguage] = useState("en")
  const [apiKeys, setApiKeys] = useState(MOCK_API_KEYS)
  const [showKeyId, setShowKeyId] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const profileForm = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "John Doe", email: "john@example.com", bio: "Full-stack developer passionate about AI and building great user experiences." },
  })

  const passwordForm = useForm<PasswordData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  })

  const currentPassword = passwordForm.watch("newPassword")
  const strength = useMemo(() => getPasswordStrength(currentPassword || ""), [currentPassword])

  if (state === "loading") return <SettingsSkeleton />
  if (state === "error") {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <Card variant="glass" className="p-8 text-center max-w-md">
          <CardContent className="pt-6">
            <div className="inline-flex p-3 rounded-full bg-error/10 mb-4">
              <AlertTriangle className="h-8 w-8 text-error" />
            </div>
            <h2 className="text-xl font-semibold text-text-primary mb-2">Failed to load settings</h2>
            <p className="text-text-secondary mb-6">Something went wrong. Please try again.</p>
            <Button onClick={() => setState("loaded")} icon={<RefreshCw className="h-4 w-4" />}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return (
          <motion.div key="profile" variants={sectionVariants} initial="hidden" animate="visible" exit="exit">
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><User className="h-5 w-5 text-primary" />Profile</CardTitle>
                <CardDescription>Manage your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar size="xl" src="" fallback="JD" />
                  <div>
                    <Button variant="outline" size="sm">Upload Avatar</Button>
                    <p className="text-xs text-text-tertiary mt-1">JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                </div>
                <Separator />
                <form onSubmit={profileForm.handleSubmit((data) => console.log(data))} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Full Name" {...profileForm.register("name")} error={profileForm.formState.errors.name?.message} />
                    <Input label="Email" type="email" {...profileForm.register("email")} error={profileForm.formState.errors.email?.message} />
                  </div>
                  <Textarea label="Bio" {...profileForm.register("bio")} error={profileForm.formState.errors.bio?.message} maxLength={500} showCharCount />
                  <div className="flex justify-end">
                    <Button type="submit" loading={false}>Save Changes</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )

      case "security":
        return (
          <motion.div key="security" variants={sectionVariants} initial="hidden" animate="visible" exit="exit">
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-primary" />Security</CardTitle>
                <CardDescription>Manage your account security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-xl bg-surface-secondary space-y-4">
                  <Switch
                    label="Two-Factor Authentication"
                    description="Add an extra layer of security to your account"
                    checked={twoFactorEnabled}
                    onCheckedChange={setTwoFactorEnabled}
                  />
                  <Separator />
                  <Switch
                    label="Login Alerts"
                    description="Get notified when a new device logs into your account"
                    checked={loginAlerts}
                    onCheckedChange={setLoginAlerts}
                  />
                </div>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium text-text-primary mb-4">Active Sessions</h4>
                  <div className="space-y-3">
                    {DEVICE_SESSIONS.map((session) => (
                      <div key={session.id} className="flex items-center gap-4 p-3 rounded-xl bg-surface-secondary">
                        <div className="inline-flex p-2 rounded-lg bg-surface-tertiary">
                          <session.icon className="h-4 w-4 text-text-secondary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-text-primary">{session.device}</p>
                            {session.current && <Badge variant="success" size="sm">Current</Badge>}
                          </div>
                          <p className="text-xs text-text-tertiary">{session.browser} · {session.location}</p>
                          <p className="text-xs text-text-tertiary">IP: {session.ip} · Active {session.lastActive}</p>
                        </div>
                        {!session.current && (
                          <Button variant="ghost" size="sm" className="text-error hover:text-error">
                            <LogOut className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )

      case "password":
        return (
          <motion.div key="password" variants={sectionVariants} initial="hidden" animate="visible" exit="exit">
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><KeyRound className="h-5 w-5 text-primary" />Password</CardTitle>
                <CardDescription>Update your password</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={passwordForm.handleSubmit((data) => console.log(data))} className="space-y-4 max-w-md">
                  <Input label="Current Password" type="password" showPasswordToggle {...passwordForm.register("currentPassword")} error={passwordForm.formState.errors.currentPassword?.message} />
                  <Input label="New Password" type="password" showPasswordToggle {...passwordForm.register("newPassword")} error={passwordForm.formState.errors.newPassword?.message} />
                  {currentPassword && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-text-secondary">Password strength</span>
                        <Badge variant={strength.variant} size="sm">{strength.label}</Badge>
                      </div>
                      <Progress value={strength.score * 20} max={100} variant={strength.variant} />
                    </div>
                  )}
                  <Input label="Confirm New Password" type="password" showPasswordToggle {...passwordForm.register("confirmPassword")} error={passwordForm.formState.errors.confirmPassword?.message} />
                  <div className="flex justify-end pt-2">
                    <Button type="submit">Update Password</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )

      case "notifications":
        return (
          <motion.div key="notifications" variants={sectionVariants} initial="hidden" animate="visible" exit="exit">
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-primary" />Notifications</CardTitle>
                <CardDescription>Control how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  <Switch label="Email Notifications" description="Receive notifications via email" checked={emailNotifs} onCheckedChange={setEmailNotifs} />
                  <Separator />
                  <Switch label="Push Notifications" description="Receive push notifications in your browser" checked={pushNotifs} onCheckedChange={setPushNotifs} />
                  <Separator />
                  <Switch label="Weekly Digest" description="Receive a weekly summary of your activity" checked={weeklyDigest} onCheckedChange={setWeeklyDigest} />
                  <Separator />
                  <Switch label="Product Updates" description="Get notified about new features and updates" checked={productUpdates} onCheckedChange={setProductUpdates} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )

      case "theme":
        return (
          <motion.div key="theme" variants={sectionVariants} initial="hidden" animate="visible" exit="exit">
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5 text-primary" />Theme</CardTitle>
                <CardDescription>Customize the appearance of your workspace</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(["light", "dark", "system"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={cn(
                        "relative rounded-xl border-2 p-4 text-left transition-all duration-200",
                        theme === t ? "border-primary bg-primary/5" : "border-border hover:border-border/80 bg-surface-secondary/50"
                      )}
                    >
                      {theme === t && (
                        <div className="absolute top-2 right-2">
                          <Check className="h-4 w-4 text-primary" />
                        </div>
                      )}
                      <div className="flex items-center gap-3 mb-3">
                        {t === "light" && <Sun className="h-5 w-5 text-amber-500" />}
                        {t === "dark" && <Moon className="h-5 w-5 text-indigo-400" />}
                        {t === "system" && <Monitor className="h-5 w-5 text-primary" />}
                        <span className="text-sm font-medium text-text-primary capitalize">{t}</span>
                      </div>
                      <div className="rounded-lg overflow-hidden border border-border">
                        <div className={cn(
                          "h-20 p-2",
                          t === "light" ? "bg-white" : t === "dark" ? "bg-slate-900" : "bg-gradient-to-r from-white to-slate-900"
                        )}>
                          <div className={cn(
                            "h-2 w-16 rounded mb-1.5",
                            t === "light" ? "bg-gray-200" : t === "dark" ? "bg-slate-700" : "bg-gradient-to-r from-gray-200 to-slate-700"
                          )} />
                          <div className={cn(
                            "h-2 w-24 rounded mb-1.5",
                            t === "light" ? "bg-gray-100" : t === "dark" ? "bg-slate-800" : "bg-gradient-to-r from-gray-100 to-slate-800"
                          )} />
                          <div className="flex gap-1">
                            <div className={cn(
                              "h-2 w-8 rounded",
                              t === "light" ? "bg-indigo-200" : t === "dark" ? "bg-indigo-800" : "bg-gradient-to-r from-indigo-200 to-indigo-800"
                            )} />
                            <div className={cn(
                              "h-2 w-12 rounded",
                              t === "light" ? "bg-gray-100" : t === "dark" ? "bg-slate-800" : "bg-gradient-to-r from-gray-100 to-slate-800"
                            )} />
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )

      case "language":
        return (
          <motion.div key="language" variants={sectionVariants} initial="hidden" animate="visible" exit="exit">
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5 text-primary" />Language</CardTitle>
                <CardDescription>Choose your preferred language</CardDescription>
              </CardHeader>
              <CardContent className="max-w-md">
                <div className="space-y-2">
                  <Label>Interface Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.native} ({lang.name})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-text-tertiary mt-1">This will change the interface language across the entire workspace.</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )

      case "api-keys":
        return (
          <motion.div key="api-keys" variants={sectionVariants} initial="hidden" animate="visible" exit="exit">
            <Card variant="glass">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2"><Key className="h-5 w-5 text-primary" />API Keys</CardTitle>
                    <CardDescription>Manage your API keys for programmatic access</CardDescription>
                  </div>
                  <Button size="sm" icon={<Plus className="h-4 w-4" />}>Create Key</Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {apiKeys.map((apiKey) => (
                  <div key={apiKey.id} className="flex items-center gap-4 p-4 rounded-xl bg-surface-secondary">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-text-primary">{apiKey.name}</p>
                        <Badge variant={apiKey.enabled ? "success" : "secondary"} size="sm">
                          {apiKey.enabled ? "Active" : "Disabled"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-text-tertiary">
                        <code className="px-1.5 py-0.5 rounded bg-surface-tertiary font-mono text-xs">
                          {showKeyId === apiKey.id ? apiKey.key : apiKey.key.slice(0, 12) + "••••••••"}
                        </code>
                        <button onClick={() => setShowKeyId(showKeyId === apiKey.id ? null : apiKey.id)} className="hover:text-text-primary transition-colors">
                          {showKeyId === apiKey.id ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </button>
                        <button onClick={() => navigator.clipboard.writeText(apiKey.key)} className="hover:text-text-primary transition-colors">
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-text-tertiary mt-1">Created {apiKey.created} · Last used {apiKey.lastUsed}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-error hover:text-error" onClick={() => setApiKeys(apiKeys.filter(k => k.id !== apiKey.id))}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {apiKeys.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Key className="h-12 w-12 text-text-tertiary mb-3" />
                    <p className="text-text-secondary font-medium">No API keys created</p>
                    <p className="text-xs text-text-tertiary mt-1">Create your first API key to get started.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )

      case "privacy":
        return (
          <motion.div key="privacy" variants={sectionVariants} initial="hidden" animate="visible" exit="exit">
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-primary" />Privacy</CardTitle>
                <CardDescription>Manage your data and privacy settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-xl bg-surface-secondary space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-text-primary">Data Export</p>
                      <p className="text-xs text-text-secondary">Download all your data including chat history, documents, and settings.</p>
                    </div>
                    <Button variant="outline" size="sm" icon={<Download className="h-4 w-4" />}>Export Data</Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-text-primary">Marketing Preferences</p>
                      <p className="text-xs text-text-secondary">Allow us to send you promotional content and offers.</p>
                    </div>
                    <Switch checked={productUpdates} onCheckedChange={setProductUpdates} />
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-warning/20 bg-warning/5">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-warning">Request Data Deletion</p>
                      <p className="text-xs text-text-secondary mt-1">This will permanently delete all your data and cannot be undone.</p>
                      <Button variant="outline" size="sm" className="mt-3 border-warning/30 text-warning hover:bg-warning/10">
                        Request Deletion
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )

      case "delete-account":
        return (
          <motion.div key="delete-account" variants={sectionVariants} initial="hidden" animate="visible" exit="exit">
            <Card variant="glass" className="border-error/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-error"><Trash2 className="h-5 w-5" />Delete Account</CardTitle>
                <CardDescription>Permanently delete your account and all associated data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 rounded-xl bg-error/5 border border-error/20 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-error shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-error">Warning: This action is irreversible</p>
                      <p className="text-xs text-text-secondary mt-1">
                        Deleting your account will:
                      </p>
                      <ul className="text-xs text-text-secondary mt-2 space-y-1 list-disc list-inside">
                        <li>Permanently delete all your data including chat history, documents, and projects</li>
                        <li>Cancel any active subscriptions</li>
                        <li>Remove you from all workspaces</li>
                        <li>Your username will become available for others</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="danger">Delete My Account</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Account</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. All your data will be permanently deleted.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                      <div className="p-3 rounded-lg bg-error/10 border border-error/20 flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-error shrink-0 mt-0.5" />
                        <p className="text-sm text-error font-medium">This will permanently delete your account</p>
                      </div>
                      <div className="space-y-2">
                        <Label required>Type &quot;DELETE&quot; to confirm</Label>
                        <Input
                          value={deleteConfirm}
                          onChange={(e) => setDeleteConfirm(e.target.value)}
                          placeholder="Type DELETE to confirm"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button
                        variant="danger"
                        disabled={deleteConfirm !== "DELETE"}
                        onClick={() => { setDeleteDialogOpen(false); setDeleteConfirm("") }}
                      >
                        Delete My Account
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto"
    >
      <motion.div variants={containerVariants} className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Settings</h1>
        <motion.span
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, -10, 10, -5, 0] }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Palette className="h-6 w-6 text-primary" />
        </motion.span>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        <nav className="lg:w-64 shrink-0" aria-label="Settings sections">
          <div className="lg:sticky lg:top-6 space-y-1">
            {SETTINGS_SECTIONS.map((section) => {
              const Icon = section.icon
              const isActive = activeSection === section.id
              const isDanger = section.id === "delete-account"
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? isDanger
                        ? "bg-error/10 text-error"
                        : "bg-primary/10 text-primary"
                      : "text-text-secondary hover:bg-surface-secondary hover:text-text-primary"
                  )}
                  aria-current={isActive ? "true" : undefined}
                >
                  <Icon className={cn("h-4 w-4 shrink-0", isActive && isDanger && "text-error")} />
                  <span>{section.label}</span>
                  {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
                </button>
              )
            })}
          </div>
        </nav>

        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {renderSection()}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
