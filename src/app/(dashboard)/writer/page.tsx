"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import {
  Pen,
  Sparkles,
  Copy,
  Check,
  Download,
  RefreshCw,
  RotateCcw,
  FileText,
  Lightbulb,
  MessageSquare,
  Mail,
  ShoppingBag,
  Linkedin,
  Twitter,
  Instagram,
  FileEdit,
  BookOpen,
  Loader2,
  Clock,
  ChevronDown,
  ChevronUp,
  History,
  Trash2,
  AlertCircle,
  Palette,
  Type,
  Globe,
  Sliders,
  Wand2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { CONTENT_TYPES, TONES, LANGUAGES } from "@/constants"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/toast"

const CONTENT_TYPE_ICONS: Record<string, typeof FileText> = {
  blog: FileText,
  email: Mail,
  product: ShoppingBag,
  linkedin: Linkedin,
  twitter: Twitter,
  instagram: Instagram,
  "cover-letter": FileEdit,
  essay: BookOpen,
}

const SAMPLE_CONTENT: Record<string, Record<string, string>> = {
  blog: {
    professional: `# The Future of Artificial Intelligence in Business

Artificial intelligence is reshaping the business landscape at an unprecedented pace. Organizations across every sector are leveraging AI to drive innovation, streamline operations, and create competitive advantages.

## Understanding the AI Revolution

### Current State of AI Adoption
According to recent studies, over 70% of enterprises are actively exploring or implementing AI solutions. This widespread adoption is driven by:

- **Enhanced Decision Making**: AI algorithms can process vast amounts of data to uncover patterns and insights that humans might miss
- **Operational Efficiency**: Automation of routine tasks frees up employees to focus on higher-value activities
- **Personalized Experiences**: Machine learning models enable unprecedented levels of customer personalization

### Key Areas of Impact

\`\`\`
AI Impact Metrics (2024-2026):
├── Customer Service: 40% cost reduction
├── Supply Chain: 35% efficiency improvement
├── Marketing: 45% ROI increase
└── Product Development: 50% faster iteration
\`\`\`

## Implementation Strategies

Successful AI implementation requires a thoughtful approach:

1. **Start with Clear Objectives** — Identify specific business problems AI can solve
2. **Invest in Data Infrastructure** — Quality data is the foundation of effective AI
3. **Build Cross-Functional Teams** — Combine domain expertise with technical skills
4. **Prioritize Ethics and Governance** — Responsible AI builds trust and mitigates risk

> "Artificial intelligence is not just a technology; it's a fundamental shift in how we approach business problems." — Industry Expert

## Looking Ahead

The next wave of AI innovation promises even greater transformation. From quantum computing to advanced natural language processing, the possibilities are boundless. Organizations that embrace AI today will be positioned to lead in the intelligent economy of tomorrow.`,
    casual: `Hey there! Let's chat about AI in business — it's honestly pretty exciting stuff!

So here's the deal: AI is changing how companies work. Like, really changing it. Think of it as having a super-smart assistant that never sleeps and can process millions of data points while you grab coffee.

## What's Actually Happening?

Companies are jumping on the AI bandwagon hard:
- Making smarter decisions (AI finds patterns we'd never spot)
- Saving time on boring tasks (let robots do the repetitive stuff)
- Treating customers like VIPs (personalization at scale)

## Quick Win Ideas

Want to get started? Try these:
1. Automate your email responses
2. Use AI for content ideas
3. Let AI help with data analysis
4. Chatbots for customer support

The bottom line? AI isn't going anywhere, and the sooner you start playing with it, the better off you'll be. Trust me on this one! 😊`,
  },
  email: {
    professional: `Subject: Strategic Partnership Opportunity — AI Solutions Integration

Dear [Recipient],

I hope this message finds you well.

I am writing to explore a potential collaboration between our organizations. After careful analysis of your company's innovative approach to [Industry], I believe there is significant mutual benefit in discussing how our AI-powered solutions could complement your existing operations.

## Value Proposition

Our platform has demonstrated:
- **40% increase** in operational efficiency
- **60% reduction** in manual processing time
- **95% accuracy** in predictive analytics

## Proposed Next Steps

1. A brief introductory call to align on objectives
2. A tailored demonstration of relevant capabilities
3. A pilot program to validate ROI

I would welcome the opportunity to discuss this further at your convenience. Please let me know a time that works for you.

Best regards,
[Your Name]`,
    casual: `Subject: Hey, let's team up! 🚀

Hey [Name],

Hope you're doing awesome!

I've been looking at what you guys are doing at [Company] and I think we could create something really cool together. Our AI tools have been helping companies just like yours save tons of time and money.

## Here's what we've been up to:

✨ Helping teams cut their workload in half
🎯 Making data-driven decisions way easier
💡 Automating the boring stuff so your team can focus on the fun stuff

Up for a quick chat this week? Coffee's on me ☕

Cheers,
[Your Name]`,
  },
}

function getPlaceholder(type: string): string {
  const placeholders: Record<string, string> = {
    blog: "Enter your blog post topic or outline...",
    email: "Describe the purpose and recipient of your email...",
    product: "Describe your product and its key features...",
    linkedin: "What would you like to share on LinkedIn?",
    twitter: "What's on your mind? Keep it under 280 characters...",
    instagram: "Describe the photo and vibe for your caption...",
    "cover-letter": "Enter the job title and company you're applying to...",
    essay: "Enter your essay topic or thesis statement...",
  }
  return placeholders[type] || "Enter your content prompt..."
}

function getMockResponse(contentType: string, tone: string, prompt: string): string {
  const byTone = SAMPLE_CONTENT[contentType]
  if (byTone && byTone[tone]) return byTone[tone]

  if (byTone) {
    const firstTone = Object.keys(byTone)[0]
    if (firstTone) return byTone[firstTone]
  }

  return `# Generated ${contentType} Content

Here is your generated content in a **${tone}** tone based on: "${prompt.slice(0, 50)}..."

## Key Highlights

- Content tailored to your requirements
- Written in a ${tone} style
- Optimized for your selected format

## Content

This is simulated AI-generated content. In production, this would be replaced with actual AI model output. The generation would consider your selected tone, creativity level, word count, and language preferences.

> *"The best way to predict the future is to create it."* — Peter Drucker

---
*Generated by AI Writer • ${new Date().toLocaleDateString()}*
`
}

interface HistoryItem {
  id: string
  contentType: string
  tone: string
  prompt: string
  content: string
  timestamp: Date
}

const TIPS = [
  { icon: Lightbulb, text: "Be specific about your topic for better results" },
  { icon: Palette, text: "Choose a tone that matches your audience" },
  { icon: Type, text: "Set a word count to control output length" },
  { icon: Wand2, text: "Higher creativity produces more varied content" },
]

function estimateReadTime(text: string): string {
  const words = text.split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.round(words / 200))
  return `${minutes} min read`
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length
}

function WriterSkeleton() {
  return (
    <div className="space-y-4 p-1">
      <Skeleton variant="card" className="h-12 w-full" />
      <Skeleton variant="card" className="h-32 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      <Skeleton variant="card" className="h-24 w-full" />
    </div>
  )
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20 mb-6">
        <Sparkles className="h-8 w-8 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-text-primary mb-2">Ready to write something amazing?</h2>
      <p className="text-text-secondary max-w-md mb-8">
        Select a content type, configure your preferences, and let AI create compelling content for you.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
        {TIPS.map((tip, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.05 }}
            className="flex items-start gap-3 p-4 rounded-xl border border-border/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <tip.icon className="h-4 w-4 text-primary" />
            </div>
            <p className="text-sm text-text-secondary text-left leading-snug">{tip.text}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="w-14 h-14 rounded-2xl bg-error/10 flex items-center justify-center mb-4">
        <AlertCircle className="h-7 w-7 text-error" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">Generation failed</h3>
      <p className="text-sm text-text-secondary text-center max-w-sm mb-6">{message}</p>
      <Button variant="primary" onClick={onRetry} className="gap-2">
        <RefreshCw className="h-4 w-4" />
        Try Again
      </Button>
    </motion.div>
  )
}

function HistoryPanel({
  items,
  onSelect,
  onClear,
  collapsed,
  onToggle,
}: {
  items: HistoryItem[]
  onSelect: (item: HistoryItem) => void
  onClear: () => void
  collapsed: boolean
  onToggle: () => void
}) {
  return (
    <div className={cn(
      "border border-border/50 rounded-xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl transition-all duration-300",
      collapsed ? "overflow-hidden" : ""
    )}>
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-text-secondary" />
          <span className="text-sm font-medium text-text-primary">History</span>
          <Badge variant="secondary" size="sm">{items.length}</Badge>
        </div>
        {collapsed ? (
          <ChevronDown className="h-4 w-4 text-text-tertiary" />
        ) : (
          <ChevronUp className="h-4 w-4 text-text-tertiary" />
        )}
      </button>
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <Separator />
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                <History className="h-8 w-8 text-text-tertiary mb-2" />
                <p className="text-sm text-text-secondary">No generations yet</p>
                <p className="text-xs text-text-tertiary mt-1">Your generated content will appear here</p>
              </div>
            ) : (
              <div className="p-2 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onSelect(item)}
                    className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-surface-secondary transition-colors text-left group"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      {(() => {
                        const Icon = CONTENT_TYPE_ICONS[item.contentType] || FileText
                        return <Icon className="h-4 w-4 text-primary" />
                      })()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {item.prompt.slice(0, 60)}
                      </p>
                      <p className="text-xs text-text-tertiary mt-0.5">
                        {item.tone} · {new Intl.DateTimeFormat("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        }).format(new Date(item.timestamp))}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {items.length > 0 && (
              <>
                <Separator />
                <div className="p-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full gap-1.5 text-text-tertiary hover:text-error"
                    onClick={onClear}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Clear History
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function WriterPage() {
  const [contentType, setContentType] = useState("blog")
  const [tone, setTone] = useState("professional")
  const [creativity, setCreativity] = useState([50])
  const [wordCount, setWordCount] = useState("500")
  const [language, setLanguage] = useState("en")
  const [prompt, setPrompt] = useState("")
  const [output, setOutput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [historyCollapsed, setHistoryCollapsed] = useState(true)
  const [showConfig, setShowConfig] = useState(true)
  const outputRef = useRef<HTMLDivElement>(null)

  const hasOutput = output.length > 0

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return

    setIsLoading(true)
    setError(null)
    setOutput("")

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1500))

      const result = getMockResponse(contentType, tone, prompt)

      setOutput(result)

      const newItem: HistoryItem = {
        id: Math.random().toString(36).substring(2, 15),
        contentType,
        tone,
        prompt: prompt.trim(),
        content: result,
        timestamp: new Date(),
      }
      setHistory((prev) => [newItem, ...prev].slice(0, 20))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate content. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }, [prompt, contentType, tone])

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
    const extension = contentType === "email" ? "txt" : "md"
    const filename = `${contentType}-${Date.now()}.${extension}`
    const blob = new Blob([output], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
    toast({ message: `Downloaded as ${filename}`, variant: "success" })
  }, [output, contentType])

  const handleRegenerate = useCallback(() => {
    handleGenerate()
  }, [handleGenerate])

  const handleHistorySelect = useCallback((item: HistoryItem) => {
    setContentType(item.contentType)
    setTone(item.tone)
    setPrompt(item.prompt)
    setOutput(item.content)
    setHistoryCollapsed(true)
    setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth" }), 100)
  }, [])

  const handleClearHistory = useCallback(() => {
    setHistory([])
    toast({ message: "History cleared", variant: "info" })
  }, [])

  const contentTypeIcon = CONTENT_TYPE_ICONS[contentType] || FileText
  const ContentTypeIcon = contentTypeIcon

  const wordCountNum = countWords(output)

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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Pen className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary">AI Writer</h1>
            <p className="text-text-secondary text-sm">Generate compelling content with AI assistance</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card variant="glass">
              <CardContent className="p-4 md:p-6">
                <label className="text-sm font-medium text-text-primary mb-3 block">
                  Content Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {CONTENT_TYPES.map((type) => {
                    const Icon = CONTENT_TYPE_ICONS[type.value] || FileText
                    const isActive = contentType === type.value
                    return (
                      <motion.button
                        key={type.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setContentType(type.value)}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border",
                          isActive
                            ? "bg-primary text-white border-primary shadow-sm shadow-primary/20"
                            : "bg-surface-secondary text-text-secondary border-border hover:bg-surface-tertiary hover:text-text-primary"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {type.label}
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
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-text-primary">
                    Configuration
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs gap-1"
                    onClick={() => setShowConfig(!showConfig)}
                  >
                    {showConfig ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    {showConfig ? "Hide" : "Show"}
                  </Button>
                </div>
                <AnimatePresence>
                  {showConfig && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-text-secondary flex items-center gap-1.5">
                            <Palette className="h-3.5 w-3.5" />
                            Tone
                          </label>
                          <Select value={tone} onValueChange={setTone}>
                            <SelectTrigger className="h-9 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {TONES.map((t) => (
                                <SelectItem key={t.value} value={t.value}>
                                  {t.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-medium text-text-secondary flex items-center gap-1.5">
                            <Sliders className="h-3.5 w-3.5" />
                            Creativity ({creativity[0]})
                          </label>
                          <Slider
                            value={creativity}
                            onValueChange={setCreativity}
                            min={0}
                            max={100}
                            step={1}
                            className="pt-1"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-medium text-text-secondary flex items-center gap-1.5">
                            <Type className="h-3.5 w-3.5" />
                            Word Count
                          </label>
                          <input
                            type="number"
                            value={wordCount}
                            onChange={(e) => setWordCount(e.target.value)}
                            min={50}
                            max={5000}
                            step={50}
                            className="w-full h-9 px-3 rounded-lg border border-border bg-surface text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-medium text-text-secondary flex items-center gap-1.5">
                            <Globe className="h-3.5 w-3.5" />
                            Language
                          </label>
                          <Select value={language} onValueChange={setLanguage}>
                            <SelectTrigger className="h-9 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {LANGUAGES.map((l) => (
                                <SelectItem key={l.code} value={l.code}>
                                  {l.native}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card variant="glass">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-2 mb-3">
                  <ContentTypeIcon className="h-4 w-4 text-primary" />
                  <label className="text-sm font-medium text-text-primary">
                    {CONTENT_TYPES.find((t) => t.value === contentType)?.label || "Content"} Prompt
                  </label>
                </div>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={getPlaceholder(contentType)}
                  className="min-h-[140px] resize-y"
                  rows={5}
                />
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" size="sm">
                      <ContentTypeIcon className="h-3 w-3 mr-1" />
                      {CONTENT_TYPES.find((t) => t.value === contentType)?.label}
                    </Badge>
                    <Badge variant="secondary" size="sm">
                      <Palette className="h-3 w-3 mr-1" />
                      {TONES.find((t) => t.value === tone)?.label}
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
                <Card variant="glass">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Loader2 className="h-4 w-4 text-primary animate-spin" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary">Generating your content...</p>
                        <p className="text-xs text-text-tertiary">Crafting the perfect response</p>
                      </div>
                    </div>
                    <WriterSkeleton />
                  </CardContent>
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
                    <EmptyState />
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
                <Card variant="glass">
                  <CardHeader className="pb-0">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Generated Content
                      </CardTitle>
                      <div className="flex items-center gap-1">
                        <Badge variant="secondary" size="sm">
                          <Type className="h-3 w-3 mr-1" />
                          {wordCountNum} words
                        </Badge>
                        <Badge variant="secondary" size="sm">
                          <Clock className="h-3 w-3 mr-1" />
                          {estimateReadTime(output)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 pt-4">
                    <div className="prose prose-sm dark:prose-invert max-w-none mb-6">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {output}
                      </ReactMarkdown>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={handleCopy}
                          className="gap-1.5"
                        >
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
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={handleDownload}
                          className="gap-1.5"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      </div>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleRegenerate}
                        loading={isLoading}
                        className="gap-1.5"
                      >
                        <RotateCcw className="h-4 w-4" />
                        Regenerate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <HistoryPanel
              items={history}
              onSelect={handleHistorySelect}
              onClear={handleClearHistory}
              collapsed={historyCollapsed}
              onToggle={() => setHistoryCollapsed(!historyCollapsed)}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Card variant="glass">
              <CardContent className="p-4">
                <h3 className="text-sm font-medium text-text-primary mb-3 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-primary" />
                  Quick Tips
                </h3>
                <ul className="space-y-2">
                  <li className="text-xs text-text-secondary flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    Be specific with your prompt for more relevant results
                  </li>
                  <li className="text-xs text-text-secondary flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    Experiment with different tones to match your audience
                  </li>
                  <li className="text-xs text-text-secondary flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    Use the regenerate option to get variations
                  </li>
                  <li className="text-xs text-text-secondary flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    Higher creativity = more diverse outputs
                  </li>
                  <li className="text-xs text-text-secondary flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    Set word count to control content length
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
