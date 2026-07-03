"use client"

import * as React from "react"
import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import {
  MessageSquare,
  Plus,
  Search,
  Pin,
  PinOff,
  Trash2,
  Send,
  Sparkles,
  Bot,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  AlertCircle,
  Loader2,
  Clock,
  Edit3,
  X,
  PanelLeftClose,
  PanelLeft,
  FileDown,
  Zap,
} from "lucide-react"
import { cn, formatDate, generateId } from "@/lib/utils"
import { useChatStore } from "@/store/use-chat-store"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/toast"
import type { Message, Chat } from "@/types"

const MODELS = [
  { value: "gpt-4", label: "GPT-4", description: "Most capable model", color: "text-purple-500" },
  { value: "gpt-3.5", label: "GPT-3.5", description: "Fast and efficient", color: "text-green-500" },
  { value: "claude-3", label: "Claude 3", description: "Balanced reasoning", color: "text-orange-500" },
  { value: "gemini-pro", label: "Gemini Pro", description: "Multimodal expert", color: "text-blue-500" },
]

const SUGGESTED_PROMPTS = [
  "Explain quantum computing in simple terms",
  "Write a Python function to sort a list",
  "What are the best practices for React performance?",
  "Create a healthy meal plan for a week",
  "Explain the difference between SQL and NoSQL databases",
  "Write a short story about a robot learning to paint",
]

const SIMULATED_RESPONSES: Record<string, string> = {
  default: `That's a great question! Let me provide you with a comprehensive answer.

## Key Points

Here are the main things to consider:

1. **First Principle**: Understanding the fundamentals is crucial
2. **Practical Application**: Theory without practice is incomplete
3. **Continuous Learning**: The field evolves rapidly

### Example

\`\`\`typescript
interface Response {
  content: string
  helpful: boolean
  timestamp: Date
}

const answer: Response = {
  content: "Here's your detailed response!",
  helpful: true,
  timestamp: new Date(),
}
\`\`\`

> "The only way to do great work is to love what you do." — Steve Jobs

I hope this explanation helps! Let me know if you'd like me to elaborate on any specific aspect.
`,
  quantum: `Quantum computing is a fascinating field that leverages quantum mechanics to process information in fundamentally new ways.

## What Makes Quantum Computing Different?

| Aspect | Classical | Quantum |
|--------|-----------|---------|
| Basic Unit | Bit (0 or 1) | Qubit (0, 1, or both) |
| Processing | Sequential | Parallel via superposition |
| Speed | Linear scaling | Exponential for certain problems |

### Superposition
Unlike classical bits that are either 0 or 1, qubits can exist in multiple states simultaneously. This is like a spinning coin that's both heads and tails until it lands.

### Entanglement
When qubits become entangled, measuring one instantly determines the state of another, regardless of distance. Einstein called this "spooky action at a distance."

\`\`\`python
# Simple quantum circuit simulation
import numpy as np

def hadamard_gate(qubit):
    """Apply Hadamard gate to create superposition"""
    H = np.array([[1, 1], [1, -1]]) / np.sqrt(2)
    return H @ qubit

qubit = np.array([1, 0])  # |0⟩ state
superposed = hadamard_gate(qubit)
print(f"Superposed state: {superposed}")
\`\`\`

The potential applications include cryptography, drug discovery, and optimization problems that would take classical computers millennia to solve.
`,
  python: `Here's a clean implementation of sorting algorithms in Python:

## Quick Sort Implementation

\`\`\`python
from typing import List

def quick_sort(arr: List[int]) -> List[int]:
    """Sort an array using the quicksort algorithm.
    
    Time complexity: O(n log n) average, O(n²) worst case
    Space complexity: O(log n)
    """
    if len(arr) <= 1:
        return arr
    
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    
    return quick_sort(left) + middle + quick_sort(right)

# Example usage
data = [64, 34, 25, 12, 22, 11, 90]
sorted_data = quick_sort(data)
print(f"Original: {data}")
print(f"Sorted: {sorted_data}")
\`\`\`

### Merge Sort Alternative

\`\`\`python
def merge_sort(arr: List[int]) -> List[int]:
    if len(arr) <= 1:
        return arr
    
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    return merge(left, right)

def merge(left: List[int], right: List[int]) -> List[int]:
    result = []
    i = j = 0
    
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    result.extend(left[i:])
    result.extend(right[j:])
    return result
\`\`\`

Both algorithms have O(n log n) time complexity. Quick sort is typically faster in practice, while merge sort is stable and has guaranteed performance.
`,
}

function getSimulatedResponse(prompt: string): string {
  const lower = prompt.toLowerCase()
  if (lower.includes("quantum")) return SIMULATED_RESPONSES.quantum
  if (lower.includes("python") || lower.includes("sort") || lower.includes("code") || lower.includes("function")) return SIMULATED_RESPONSES.python
  return SIMULATED_RESPONSES.default
}

function formatMessageTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date))
}

function getModelBadgeColor(model: string): string {
  const m = MODELS.find((m) => m.value === model)
  return m?.color || "text-text-secondary"
}

function CodeBlock({ className, children, language: lang }: { className?: string; children: React.ReactNode; language?: string }) {
  const [copied, setCopied] = useState(false)
  const codeRef = useRef<HTMLPreElement>(null)

  const codeText = useMemo(() => {
    let text = ""
    const extract = (node: React.ReactNode) => {
      if (typeof node === "string") text += node
      else if (typeof node === "number") text += String(node)
      else if (React.isValidElement(node)) {
        const element = node as React.ReactElement<{ children?: React.ReactNode }>
        React.Children.forEach(element.props.children, extract)
      }
    }
    React.Children.forEach(children, extract)
    return text
  }, [children])

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(codeText)
      setCopied(true)
      toast({ message: "Copied to clipboard", variant: "success" })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast({ message: "Failed to copy", variant: "error" })
    }
  }, [codeText])

  const language = lang || (className?.match(/language-(\w+)/)?.[1]) || "code"

  return (
    <div className="relative group my-4 rounded-xl overflow-hidden border border-border">
      <div className="flex items-center justify-between px-4 py-2 bg-surface-secondary border-b border-border">
        <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-text-tertiary hover:text-text-primary transition-colors px-2 py-1 rounded-md hover:bg-surface-tertiary"
          aria-label={copied ? "Copied" : "Copy code"}
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
        </button>
      </div>
      <pre ref={codeRef} className="p-4 overflow-x-auto bg-[#0d1117] text-sm leading-relaxed scrollbar-custom">
        <code className={className}>{children}</code>
      </pre>
    </div>
  )
}

function InlineCode({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <code
      className={cn(
        "bg-surface-secondary px-1.5 py-0.5 rounded-md text-sm font-mono text-primary border border-border",
        className
      )}
      {...props}
    >
      {children}
    </code>
  )
}

const markdownComponents = {
  code({ className, children, ...props }: any) {
    const match = /language-(\w+)/.exec(className || "")
    const isInline = !match
    if (isInline) {
      return <InlineCode className={className} {...props}>{children}</InlineCode>
    }
    return <CodeBlock className={className} language={match[1]}>{children}</CodeBlock>
  },
  pre({ children }: any) {
    return <>{children}</>
  },
  table({ children }: any) {
    return (
      <div className="my-4 overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">{children}</table>
      </div>
    )
  },
  th({ children, ...props }: any) {
    return <th className="px-4 py-3 bg-surface-secondary font-medium text-text-primary text-left border-b border-border" {...props}>{children}</th>
  },
  td({ children, ...props }: any) {
    return <td className="px-4 py-3 border-t border-border text-text-secondary" {...props}>{children}</td>
  },
  blockquote({ children }: any) {
    return (
      <blockquote className="my-4 pl-4 border-l-4 border-primary bg-primary/5 rounded-r-lg py-2 pr-4 text-text-secondary italic">
        {children}
      </blockquote>
    )
  },
  a({ href, children }: any) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-600 underline underline-offset-2 decoration-primary/30 hover:decoration-primary/60 transition-colors">
        {children}
      </a>
    )
  },
  ul({ children }: any) {
    return <ul className="my-3 space-y-1.5 list-disc pl-6 text-text-secondary">{children}</ul>
  },
  ol({ children }: any) {
    return <ol className="my-3 space-y-1.5 list-decimal pl-6 text-text-secondary">{children}</ol>
  },
  h1({ children }: any) {
    return <h1 className="text-2xl font-bold mt-6 mb-3 text-text-primary">{children}</h1>
  },
  h2({ children }: any) {
    return <h2 className="text-xl font-semibold mt-5 mb-2 text-text-primary">{children}</h2>
  },
  h3({ children }: any) {
    return <h3 className="text-lg font-semibold mt-4 mb-2 text-text-primary">{children}</h3>
  },
  p({ children }: any) {
    return <p className="my-2 leading-relaxed text-text-secondary">{children}</p>
  },
  hr() {
    return <Separator className="my-6" />
  },
}

function MessageBubble({ message, isStreaming, streamingContent }: { message: Message; isStreaming?: boolean; streamingContent?: string }) {
  const isUser = message.role === "user"
  const displayContent = isStreaming ? streamingContent || "" : message.content

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn("flex items-start gap-3 mb-6", isUser ? "flex-row-reverse" : "flex-row")}
    >
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center",
          isUser
            ? "bg-gradient-to-br from-primary-500 to-primary-700 shadow-sm shadow-primary/20"
            : "bg-gradient-to-br from-surface-tertiary to-border"
        )}
      >
        {isUser ? (
          <span className="text-xs font-bold text-white">U</span>
        ) : (
          <Bot className="h-4 w-4 text-text-primary" />
        )}
      </div>

      <div className={cn("flex flex-col max-w-[80%] md:max-w-[70%]", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "relative px-4 py-3 rounded-2xl",
            isUser
              ? "bg-gradient-to-br from-primary to-primary-600 text-white rounded-tr-md shadow-sm shadow-primary/20"
              : "bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-border/50 rounded-tl-md shadow-sm"
          )}
        >
          {isStreaming && !displayContent ? (
            <div className="flex items-center gap-1.5 py-2">
              <motion.span
                className="w-2 h-2 rounded-full bg-primary"
                animate={{ opacity: [0, 1, 0], y: [0, -4, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
              />
              <motion.span
                className="w-2 h-2 rounded-full bg-primary"
                animate={{ opacity: [0, 1, 0], y: [0, -4, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: 0.15 }}
              />
              <motion.span
                className="w-2 h-2 rounded-full bg-primary"
                animate={{ opacity: [0, 1, 0], y: [0, -4, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: 0.3 }}
              />
            </div>
          ) : isUser ? (
            <p className="text-sm leading-relaxed text-white whitespace-pre-wrap">{displayContent}</p>
          ) : (
            <article className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={markdownComponents}
              >
                {displayContent}
              </ReactMarkdown>
            </article>
          )}
        </div>

        {!isStreaming && (
          <div className={cn("flex items-center gap-2 mt-1.5", isUser ? "flex-row-reverse" : "flex-row")}>
            <span className="text-[10px] text-text-tertiary flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatMessageTime(new Date(message.timestamp))}
            </span>
            {isUser && (
              <span className="text-[10px] text-text-tertiary">•</span>
            )}
            {isUser && (
              <span className="text-[10px] text-text-tertiary">Sent</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

function MessageSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className={cn("flex items-start gap-3 mb-6", i % 2 === 0 ? "flex-row" : "flex-row-reverse")}>
          <Skeleton variant="circular" className="h-8 w-8 shrink-0" />
          <div className={cn("flex flex-col", i % 2 === 0 ? "items-start" : "items-end")}>
            <Skeleton
              variant="card"
              className={cn(
                "h-24 rounded-2xl border border-border/50",
                i % 2 === 0 ? "rounded-tl-md" : "rounded-tr-md"
              )}
            />
            <Skeleton variant="text" className="h-3 w-16 mt-1.5" />
          </div>
        </div>
      ))}
    </div>
  )
}

function WelcomeScreen({ onSelectPrompt, onNewChat }: { onSelectPrompt: (prompt: string) => void; onNewChat: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center justify-center min-h-[60vh] px-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary/20 mb-6"
      >
        <Sparkles className="h-8 w-8 text-white" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="text-2xl md:text-3xl font-bold text-text-primary mb-2 text-center"
      >
        How can I help you today?
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="text-text-secondary text-center max-w-md mb-8"
      >
        I'm your AI assistant. Ask me anything — from coding to creative writing, I'm here to help.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl"
      >
        {SUGGESTED_PROMPTS.map((prompt, index) => (
          <motion.button
            key={prompt}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectPrompt(prompt)}
            className="flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm hover:bg-surface-secondary hover:border-primary/30 transition-all duration-200 text-left group"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-medium text-text-primary leading-snug">{prompt}</span>
          </motion.button>
        ))}
      </motion.div>
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
      <h3 className="text-lg font-semibold text-text-primary mb-2">Something went wrong</h3>
      <p className="text-sm text-text-secondary text-center max-w-sm mb-6">{message}</p>
      <Button variant="primary" onClick={onRetry} className="gap-2">
        <Loader2 className="h-4 w-4" />
        Try Again
      </Button>
    </motion.div>
  )
}

function ChatSidebar({
  isOpen,
  onToggle,
  onNewChat,
}: {
  isOpen: boolean
  onToggle: () => void
  onNewChat: () => void
}) {
  const { chats, activeChat, setActiveChat, deleteChat, togglePinChat } = useChatStore()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredChats = useMemo(() => {
    if (!searchQuery) return chats
    return chats.filter((c) => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [chats, searchQuery])

  const pinnedChats = useMemo(() => filteredChats.filter((c) => c.pinned), [filteredChats])
  const regularChats = useMemo(() => filteredChats.filter((c) => !c.pinned), [filteredChats])

  return (
    <>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={onToggle}
        />
      )}

      <motion.aside
        initial={{ width: 0, opacity: 0 }}
        animate={isOpen ? { width: 320, opacity: 1 } : { width: 0, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "relative flex-shrink-0 border-r border-border/50 bg-surface/90 backdrop-blur-xl overflow-hidden",
          "lg:relative fixed lg:static inset-y-0 left-0 z-40 lg:z-auto"
        )}
      >
        <div className="w-80 h-full flex flex-col">
          <div className="p-4 border-b border-border/50">
            <div className="flex items-center gap-2 mb-3">
              <Button
                variant="primary"
                size="sm"
                className="flex-1 gap-1.5"
                onClick={onNewChat}
              >
                <Plus className="h-4 w-4" />
                New Chat
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-9 w-9 shrink-0" onClick={onToggle}>
                      <PanelLeftClose className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Close sidebar</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-surface-secondary text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          <ScrollArea className="flex-1 px-2 py-2">
            {pinnedChats.length > 0 && (
              <div className="mb-3">
                <div className="flex items-center gap-2 px-3 py-2">
                  <Pin className="h-3.5 w-3.5 text-text-tertiary" />
                  <span className="text-xs font-medium text-text-tertiary uppercase tracking-wider">Pinned</span>
                </div>
                <div className="space-y-0.5">
                  {pinnedChats.map((chat) => (
                    <ChatListItem
                      key={chat.id}
                      chat={chat}
                      isActive={chat.id === activeChat}
                      onSelect={() => setActiveChat(chat.id)}
                      onDelete={() => deleteChat(chat.id)}
                      onTogglePin={() => togglePinChat(chat.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="mb-3">
              <div className="flex items-center gap-2 px-3 py-2">
                <MessageSquare className="h-3.5 w-3.5 text-text-tertiary" />
                <span className="text-xs font-medium text-text-tertiary uppercase tracking-wider">
                  {searchQuery ? "Search Results" : "Recent Chats"}
                </span>
              </div>
              {regularChats.length === 0 && pinnedChats.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <MessageSquare className="h-10 w-10 text-text-tertiary mb-3" />
                  <p className="text-sm text-text-secondary font-medium">No conversations yet</p>
                  <p className="text-xs text-text-tertiary mt-1">Start a new chat to begin</p>
                </div>
              )}
              <div className="space-y-0.5">
                {regularChats.map((chat) => (
                  <ChatListItem
                    key={chat.id}
                    chat={chat}
                    isActive={chat.id === activeChat}
                    onSelect={() => setActiveChat(chat.id)}
                    onDelete={() => deleteChat(chat.id)}
                    onTogglePin={() => togglePinChat(chat.id)}
                  />
                ))}
              </div>
            </div>
          </ScrollArea>

          <div className="p-3 border-t border-border/50">
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-surface-secondary">
              <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-text-primary">AI Workspace</p>
                <p className="text-[10px] text-text-tertiary">Chat history</p>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  )
}

function ChatListItem({
  chat,
  isActive,
  onSelect,
  onDelete,
  onTogglePin,
}: {
  chat: Chat
  isActive: boolean
  onSelect: () => void
  onDelete: () => void
  onTogglePin: () => void
}) {
  const [showDelete, setShowDelete] = useState(false)

  return (
    <>
      <motion.button
        layout
        onClick={onSelect}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group relative",
          isActive
            ? "bg-primary/10 text-primary"
            : "hover:bg-surface-secondary text-text-secondary hover:text-text-primary"
        )}
      >
        <MessageSquare className="h-4 w-4 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className={cn("text-sm font-medium truncate", isActive && "text-primary")}>
            {chat.title}
          </p>
          <p className="text-[10px] text-text-tertiary mt-0.5">
            {formatDate(new Date(chat.updatedAt))}
            {chat.messages.length > 0 && ` · ${chat.messages.length} messages`}
          </p>
        </div>

        {chat.pinned && (
          <Pin className="h-3.5 w-3.5 text-primary shrink-0" />
        )}

        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onTogglePin() }}
            className="p-1 rounded-md hover:bg-surface-tertiary text-text-tertiary hover:text-text-primary transition-colors"
            aria-label={chat.pinned ? "Unpin chat" : "Pin chat"}
          >
            {chat.pinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setShowDelete(true) }}
            className="p-1 rounded-md hover:bg-surface-tertiary text-text-tertiary hover:text-error transition-colors"
            aria-label="Delete chat"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </motion.button>

      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Delete conversation</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{chat.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => setShowDelete(false)}>Cancel</Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                onDelete()
                setShowDelete(false)
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function ChatHeader({
  chat,
  onTogglePin,
  onExport,
  onDelete,
  onTitleChange,
}: {
  chat: Chat
  onTogglePin: () => void
  onExport: () => void
  onDelete: () => void
  onTitleChange: (title: string) => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(chat.title)
  const [showDelete, setShowDelete] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setEditTitle(chat.title)
  }, [chat.title])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleSaveTitle = () => {
    const trimmed = editTitle.trim()
    if (trimmed && trimmed !== chat.title) {
      onTitleChange(trimmed)
    } else {
      setEditTitle(chat.title)
    }
    setIsEditing(false)
  }

  const currentModel = MODELS.find((m) => m.value === chat.model) || MODELS[0]

  return (
    <div className="flex items-center justify-between px-4 lg:px-6 h-16 border-b border-border/50 bg-surface/50 backdrop-blur-xl shrink-0">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="flex items-center gap-2 min-w-0">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveTitle()
                if (e.key === "Escape") { setEditTitle(chat.title); setIsEditing(false) }
              }}
              className="text-base font-semibold bg-transparent border-b-2 border-primary outline-none text-text-primary px-1 py-0.5 min-w-[200px]"
            />
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="group flex items-center gap-2"
            >
              <h2 className="text-base font-semibold text-text-primary truncate max-w-[200px] md:max-w-[400px]">
                {chat.title}
              </h2>
              <Edit3 className="h-3.5 w-3.5 text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </button>
          )}
        </div>

        <Badge variant="secondary" size="sm" className={cn("gap-1", getModelBadgeColor(currentModel.value))}>
          <Zap className="h-3 w-3" />
          {currentModel.label}
        </Badge>
      </div>

      <div className="flex items-center gap-1">
        <Select
          value={chat.model}
          onValueChange={(value) => useChatStore.getState().updateChatModel(chat.id, value)}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <SelectTrigger className="h-9 w-9 p-0 border-none bg-transparent hover:bg-surface-secondary rounded-lg">
                  <Zap className="h-4 w-4 text-text-secondary" />
                </SelectTrigger>
              </TooltipTrigger>
              <TooltipContent>Change model</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <SelectContent align="end">
            {MODELS.map((model) => (
              <SelectItem key={model.value} value={model.value}>
                <div className="flex items-center gap-2">
                  <span className={cn("text-xs", model.color)}>●</span>
                  <span>{model.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9 w-9" onClick={onTogglePin}>
                {chat.pinned ? <PinOff className="h-4 w-4 text-primary" /> : <Pin className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{chat.pinned ? "Unpin" : "Pin"} conversation</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9 w-9" onClick={onExport}>
                <FileDown className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Export conversation</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9 w-9 text-text-tertiary hover:text-error" onClick={() => setShowDelete(true)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete conversation</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Delete conversation</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{chat.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => setShowDelete(false)}>Cancel</Button>
            <Button variant="danger" size="sm" onClick={() => { onDelete(); setShowDelete(false) }}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function MessageInput({
  value,
  onChange,
  onSend,
  isLoading,
  activeModel,
}: {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  isLoading: boolean
  activeModel: string
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const maxLength = 4000
  const charCount = value.length

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }, [value])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  const currentModel = MODELS.find((m) => m.value === activeModel) || MODELS[0]

  return (
    <div className="border-t border-border/50 bg-surface/50 backdrop-blur-xl shrink-0">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="relative flex items-end gap-2 bg-surface-secondary border border-border/50 rounded-2xl px-4 py-3 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all duration-200">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            rows={1}
            maxLength={maxLength}
            disabled={isLoading}
            className="flex-1 resize-none bg-transparent text-sm text-text-primary placeholder:text-text-tertiary outline-none max-h-[200px] min-h-[24px] leading-relaxed disabled:opacity-50"
            aria-label="Message input"
          />

          <div className="flex items-center gap-2 shrink-0 pb-0.5">
            <span
              className={cn(
                "text-[10px] hidden sm:block",
                charCount > maxLength * 0.9 ? "text-error" : charCount > maxLength * 0.75 ? "text-warning" : "text-text-tertiary"
              )}
            >
              {charCount}/{maxLength}
            </span>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-surface border border-border/50">
                    <span className={cn("text-[10px] font-medium", currentModel.color)}>●</span>
                    <span className="text-[10px] text-text-tertiary hidden sm:block">{currentModel.label}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Using {currentModel.label}</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button
              variant="primary"
              size="sm"
              className="h-9 w-9 rounded-xl p-0"
              disabled={!value.trim() || isLoading}
              onClick={onSend}
              aria-label="Send message"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <p className="text-[10px] text-text-tertiary text-center mt-2">
          Press <kbd className="px-1 py-0.5 rounded bg-surface-secondary border border-border text-[9px] font-mono">Enter</kbd> to send · <kbd className="px-1 py-0.5 rounded bg-surface-secondary border border-border text-[9px] font-mono">Shift + Enter</kbd> for new line
        </p>
      </div>
    </div>
  )
}

export default function ChatPage() {
  const {
    chats,
    activeChat,
    isLoading,
    error,
    setActiveChat,
    addChat,
    deleteChat,
    togglePinChat,
    addMessage,
    setLoading,
    setError,
    updateChatTitle,
  } = useChatStore()

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [inputValue, setInputValue] = useState("")
  const [streamingContent, setStreamingContent] = useState("")
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const activeChatData = useMemo(() => chats.find((c) => c.id === activeChat), [chats, activeChat])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [activeChatData?.messages, streamingContent, scrollToBottom])

  const simulateStreaming = useCallback(async (chatId: string, responseText: string) => {
    const messageId = generateId()
    setStreamingMessageId(messageId)
    setStreamingContent("")

    let index = 0
    const chars = responseText.split("")

    const interval = setInterval(() => {
      if (index < chars.length) {
        setStreamingContent((prev) => prev + chars[index])
        index++
      } else {
        clearInterval(interval)
        const fullMessage: Message = {
          id: messageId,
          role: "assistant",
          content: responseText,
          timestamp: new Date(),
        }
        addMessage(chatId, fullMessage)
        setStreamingMessageId(null)
        setStreamingContent("")
        setLoading(false)
      }
    }, 8)
  }, [addMessage, setLoading])

  const handleSend = useCallback(() => {
    const trimmed = inputValue.trim()
    if (!trimmed || !activeChat || isLoading) return

    setError(null)

    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    }

    addMessage(activeChat, userMessage)
    setInputValue("")
    setLoading(true)

    const responseText = getSimulatedResponse(trimmed)
    setTimeout(() => {
      simulateStreaming(activeChat, responseText)
    }, 600)
  }, [inputValue, activeChat, isLoading, addMessage, setLoading, setError, simulateStreaming])

  const handleNewChat = useCallback(() => {
    const newChat: Chat = {
      id: generateId(),
      title: "New conversation",
      messages: [],
      pinned: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      model: "gpt-4",
    }
    addChat(newChat)
    setActiveChat(newChat.id)
    setInputValue("")
    setError(null)
    setSidebarOpen(false)
  }, [addChat, setActiveChat])

  const handleSelectPrompt = useCallback((prompt: string) => {
    setInputValue(prompt)
  }, [])

  const handleExport = useCallback(() => {
    if (!activeChatData || activeChatData.messages.length === 0) return

    const content = [
      `# ${activeChatData.title}`,
      `Model: ${activeChatData.model}`,
      `Exported: ${new Date().toLocaleString()}`,
      "",
      "---",
      "",
      ...activeChatData.messages.map(
        (msg) => `## ${msg.role === "user" ? "You" : "AI Assistant"}\n${msg.content}\n`
      ),
    ].join("\n")

    const blob = new Blob([content], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${activeChatData.title.replace(/\s+/g, "-").toLowerCase()}.md`
    a.click()
    URL.revokeObjectURL(url)

    toast({ message: "Conversation exported successfully", variant: "success" })
  }, [activeChatData])

  const hasMessages = activeChatData ? activeChatData.messages.length > 0 : false

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      <ChatSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(false)}
        onNewChat={handleNewChat}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {!sidebarOpen && (
          <div className="flex items-center gap-2 px-4 h-12 border-b border-border/50 bg-surface/30">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8"
              onClick={() => setSidebarOpen(true)}
            >
              <PanelLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs font-medium text-primary"
              onClick={handleNewChat}
            >
              <Plus className="h-3.5 w-3.5" />
              New Chat
            </Button>
          </div>
        )}

        {activeChatData && (
          <ChatHeader
            chat={activeChatData}
            onTogglePin={() => togglePinChat(activeChatData.id)}
            onExport={handleExport}
            onDelete={() => {
              const next = chats.find((c) => c.id !== activeChatData.id)
              deleteChat(activeChatData.id)
              if (next) setActiveChat(next.id)
            }}
            onTitleChange={(title) => updateChatTitle(activeChatData.id, title)}
          />
        )}

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="max-w-4xl mx-auto px-4 py-6" ref={scrollAreaRef}>
              {!activeChatData ? (
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
                      <MessageSquare className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-text-primary mb-2">No chat selected</h2>
                    <p className="text-sm text-text-secondary mb-4">Select a conversation or start a new one</p>
                    <Button variant="primary" onClick={handleNewChat} className="gap-2">
                      <Plus className="h-4 w-4" />
                      New Chat
                    </Button>
                  </motion.div>
                </div>
              ) : error ? (
                <ErrorState message={error} onRetry={handleSend} />
              ) : !hasMessages ? (
                <WelcomeScreen onSelectPrompt={handleSelectPrompt} onNewChat={handleNewChat} />
              ) : isLoading && streamingMessageId ? (
                <>
                  {activeChatData.messages.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} />
                  ))}
                  <MessageBubble
                    message={{
                      id: streamingMessageId,
                      role: "assistant",
                      content: streamingContent,
                      timestamp: new Date(),
                    }}
                    isStreaming
                    streamingContent={streamingContent}
                  />
                </>
              ) : isLoading ? (
                <>
                  {activeChatData.messages.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} />
                  ))}
                  <MessageSkeleton />
                </>
              ) : (
                <>
                  {activeChatData.messages.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} />
                  ))}
                  {streamingMessageId && (
                    <MessageBubble
                      message={{
                        id: streamingMessageId,
                        role: "assistant",
                        content: streamingContent,
                        timestamp: new Date(),
                      }}
                      isStreaming
                      streamingContent={streamingContent}
                    />
                  )}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>

        <MessageInput
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSend}
          isLoading={isLoading}
          activeModel={activeChatData?.model || "gpt-4"}
        />
      </div>
    </div>
  )
}
