"use client"

import { useState, useCallback, useRef, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism"
import {
  Code,
  Sparkles,
  Copy,
  Check,
  Download,
  RefreshCw,
  Loader2,
  Terminal,
  FileCode,
  Monitor,
  Eye,
  EyeOff,
  WrapText,
  Sun,
  Moon,
  AlertCircle,
  Lightbulb,
  Zap,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { CODE_LANGUAGES } from "@/constants"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"

type ThemeMode = "dark" | "light"

const LANGUAGE_EXTENSIONS: Record<string, string> = {
  react: "jsx",
  nextjs: "tsx",
  html: "html",
  css: "css",
  javascript: "js",
  typescript: "ts",
  python: "py",
  sql: "sql",
}

const LANGUAGE_SYNTAX_MAP: Record<string, string> = {
  react: "jsx",
  nextjs: "tsx",
  html: "html",
  css: "css",
  javascript: "javascript",
  typescript: "typescript",
  python: "python",
  sql: "sql",
}

const SUGGESTED_PROMPTS = [
  "Create a React hook for managing local storage",
  "Build a REST API with Express and TypeScript",
  "Write a SQL query to join multiple tables",
  "Create a responsive CSS grid layout",
  "Build a Python data processing pipeline",
]

const MOCK_CODE: Record<string, string> = {
  react: `import { useState, useCallback, useEffect } from "react"

interface UseLocalStorageOptions<T> {
  key: string
  initialValue: T
  serialize?: (value: T) => string
  deserialize?: (value: string) => T
}

export function useLocalStorage<T>({
  key,
  initialValue,
  serialize = JSON.stringify,
  deserialize = JSON.parse,
}: UseLocalStorageOptions<T>) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? deserialize(item) : initialValue
    } catch (error) {
      console.error(\`Error reading localStorage key "\${key}":\`, error)
      return initialValue
    }
  })

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)
        window.localStorage.setItem(key, serialize(valueToStore))
      } catch (error) {
        console.error(\`Error setting localStorage key "\${key}":\`, error)
      }
    },
    [key, storedValue, serialize]
  )

  const remove = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
    } catch (error) {
      console.error(\`Error removing localStorage key "\${key}":\`, error)
    }
  }, [key, initialValue])

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(deserialize(e.newValue))
        } catch {
          // ignore parse errors
        }
      }
    }
    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [key, deserialize])

  return [storedValue, setValue, remove] as const
}`,
  nextjs: `import { NextApiRequest, NextApiResponse } from "next"
import { createRouter } from "next-connect"
import prisma from "@/lib/prisma"
import { withAuth } from "@/middleware/auth"
import { z } from "zod"

const router = createRouter<NextApiRequest, NextApiResponse>()

const createTaskSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  dueDate: z.string().datetime().optional(),
})

router
  .use(withAuth)
  .get(async (req, res) => {
    const tasks = await prisma.task.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    })
    return res.status(200).json({ tasks })
  })
  .post(async (req, res) => {
    const parsed = createTaskSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: parsed.error.flatten(),
      })
    }
    const task = await prisma.task.create({
      data: {
        ...parsed.data,
        userId: req.user.id,
      },
    })
    return res.status(201).json({ task })
  })

export default router.handler({
  onError: (err, req, res) => {
    console.error(err)
    res.status(500).json({ error: "Internal server error" })
  },
})`,
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Responsive Dashboard</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <div class="dashboard">
    <aside class="sidebar">
      <nav class="nav">
        <div class="logo">
          <svg class="logo-icon" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="6" fill="#6366f1"/>
          </svg>
          <span class="logo-text">AppName</span>
        </div>
        <ul class="nav-list">
          <li class="nav-item active">
            <svg class="nav-icon"><use href="#icon-home"/></svg>
            <span>Dashboard</span>
          </li>
          <li class="nav-item">
            <svg class="nav-icon"><use href="#icon-analytics"/></svg>
            <span>Analytics</span>
          </li>
          <li class="nav-item">
            <svg class="nav-icon"><use href="#icon-settings"/></svg>
            <span>Settings</span>
          </li>
        </ul>
      </nav>
    </aside>
    <main class="main-content">
      <header class="header">
        <h1>Welcome back, User</h1>
        <div class="header-actions">
          <input type="search" placeholder="Search..." class="search-input" />
          <button class="btn btn-primary">New Project</button>
        </div>
      </header>
      <section class="grid">
        <div class="card">
          <h3>Total Revenue</h3>
          <p class="stat">$45,231</p>
          <span class="trend up">+20.1%</span>
        </div>
        <div class="card">
          <h3>Active Users</h3>
          <p class="stat">2,350</p>
          <span class="trend up">+12.5%</span>
        </div>
        <div class="card">
          <h3>Sales</h3>
          <p class="stat">1,234</p>
          <span class="trend down">-3.2%</span>
        </div>
      </section>
    </main>
  </div>
</body>
</html>`,
  css: `/* Modern CSS Reset & Layout System */

:root {
  --primary: #6366f1;
  --primary-dark: #4f46e5;
  --surface: #ffffff;
  --surface-secondary: #f8fafc;
  --text: #0f172a;
  --text-secondary: #64748b;
  --border: #e2e8f0;
  --radius: 12px;
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: var(--text);
  background: var(--surface-secondary);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

.dashboard {
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: 100vh;
}

.sidebar {
  background: var(--surface);
  border-right: 1px solid var(--border);
  padding: 1.5rem;
}

.nav-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: 2rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--text-secondary);
}

.nav-item:hover {
  background: var(--surface-secondary);
  color: var(--text);
}

.nav-item.active {
  background: var(--primary);
  color: white;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
}

.card {
  background: var(--surface);
  border-radius: var(--radius);
  padding: 1.5rem;
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
}

.stat {
  font-size: 2rem;
  font-weight: 700;
  margin-top: 0.5rem;
}

.trend {
  font-size: 0.875rem;
  font-weight: 500;
}

.trend.up { color: #22c55e; }
.trend.down { color: #ef4444; }

@media (max-width: 768px) {
  .dashboard {
    grid-template-columns: 1fr;
  }
  .sidebar {
    display: none;
  }
}`,
  javascript: `// Debounce utility with TypeScript-ready JSDoc annotations
// Limits how often a function can be called

/**
 * Creates a debounced function that delays invoking func
 * until after wait milliseconds have elapsed since the
 * last time the debounced function was invoked.
 *
 * @param {Function} func - The function to debounce
 * @param {number} wait - Milliseconds to wait
 * @param {boolean} [immediate=false] - Trigger on leading edge
 * @returns {Function} Debounced function with cancel method
 */
function debounce(func, wait, immediate = false) {
  let timeoutId = null
  let lastArgs = null
  let lastThis = null
  let result = null

  function later() {
    timeoutId = null
    if (!immediate) {
      result = func.apply(lastThis, lastArgs)
      lastArgs = lastThis = null
    }
  }

  function debounced(...args) {
    lastArgs = args
    lastThis = this

    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    } else if (immediate) {
      result = func.apply(lastThis, lastArgs)
      lastArgs = lastThis = null
    }

    timeoutId = setTimeout(later, wait)
    return result
  }

  debounced.cancel = function () {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
    lastArgs = lastThis = null
  }

  debounced.flush = function () {
    if (timeoutId !== null) {
      later()
    }
  }

  return debounced
}

// Example usage
const logSearch = debounce(
  (query) => console.log("Searching for:", query),
  300
)

document.getElementById("search").addEventListener("input", (e) => {
  logSearch(e.target.value)
})`,
  typescript: `import { createClient, SupabaseClient } from "@supabase/supabase-js"
import { Database } from "@/types/supabase"

type TableName = keyof Database["public"]["Tables"]
type TableRow<T extends TableName> = Database["public"]["Tables"][T]["Row"]
type TableInsert<T extends TableName> =
  Database["public"]["Tables"][T]["Insert"]

interface PaginationParams {
  page: number
  pageSize: number
}

interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}

export class BaseRepository<T extends TableName> {
  protected client: SupabaseClient<Database>
  protected tableName: T

  constructor(tableName: T) {
    const client = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    this.client = client
    this.tableName = tableName
  }

  async findAll(
    params: PaginationParams & { filters?: Record<string, unknown> }
  ): Promise<PaginatedResult<TableRow<T>>> {
    const { page, pageSize, filters } = params
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let query = this.client
      .from(this.tableName)
      .select("*", { count: "exact" })
      .range(from, to)

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value)
        }
      })
    }

    const { data, count, error } = await query

    if (error) throw new Error(error.message)

    const total = count ?? 0
    const totalPages = Math.ceil(total / pageSize)

    return {
      data: (data ?? []) as TableRow<T>[],
      total,
      page,
      pageSize,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    }
  }

  async findById(id: string): Promise<TableRow<T> | null> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select("*")
      .eq("id", id)
      .single()

    if (error) throw new Error(error.message)
    return data as TableRow<T> | null
  }

  async create(input: TableInsert<T>): Promise<TableRow<T>> {
    const { data, error } = await this.client
      .from(this.tableName)
      .insert(input)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data as TableRow<T>
  }

  async update(
    id: string,
    input: Partial<TableInsert<T>>
  ): Promise<TableRow<T>> {
    const { data, error } = await this.client
      .from(this.tableName)
      .update(input)
      .eq("id", id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data as TableRow<T>
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client
      .from(this.tableName)
      .delete()
      .eq("id", id)

    if (error) throw new Error(error.message)
  }
}`,
  python: `from typing import List, Dict, Optional, Any
from dataclasses import dataclass, field
from datetime import datetime
import json
import csv
from pathlib import Path


@dataclass
class DataRecord:
    id: str
    timestamp: datetime
    source: str
    metadata: Dict[str, Any] = field(default_factory=dict)
    raw_data: Optional[str] = None


class DataPipeline:
    def __init__(self, batch_size: int = 100):
        self.batch_size = batch_size
        self.processors: List[callable] = []
        self.records: List[DataRecord] = []

    def add_processor(self, fn: callable) -> "DataPipeline":
        self.processors.append(fn)
        return self

    def load_csv(self, filepath: str) -> "DataPipeline":
        path = Path(filepath)
        if not path.exists():
            raise FileNotFoundError(f"File not found: {filepath}")

        with path.open(newline="") as f:
            reader = csv.DictReader(f)
            for row in reader:
                record = DataRecord(
                    id=str(len(self.records)),
                    timestamp=datetime.now(),
                    source=filepath,
                    metadata=row,
                )
                self.records.append(record)

        return self

    def load_json(self, filepath: str) -> "DataPipeline":
        path = Path(filepath)
        if not path.exists():
            raise FileNotFoundError(f"File not found: {filepath}")

        with path.open() as f:
            data = json.load(f)
            for item in data if isinstance(data, list) else [data]:
                record = DataRecord(
                    id=str(len(self.records)),
                    timestamp=datetime.now(),
                    source=filepath,
                    raw_data=json.dumps(item),
                    metadata=item if isinstance(item, dict) else {},
                )
                self.records.append(record)

        return self

    def run(self) -> List[DataRecord]:
        result = []
        for i in range(0, len(self.records), self.batch_size):
            batch = self.records[i : i + self.batch_size]
            processed = batch
            for processor in self.processors:
                processed = [processor(r) for r in processed]
            result.extend(processed)
        return result


pipeline = (
    DataPipeline(batch_size=50)
    .load_csv("data/input.csv")
    .add_processor(lambda r: DataRecord(
        id=r.id,
        timestamp=r.timestamp,
        source=r.source,
        metadata={**r.metadata, "processed": True},
    ))
)

results = pipeline.run()
print(f"Processed {len(results)} records")`,
  sql: `-- Advanced Analytics Query: Customer Lifetime Value
WITH customer_orders AS (
    SELECT
        c.customer_id,
        c.first_name || ' ' || c.last_name AS customer_name,
        c.email,
        MIN(o.order_date) AS first_order_date,
        MAX(o.order_date) AS last_order_date,
        COUNT(DISTINCT o.order_id) AS total_orders,
        SUM(o.total_amount) AS total_revenue,
        AVG(o.total_amount) AS avg_order_value
    FROM customers c
    INNER JOIN orders o ON c.customer_id = o.customer_id
    WHERE o.status NOT IN ('cancelled', 'refunded')
    GROUP BY c.customer_id, c.first_name, c.last_name, c.email
),

recency_scores AS (
    SELECT
        customer_id,
        CASE
            WHEN last_order_date >= CURRENT_DATE - INTERVAL '30 days' THEN 5
            WHEN last_order_date >= CURRENT_DATE - INTERVAL '90 days' THEN 4
            WHEN last_order_date >= CURRENT_DATE - INTERVAL '180 days' THEN 3
            WHEN last_order_date >= CURRENT_DATE - INTERVAL '365 days' THEN 2
            ELSE 1
        END AS recency_score
    FROM customer_orders
),

frequency_scores AS (
    SELECT
        customer_id,
        CASE
            WHEN total_orders >= 20 THEN 5
            WHEN total_orders >= 10 THEN 4
            WHEN total_orders >= 5 THEN 3
            WHEN total_orders >= 2 THEN 2
            ELSE 1
        END AS frequency_score
    FROM customer_orders
),

monetary_scores AS (
    SELECT
        customer_id,
        CASE
            WHEN total_revenue >= 10000 THEN 5
            WHEN total_revenue >= 5000 THEN 4
            WHEN total_revenue >= 1000 THEN 3
            WHEN total_revenue >= 500 THEN 2
            ELSE 1
        END AS monetary_score
    FROM customer_orders
)

SELECT
    co.customer_id,
    co.customer_name,
    co.email,
    co.total_orders,
    co.total_revenue,
    co.avg_order_value,
    rs.recency_score,
    fs.frequency_score,
    ms.monetary_score,
    (rs.recency_score + fs.frequency_score + ms.monetary_score) AS rfm_total,
    CASE
        WHEN (rs.recency_score + fs.frequency_score + ms.monetary_score) >= 13 THEN 'Champion'
        WHEN (rs.recency_score + fs.frequency_score + ms.monetary_score) >= 10 THEN 'Loyal'
        WHEN (rs.recency_score + fs.frequency_score + ms.monetary_score) >= 7 THEN 'Potential'
        WHEN (rs.recency_score + fs.frequency_score + ms.monetary_score) >= 4 THEN 'At Risk'
        ELSE 'Lost'
    END AS customer_segment
FROM customer_orders co
INNER JOIN recency_scores rs ON co.customer_id = rs.customer_id
INNER JOIN frequency_scores fs ON co.customer_id = fs.customer_id
INNER JOIN monetary_scores ms ON co.customer_id = ms.customer_id
ORDER BY rfm_total DESC, total_revenue DESC
LIMIT 100`,
}

function getMockCode(language: string): string {
  return MOCK_CODE[language] || MOCK_CODE.typescript
}

function getFileExtension(language: string): string {
  return LANGUAGE_EXTENSIONS[language] || "txt"
}

function getSyntaxLanguage(language: string): string {
  return LANGUAGE_SYNTAX_MAP[language] || "typescript"
}

function CodeSkeleton() {
  return (
    <div className="space-y-3 p-4">
      <div className="flex items-center gap-2 pb-3 border-b border-border/50">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20 ml-auto" />
      </div>
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-3.5 w-8 shrink-0" />
          <Skeleton
            className={`h-3.5 ${
              i % 3 === 0 ? "w-3/4" : i % 3 === 1 ? "w-1/2" : "w-2/3"
            }`}
          />
        </div>
      ))}
    </div>
  )
}

function EmptyState({
  onSelectPrompt,
}: {
  onSelectPrompt: (prompt: string) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-6">
        <Code className="h-8 w-8 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-text-primary mb-2">
        What code would you like to generate?
      </h2>
      <p className="text-text-secondary max-w-md mb-8">
        Describe the code you need in plain English, and AI will generate it
        for you.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
        {SUGGESTED_PROMPTS.map((prompt, i) => (
          <motion.button
            key={prompt}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.05 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectPrompt(prompt)}
            className="flex items-start gap-3 p-4 rounded-xl border border-border/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm hover:bg-surface-secondary hover:border-primary/30 transition-all duration-200 text-left group"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <p className="text-sm font-medium text-text-primary leading-snug">
              {prompt}
            </p>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string
  onRetry: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="w-14 h-14 rounded-2xl bg-error/10 flex items-center justify-center mb-4">
        <AlertCircle className="h-7 w-7 text-error" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">
        Generation failed
      </h3>
      <p className="text-sm text-text-secondary text-center max-w-sm mb-6">
        {message}
      </p>
      <Button variant="primary" onClick={onRetry} className="gap-2">
        <RefreshCw className="h-4 w-4" />
        Try Again
      </Button>
    </motion.div>
  )
}

export default function CodeGeneratorPage() {
  const [language, setLanguage] = useState("typescript")
  const [prompt, setPrompt] = useState("")
  const [output, setOutput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [theme, setTheme] = useState<ThemeMode>("dark")
  const [wordWrap, setWordWrap] = useState(true)
  const [showPreview, setShowPreview] = useState(false)
  const outputRef = useRef<HTMLDivElement>(null)

  const hasOutput = output.length > 0
  const canPreview =
    language === "html" || language === "react"

  const syntaxTheme = theme === "dark" ? oneDark : oneLight
  const syntaxLanguage = getSyntaxLanguage(language)
  const fileExtension = getFileExtension(language)

  const languageLabel =
    CODE_LANGUAGES.find((l) => l.value === language)?.label || "Code"

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return

    setIsLoading(true)
    setError(null)
    setOutput("")

    try {
      await new Promise((resolve) =>
        setTimeout(resolve, 1200 + Math.random() * 1800)
      )
      const code = getMockCode(language)
      setOutput(code)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate code. Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }, [prompt, language])

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      toast({ message: "Copied to clipboard", variant: "success" })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast({ message: "Failed to copy", variant: "error" })
    }
  }, [output])

  const handleDownload = useCallback(() => {
    const filename = `generated-${language}-${Date.now()}.${fileExtension}`
    const blob = new Blob([output], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
    toast({ message: `Downloaded as ${filename}`, variant: "success" })
  }, [output, language, fileExtension])

  const handleRegenerate = useCallback(() => {
    handleGenerate()
  }, [handleGenerate])

  const handleSelectPrompt = useCallback((p: string) => {
    setPrompt(p)
  }, [])

  const previewHtml = useMemo(() => {
    if (!canPreview || !output) return ""
    if (language === "html") {
      return output
    }
    return ""
  }, [canPreview, language, output])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto"
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Code className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
              AI Code Generator
            </h1>
            <p className="text-text-secondary text-sm">
              Generate production-ready code with AI assistance
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card variant="glass">
            <CardContent className="p-4 md:p-6">
              <label className="text-sm font-medium text-text-primary mb-3 block">
                Language / Stack
              </label>
              <div className="flex flex-wrap gap-2">
                {CODE_LANGUAGES.map((lang) => {
                  const isActive = language === lang.value
                  return (
                    <motion.button
                      key={lang.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setLanguage(lang.value)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border",
                        isActive
                          ? "bg-primary text-white border-primary shadow-sm shadow-primary/20"
                          : "bg-surface-secondary text-text-secondary border-border hover:bg-surface-tertiary hover:text-text-primary"
                      )}
                    >
                      <FileCode className="h-4 w-4" />
                      {lang.label}
                    </motion.button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card variant="glass">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-2 mb-3">
                <Terminal className="h-4 w-4 text-primary" />
                <label className="text-sm font-medium text-text-primary">
                  Code Description
                </label>
              </div>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={`Describe the ${languageLabel} code you want to generate...`}
                className="min-h-[120px] resize-y font-mono text-sm"
                rows={4}
              />
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" size="sm">
                    <FileCode className="h-3 w-3 mr-1" />
                    {languageLabel}
                  </Badge>
                </div>
                <Button
                  variant="primary"
                  size="md"
                  disabled={!prompt.trim() || isLoading}
                  loading={isLoading}
                  onClick={handleGenerate}
                  className="gap-2 min-w-[140px]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Card variant="glass" className="overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-border/50 bg-surface-secondary/50">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Loader2 className="h-4 w-4 text-primary animate-spin" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      Generating {languageLabel} code...
                    </p>
                    <p className="text-xs text-text-tertiary">
                      Writing clean, production-ready code
                    </p>
                  </div>
                </div>
                <CodeSkeleton />
              </Card>
            </motion.div>
          )}

          {error && !isLoading && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Card variant="glass">
                <CardContent className="p-4 md:p-6">
                  <ErrorState message={error} onRetry={handleGenerate} />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {!hasOutput && !isLoading && !error && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Card variant="glass">
                <CardContent className="p-4 md:p-6">
                  <EmptyState onSelectPrompt={handleSelectPrompt} />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {hasOutput && !isLoading && (
            <motion.div
              key="output"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              ref={outputRef}
            >
              <Card
                variant="glass"
                className="overflow-hidden border-0"
              >
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#1e1e2e] dark:bg-[#1e1e2e] bg-[#fafafa] dark:bg-[#1e1e2e] border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-error" />
                      <span className="w-3 h-3 rounded-full bg-warning" />
                      <span className="w-3 h-3 rounded-full bg-success" />
                    </div>
                    <Badge
                      variant="secondary"
                      size="sm"
                      className="font-mono text-[10px]"
                    >
                      {languageLabel}.{fileExtension}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    {canPreview && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => setShowPreview(!showPreview)}
                        aria-label={
                          showPreview ? "Hide preview" : "Show preview"
                        }
                      >
                        {showPreview ? (
                          <EyeOff className="h-3.5 w-3.5" />
                        ) : (
                          <Monitor className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => setWordWrap(!wordWrap)}
                      aria-label={wordWrap ? "Disable word wrap" : "Enable word wrap"}
                    >
                      <WrapText
                        className={cn(
                          "h-3.5 w-3.5",
                          wordWrap && "text-primary"
                        )}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() =>
                        setTheme(theme === "dark" ? "light" : "dark")
                      }
                      aria-label={
                        theme === "dark"
                          ? "Switch to light theme"
                          : "Switch to dark theme"
                      }
                    >
                      {theme === "dark" ? (
                        <Sun className="h-3.5 w-3.5" />
                      ) : (
                        <Moon className="h-3.5 w-3.5" />
                      )}
                    </Button>
                    <Separator orientation="vertical" className="h-5 mx-1" />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 gap-1 text-xs"
                      onClick={handleCopy}
                    >
                      {copied ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-success" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          Copy
                        </>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 gap-1 text-xs"
                      onClick={handleDownload}
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 gap-1 text-xs"
                      onClick={handleRegenerate}
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Regenerate
                    </Button>
                  </div>
                </div>

                {showPreview && canPreview && (
                  <div className="border-b border-border/50">
                    <div className="flex items-center gap-2 px-4 py-2 bg-surface-secondary/50">
                      <Eye className="h-3.5 w-3.5 text-text-secondary" />
                      <span className="text-xs font-medium text-text-secondary">
                        Live Preview
                      </span>
                    </div>
                    <iframe
                      srcDoc={previewHtml}
                      title="Live Preview"
                      className="w-full h-[400px] bg-white"
                      sandbox="allow-scripts"
                    />
                  </div>
                )}

                <ScrollArea className="max-h-[600px]">
                  <SyntaxHighlighter
                    language={syntaxLanguage}
                    style={syntaxTheme}
                    showLineNumbers
                    wrapLines
                    wrapLongLines={wordWrap}
                    customStyle={{
                      margin: 0,
                      borderRadius: 0,
                      fontSize: "13px",
                      lineHeight: "1.6",
                      fontFamily:
                        "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
                    }}
                    lineNumberStyle={{
                      minWidth: "2.5em",
                      paddingRight: "1em",
                      color: theme === "dark" ? "#636d83" : "#a0aec0",
                      userSelect: "none",
                    }}
                  >
                    {output}
                  </SyntaxHighlighter>
                </ScrollArea>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
