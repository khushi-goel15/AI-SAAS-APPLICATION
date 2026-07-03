"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Languages,
  ArrowRight,
  ArrowLeft,
  Copy,
  Check,
  Download,
  Volume2,
  RefreshCw,
  Loader2,
  AlertCircle,
  History,
  ChevronDown,
  ChevronUp,
  Trash2,
  Repeat,
  Globe,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { LANGUAGES } from "@/constants"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/toast"

interface HistoryItem {
  id: string
  sourceLang: string
  targetLang: string
  sourceText: string
  translatedText: string
  timestamp: Date
}

function mockTranslate(text: string): string {
  const reversed = text.split("").reverse().join("")
  return `${reversed} [translated]`
}

function getLanguageName(code: string): string {
  if (code === "auto") return "Auto Detect"
  const lang = LANGUAGES.find((l) => l.code === code)
  return lang ? lang.native : code
}

function TranslatorSkeleton() {
  return (
    <div className="space-y-4 p-1">
      <Skeleton variant="card" className="h-12 w-full" />
      <Skeleton variant="card" className="h-12 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </div>
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
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-6">
        <Languages className="h-8 w-8 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-text-primary mb-2">Ready to translate?</h2>
      <p className="text-text-secondary max-w-md mb-8">
        Enter text in the source language, select your target language, and translate instantly.
      </p>
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
      <h3 className="text-lg font-semibold text-text-primary mb-2">Translation failed</h3>
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
                <p className="text-sm text-text-secondary">No translations yet</p>
                <p className="text-xs text-text-tertiary mt-1">Your translations will appear here</p>
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
                      <Globe className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {item.sourceText.slice(0, 60)}
                      </p>
                      <p className="text-xs text-text-tertiary mt-0.5">
                        {getLanguageName(item.sourceLang)} → {getLanguageName(item.targetLang)} · {new Intl.DateTimeFormat("en-US", {
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

export default function TranslatorPage() {
  const [sourceLang, setSourceLang] = useState("auto")
  const [targetLang, setTargetLang] = useState("es")
  const [sourceText, setSourceText] = useState("")
  const [translatedText, setTranslatedText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [historyCollapsed, setHistoryCollapsed] = useState(true)

  const hasTranslation = translatedText.length > 0
  const canSwap = sourceLang !== "auto"

  const handleTranslate = useCallback(async () => {
    if (!sourceText.trim()) return

    setIsLoading(true)
    setError(null)
    setTranslatedText("")

    try {
      await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 1200))
      const result = mockTranslate(sourceText)
      setTranslatedText(result)

      const newItem: HistoryItem = {
        id: Math.random().toString(36).substring(2, 15),
        sourceLang,
        targetLang,
        sourceText: sourceText.trim(),
        translatedText: result,
        timestamp: new Date(),
      }
      setHistory((prev) => [newItem, ...prev].slice(0, 20))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Translation failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }, [sourceText, sourceLang, targetLang])

  const handleSwap = useCallback(() => {
    if (sourceLang === "auto") return
    const temp = sourceLang
    setSourceLang(targetLang)
    setTargetLang(temp)
    setTranslatedText("")
    setError(null)
  }, [sourceLang, targetLang])

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(translatedText)
      setCopied(true)
      toast({ message: "Copied to clipboard", variant: "success" })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast({ message: "Failed to copy", variant: "error" })
    }
  }, [translatedText])

  const handleDownload = useCallback(() => {
    const filename = `translation-${Date.now()}.txt`
    const blob = new Blob([translatedText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
    toast({ message: `Downloaded as ${filename}`, variant: "success" })
  }, [translatedText])

  const handleSpeakTranslated = useCallback(() => {
    toast({ message: "Text-to-speech played (mock)", variant: "info" })
  }, [])

  const handleSpeakSource = useCallback(() => {
    toast({ message: "Source text speech played (mock)", variant: "info" })
  }, [])

  const handleHistorySelect = useCallback((item: HistoryItem) => {
    setSourceLang(item.sourceLang)
    setTargetLang(item.targetLang)
    setSourceText(item.sourceText)
    setTranslatedText(item.translatedText)
    setHistoryCollapsed(true)
  }, [])

  const handleClearHistory = useCallback(() => {
    setHistory([])
    toast({ message: "History cleared", variant: "info" })
  }, [])

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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Languages className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary">AI Translator</h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="text-text-secondary text-sm"
            >
              Break language barriers with AI-powered translations
            </motion.p>
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
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 items-end">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">Source Language</label>
                    <Select value={sourceLang} onValueChange={setSourceLang}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">🌐 Auto Detect</SelectItem>
                        {LANGUAGES.map((l) => (
                          <SelectItem key={l.code} value={l.code}>
                            {l.native}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <motion.button
                    whileHover={{ scale: canSwap ? 1.1 : 1 }}
                    whileTap={{ scale: canSwap ? 0.9 : 1 }}
                    onClick={handleSwap}
                    disabled={!canSwap}
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-xl border transition-all duration-200 mx-auto",
                      canSwap
                        ? "border-border bg-surface-secondary hover:bg-surface-tertiary cursor-pointer text-text-primary"
                        : "border-border/50 bg-surface-secondary/50 text-text-tertiary cursor-not-allowed"
                    )}
                    aria-label="Swap languages"
                  >
                    <Repeat className="h-4 w-4" />
                  </motion.button>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">Target Language</label>
                    <Select value={targetLang} onValueChange={setTargetLang}>
                      <SelectTrigger className="w-full">
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
                  <Globe className="h-4 w-4 text-primary" />
                  <label className="text-sm font-medium text-text-primary">Source Text</label>
                </div>
                <Textarea
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  placeholder="Enter text to translate..."
                  className="min-h-[140px] resize-y"
                  rows={5}
                  showCharCount
                />
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    {sourceLang !== "auto" && (
                      <Badge variant="secondary" size="sm">
                        {getLanguageName(sourceLang)}
                      </Badge>
                    )}
                    <Badge variant="secondary" size="sm">
                      <ArrowRight className="h-3 w-3 mr-1" />
                      {getLanguageName(targetLang)}
                    </Badge>
                  </div>
                  <Button
                    variant="primary"
                    size="md"
                    disabled={!sourceText.trim() || isLoading}
                    loading={isLoading}
                    onClick={handleTranslate}
                    className="gap-2 min-w-[140px]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Translating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Translate
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
                        <p className="text-sm font-medium text-text-primary">Translating...</p>
                        <p className="text-xs text-text-tertiary">Processing your text</p>
                      </div>
                    </div>
                    <TranslatorSkeleton />
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
                    <ErrorState message={error} onRetry={handleTranslate} />
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {!hasTranslation && !isLoading && !error && (
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

            {hasTranslation && !isLoading && (
              <motion.div
                key="translated"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Card variant="glass">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Languages className="h-4 w-4 text-primary" />
                        <label className="text-sm font-medium text-text-primary">Translation</label>
                      </div>
                      <Badge variant="secondary" size="sm">
                        {getLanguageName(targetLang)}
                      </Badge>
                    </div>
                    <div className="p-4 rounded-lg bg-surface-secondary border border-border/50 mb-4">
                      <p className="text-text-primary leading-relaxed whitespace-pre-wrap">{translatedText}</p>
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
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={handleSpeakTranslated}
                          className="gap-1.5"
                        >
                          <Volume2 className="h-4 w-4" />
                          Speak
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleSpeakSource}
                          className="gap-1.5"
                        >
                          <Volume2 className="h-4 w-4" />
                          Source
                        </Button>
                      </div>
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
                  <Sparkles className="h-4 w-4 text-primary" />
                  Quick Tips
                </h3>
                <ul className="space-y-2">
                  <li className="text-xs text-text-secondary flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    Use Auto Detect to let AI identify the source language
                  </li>
                  <li className="text-xs text-text-secondary flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    Click the swap button to quickly reverse languages
                  </li>
                  <li className="text-xs text-text-secondary flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    Longer texts may take more time to translate
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
