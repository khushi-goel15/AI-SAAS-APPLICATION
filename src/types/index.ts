export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: "user" | "admin"
  createdAt: Date
  usage: Usage
}

export interface Usage {
  chatQueries: number
  chatLimit: number
  wordsGenerated: number
  wordLimit: number
  imagesGenerated: number
  imageLimit: number
  storageUsed: number
  storageLimit: number
}

export interface Chat {
  id: string
  title: string
  messages: Message[]
  pinned: boolean
  createdAt: Date
  updatedAt: Date
  model: string
}

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export interface Workspace {
  id: string
  name: string
  icon: string
  members: number
}

export interface Notification {
  id: string
  title: string
  description: string
  read: boolean
  createdAt: Date
  type: "info" | "success" | "warning" | "error"
}

export interface Project {
  id: string
  name: string
  description: string
  type: "chat" | "writer" | "code" | "image" | "resume" | "translator" | "pdf"
  updatedAt: Date
  starred: boolean
}

export interface PricingPlan {
  id: string
  name: string
  description: string
  price: number
  interval: "month" | "year"
  features: string[]
  highlighted?: boolean
  cta: string
}

export interface Invoice {
  id: string
  date: Date
  amount: number
  status: "paid" | "pending" | "failed"
  description: string
}

export interface AdminStats {
  totalUsers: number
  activeUsers: number
  revenue: number
  growth: number
  queriesToday: number
  newUsersToday: number
  supportTickets: number
  systemUptime: number
}

export interface SupportTicket {
  id: string
  user: string
  subject: string
  status: "open" | "in-progress" | "resolved"
  priority: "low" | "medium" | "high"
  createdAt: Date
}

export type Theme = "light" | "dark" | "system"
export type Language = "en" | "es" | "fr" | "de" | "zh" | "ja"
export type AIModel = "gpt-4" | "gpt-3.5" | "claude-3" | "gemini-pro"
export type Tone = "professional" | "casual" | "creative" | "academic" | "friendly"
export type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3" | "3:4"
export type ImageStyle = "realistic" | "artistic" | "3d-render" | "pixel-art" | "anime" | "sketch"
export type ResumeTemplate = "modern" | "classic" | "minimal" | "creative" | "executive"
