"use client"

import { useState, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FileSearch,
  Upload,
  FileText,
  Copy,
  Check,
  Download,
  Loader2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  MessageSquare,
  FileSpreadsheet,
  Highlighter,
  BookOpen,
  Send,
  X,
  Clock,
  File,
} from "lucide-react"
import { cn, formatDate, formatBytes, generateId } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import { toast } from "@/components/ui/toast"

const MAX_FILE_SIZE = 10 * 1024 * 1024
const ACCEPTED_TYPES = [".pdf"]
const MOCK_PAGES = 12
const MOCK_WORDS = 4532

const MOCK_SUMMARY = `# Document Analysis Report

## Overview
This document presents a comprehensive analysis of quarterly performance metrics across all major business divisions. The data covers Q1 through Q4 of the fiscal year, highlighting key trends, growth areas, and optimization opportunities.

## Key Findings

### Revenue Growth
- **Q1-Q2**: 15% increase in overall revenue driven by new product launches
- **Q3**: Plateau period with strategic reinvestment phase
- **Q4**: 22% surge in revenue attributed to holiday season and marketing campaigns

### Operational Efficiency
The analysis reveals a 30% improvement in operational efficiency following the implementation of automated workflows. Key areas of improvement include:
- Customer response time reduced by 45%
- Inventory management accuracy improved to 98.5%
- Supply chain costs decreased by 18%

### Market Expansion
The company successfully entered three new geographic markets:
1. Southeast Asia (Q1)
2. Latin America (Q2)
3. Middle East (Q3)

## Recommendations
1. Continue investment in AI-powered automation
2. Expand presence in emerging markets
3. Strengthen data analytics capabilities
4. Develop strategic partnerships in the Asia-Pacific region`

const MOCK_EXTRACTED_TEXT = `QUARTERLY PERFORMANCE REPORT - FISCAL YEAR 2024

Executive Summary
-----------------
The organization has demonstrated robust growth across all key performance indicators. Total revenue reached $12.5M, representing a 28% year-over-year increase.

Revenue Breakdown by Quarter
----------------------------
Q1 2024: $2.8M (22% of annual)
Q2 2024: $3.2M (26% of annual)
Q3 2024: $2.9M (23% of annual)
Q4 2024: $3.6M (29% of annual)

Department Performance
---------------------
Sales: +35% YoY growth
Marketing: +42% lead generation increase
Operations: 25% cost reduction
R&D: 15 new product prototypes

Key Metrics
-----------
Customer Acquisition Cost (CAC): $245
Customer Lifetime Value (CLV): $4,800
Net Promoter Score (NPS): 72
Employee Satisfaction: 4.2/5.0

Financial Highlights
--------------------
Gross Margin: 68%
Operating Margin: 24%
Net Profit: $2.1M
Cash Reserves: $8.4M`

const MOCK_HIGHLIGHTS = [
  {
    id: "h1",
    text: "Total revenue reached $12.5M, representing a 28% year-over-year increase",
    type: "financial",
    color: "border-l-4 border-l-success bg-success/5",
  },
  {
    id: "h2",
    text: "Customer response time reduced by 45% through automated workflows",
    type: "operational",
    color: "border-l-4 border-l-primary bg-primary/5",
  },
  {
    id: "h3",
    text: "Successfully entered three new geographic markets in FY2024",
    type: "strategic",
    color: "border-l-4 border-l-warning bg-warning/5",
  },
  {
    id: "h4",
    text: "Net Promoter Score improved to 72, indicating strong customer satisfaction",
    type: "customer",
    color: "border-l-4 border-l-[#8b5cf6] bg-[#8b5cf6]/5",
  },
  {
    id: "h5",
    text: "R&D department delivered 15 new product prototypes in the fiscal year",
    type: "innovation",
    color: "border-l-4 border-l-cyan-500 bg-cyan-500/5",
  },
  {
    id: "h6",
    text: "Supply chain costs decreased by 18% through strategic vendor consolidation",
    type: "operational",
    color: "border-l-4 border-l-primary bg-primary/5",
  },
]

const HIGHLIGHT_TYPE_LABELS: Record<string, string> = {
  financial: "Financial",
  operational: "Operational",
  strategic: "Strategic",
  customer: "Customer",
  innovation: "Innovation",
}

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
}

const MOCK_CHAT_RESPONSES = [
  "Based on the document analysis, the company achieved a 28% year-over-year revenue increase, reaching $12.5M. The strongest quarter was Q4 with $3.6M in revenue.",
  "The document highlights several key efficiency improvements: customer response time reduced by 45%, inventory management accuracy improved to 98.5%, and supply chain costs decreased by 18%.",
  "According to the report, the company expanded into three new markets: Southeast Asia, Latin America, and the Middle East during the fiscal year.",
  "The main recommendations include continued investment in AI-powered automation, expanding into emerging markets, strengthening data analytics capabilities, and developing strategic partnerships in the Asia-Pacific region.",
]

function getMockChatResponse(): string {
  return MOCK_CHAT_RESPONSES[Math.floor(Math.random() * MOCK_CHAT_RESPONSES.length)]
}

interface DocumentInfo {
  id: string
  name: string
  size: number
  pages: number
  uploadDate: Date
}

function UploadZone({
  onFileSelect,
  isUploading,
  progress,
}: {
  onFileSelect: (file: File) => void
  isUploading: boolean
  progress: number
}) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) onFileSelect(file)
    },
    [onFileSelect]
  )

  const handleClick = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) onFileSelect(file)
    },
    [onFileSelect]
  )

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      className={cn(
        "relative flex flex-col items-center justify-center py-16 px-6 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200",
        isDragging
          ? "border-primary bg-primary/5 scale-[1.02]"
          : "border-border hover:border-primary/50 hover:bg-surface-secondary/50"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handleInputChange}
      />
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-lg shadow-red-500/20 mb-6"
      >
        {isUploading ? (
          <Loader2 className="h-8 w-8 text-white animate-spin" />
        ) : (
          <Upload className="h-8 w-8 text-white" />
        )}
      </motion.div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">
        {isUploading ? "Uploading..." : "Upload your PDF document"}
      </h3>
      <p className="text-sm text-text-secondary text-center max-w-sm mb-4">
        Drag and drop your file here, or click to browse
      </p>
      <div className="flex items-center gap-3">
        <Badge variant="secondary" size="sm">
          <File className="h-3 w-3 mr-1" />
          PDF only
        </Badge>
        <Badge variant="secondary" size="sm">
          Max {formatBytes(MAX_FILE_SIZE)}
        </Badge>
      </div>
      {isUploading && (
        <div className="w-full max-w-sm mt-6">
          <Progress value={progress} variant="primary" showLabel />
        </div>
      )}
    </div>
  )
}

function DocumentInfoPanel({ doc }: { doc: DocumentInfo }) {
  return (
    <Card variant="glass">
      <CardContent className="p-4">
        <h3 className="text-sm font-medium text-text-primary mb-3 flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          Document Info
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-secondary">Name</span>
            <span className="text-xs text-text-primary font-medium truncate max-w-[180px]">{doc.name}</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-secondary">Size</span>
            <span className="text-xs text-text-primary font-medium">{formatBytes(doc.size)}</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-secondary">Pages</span>
            <span className="text-xs text-text-primary font-medium">{doc.pages}</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-secondary">Uploaded</span>
            <span className="text-xs text-text-primary font-medium flex items-center gap-1">
              <Clock className="h-3 w-3 text-text-tertiary" />
              {formatDate(doc.uploadDate)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-lg shadow-red-500/20 mb-6">
        <FileSearch className="h-8 w-8 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-text-primary mb-2">No document uploaded</h2>
      <p className="text-text-secondary max-w-md mb-8">
        Upload a PDF document to analyze its content, extract key information, and get AI-powered insights.
      </p>
    </motion.div>
  )
}

function AnalyzingState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
        </div>
        <div>
          <p className="text-sm font-medium text-text-primary">Analyzing document...</p>
          <p className="text-xs text-text-tertiary">Extracting text and generating insights</p>
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton variant="card" className="h-12 w-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <Skeleton variant="card" className="h-24 w-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    </motion.div>
  )
}

function SummaryTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2 mb-2">
        <BookOpen className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-text-primary">AI Summary</h3>
      </div>
      <div className="prose prose-sm dark:prose-invert max-w-none">
        {MOCK_SUMMARY.split("\n").map((line, i) => {
          if (line.startsWith("# ")) return <h1 key={i} className="text-xl font-bold text-text-primary mt-6 mb-2">{line.slice(2)}</h1>
          if (line.startsWith("## ")) return <h2 key={i} className="text-lg font-semibold text-text-primary mt-5 mb-2">{line.slice(3)}</h2>
          if (line.startsWith("### ")) return <h3 key={i} className="text-base font-medium text-text-primary mt-4 mb-1">{line.slice(4)}</h3>
          if (line.startsWith("- **")) {
            const match = line.match(/- \*\*(.+?)\*\*: (.+)/)
            if (match) return <li key={i} className="text-sm text-text-secondary ml-4 mb-1"><strong className="text-text-primary">{match[1]}:</strong> {match[2]}</li>
          }
          if (line.match(/^\d+\./)) return <li key={i} className="text-sm text-text-secondary ml-4 mb-1">{line}</li>
          if (line.trim() === "") return <div key={i} className="h-2" />
          return <p key={i} className="text-sm text-text-secondary leading-relaxed mb-2">{line}</p>
        })}
      </div>
    </motion.div>
  )
}

function extractTabMarkdown(): string {
  const lines = MOCK_EXTRACTED_TEXT.split("\n").map((l) => l.trim()).filter(Boolean)
  return lines.join("\n")
}

function ExtractTab() {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(extractTabMarkdown())
      setCopied(true)
      toast({ message: "Copied to clipboard", variant: "success" })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast({ message: "Failed to copy", variant: "error" })
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Extracted Content</h3>
        </div>
        <Button variant="secondary" size="sm" onClick={handleCopy} className="gap-1.5">
          {copied ? (
            <>
              <Check className="h-4 w-4 text-success" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy
            </>
          )}
        </Button>
      </div>
      <div className="p-4 rounded-lg bg-surface-secondary border border-border/50">
        <pre className="text-sm text-text-primary font-mono whitespace-pre-wrap leading-relaxed">{MOCK_EXTRACTED_TEXT}</pre>
      </div>
    </motion.div>
  )
}

function HighlightsTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2 mb-2">
        <Highlighter className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-text-primary">Key Highlights</h3>
      </div>
      <div className="space-y-3">
        {MOCK_HIGHLIGHTS.map((h) => (
          <motion.div
            key={h.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn("p-4 rounded-lg", h.color)}
          >
            <p className="text-sm text-text-primary leading-relaxed mb-2">&ldquo;{h.text}&rdquo;</p>
            <Badge variant="secondary" size="sm">
              {HIGHLIGHT_TYPE_LABELS[h.type] || h.type}
            </Badge>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function AskQuestionsTab() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "I've analyzed the document. What would you like to know about it?",
    },
  ])
  const [input, setInput] = useState("")
  const [isResponding, setIsResponding] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleSend = useCallback(async () => {
    if (!input.trim() || isResponding) return

    const userMsg: ChatMessage = {
      id: generateId(),
      role: "user",
      content: input.trim(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsResponding(true)

    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))

    const assistantMsg: ChatMessage = {
      id: generateId(),
      role: "assistant",
      content: getMockChatResponse(),
    }
    setMessages((prev) => [...prev, assistantMsg])
    setIsResponding(false)
  }, [input, isResponding])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2 mb-2">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-text-primary">Ask Questions</h3>
      </div>
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <ScrollArea className="h-[400px]">
          <div ref={scrollRef} className="p-4 space-y-4">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] p-3 rounded-xl text-sm",
                    msg.role === "user"
                      ? "bg-primary text-white rounded-br-sm"
                      : "bg-surface-secondary border border-border/50 text-text-primary rounded-bl-sm"
                  )}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}
            {isResponding && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-surface-secondary border border-border/50 rounded-xl rounded-bl-sm p-3 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm text-text-secondary">Thinking...</span>
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>
        <div className="flex items-center gap-2 p-3 border-t border-border">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about the document..."
            className="min-h-[40px] max-h-[120px] text-sm"
            rows={1}
            autoResize
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
          />
          <Button
            variant="primary"
            size="sm"
            className="h-9 w-9 p-0 shrink-0"
            disabled={!input.trim() || isResponding}
            onClick={handleSend}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export default function PdfAnalyzerPage() {
  const [doc, setDoc] = useState<DocumentInfo | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("summary")

  const handleFileSelect = useCallback(
    (file: File) => {
      setError(null)

      if (file.type !== "application/pdf") {
        setError("Only PDF files are accepted.")
        return
      }

      if (file.size > MAX_FILE_SIZE) {
        setError(`File size exceeds the ${formatBytes(MAX_FILE_SIZE)} limit.`)
        return
      }

      setIsUploading(true)
      setUploadProgress(0)
      setAnalysisComplete(false)

      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          const next = prev + Math.random() * 15
          if (next >= 100) {
            clearInterval(interval)
            return 100
          }
          return next
        })
      }, 200)

      setTimeout(() => {
        clearInterval(interval)
        setUploadProgress(100)
        setIsUploading(false)

        const newDoc: DocumentInfo = {
          id: generateId(),
          name: file.name,
          size: file.size,
          pages: MOCK_PAGES,
          uploadDate: new Date(),
        }
        setDoc(newDoc)
        setIsAnalyzing(true)

        setTimeout(() => {
          setIsAnalyzing(false)
          setAnalysisComplete(true)
          setActiveTab("summary")
          toast({ message: "Document analysis complete!", variant: "success" })
        }, 2000)
      }, 2000)
    },
    []
  )

  const handleReset = useCallback(() => {
    setDoc(null)
    setIsUploading(false)
    setUploadProgress(0)
    setIsAnalyzing(false)
    setAnalysisComplete(false)
    setError(null)
    setActiveTab("summary")
  }, [])

  const handleDownloadReport = useCallback(() => {
    const report = `# AI Document Analysis Report\n\n${MOCK_SUMMARY}\n\n## Extracted Text\n\n${MOCK_EXTRACTED_TEXT}`
    const filename = `${doc?.name.replace(".pdf", "") || "document"}-analysis-${Date.now()}.md`
    const blob = new Blob([report], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
    toast({ message: `Report downloaded as ${filename}`, variant: "success" })
  }, [doc])

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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-lg shadow-red-500/20">
            <FileSearch className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary">PDF Analyzer</h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="text-text-secondary text-sm"
            >
              Upload and analyze PDF documents with AI-powered insights
            </motion.p>
          </div>
        </div>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 rounded-xl bg-error/5 border border-error/20"
        >
          <AlertCircle className="h-5 w-5 text-error shrink-0" />
          <p className="text-sm text-error flex-1">{error}</p>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setError(null)}>
            <X className="h-4 w-4" />
          </Button>
        </motion.div>
      )}

      <div className={cn("grid gap-6", doc && analysisComplete ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-1")}>
        <div className={cn(doc && analysisComplete ? "lg:col-span-2" : "")}>
          {!doc && !isUploading && !isAnalyzing && (
            <UploadZone
              onFileSelect={handleFileSelect}
              isUploading={false}
              progress={0}
            />
          )}

          {isUploading && (
            <UploadZone
              onFileSelect={handleFileSelect}
              isUploading
              progress={uploadProgress}
            />
          )}

          {isAnalyzing && doc && (
            <Card variant="glass">
              <AnalyzingState />
            </Card>
          )}

          {analysisComplete && doc && (
            <Card variant="glass">
              <CardContent className="p-4 md:p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList variant="pills" className="w-full mb-6">
                    <TabsTrigger value="summary" icon={<BookOpen className="h-4 w-4" />}>
                      Summary
                    </TabsTrigger>
                    <TabsTrigger value="questions" icon={<MessageSquare className="h-4 w-4" />}>
                      Ask Questions
                    </TabsTrigger>
                    <TabsTrigger value="extract" icon={<FileSpreadsheet className="h-4 w-4" />}>
                      Extract
                    </TabsTrigger>
                    <TabsTrigger value="highlights" icon={<Highlighter className="h-4 w-4" />}>
                      Highlights
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="summary">
                    <SummaryTab />
                  </TabsContent>
                  <TabsContent value="questions">
                    <AskQuestionsTab />
                  </TabsContent>
                  <TabsContent value="extract">
                    <ExtractTab />
                  </TabsContent>
                  <TabsContent value="highlights">
                    <HighlightsTab />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}

          {!doc && !isUploading && !isAnalyzing && (
            <div className="mt-6">
              <EmptyState />
            </div>
          )}
        </div>

        {doc && analysisComplete && (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <DocumentInfoPanel doc={doc} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
            >
              <Card variant="glass">
                <CardContent className="p-4 space-y-3">
                  <h3 className="text-sm font-medium text-text-primary">Actions</h3>
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full gap-2"
                    onClick={handleDownloadReport}
                  >
                    <Download className="h-4 w-4" />
                    Download Report
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full gap-2"
                    onClick={handleReset}
                  >
                    <RefreshCw className="h-4 w-4" />
                    Analyze New PDF
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card variant="glass">
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium text-text-primary mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Stats
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-surface-secondary border border-border/50 text-center">
                      <p className="text-lg font-bold text-text-primary">{doc.pages}</p>
                      <p className="text-xs text-text-secondary">Pages</p>
                    </div>
                    <div className="p-3 rounded-lg bg-surface-secondary border border-border/50 text-center">
                      <p className="text-lg font-bold text-text-primary">{MOCK_WORDS.toLocaleString()}</p>
                      <p className="text-xs text-text-secondary">Words</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
