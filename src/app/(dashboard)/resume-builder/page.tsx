"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sparkles,
  FileText,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  GripVertical,
  Wand2,
  Target,
  Download,
  Save,
  RotateCcw,
  Eye,
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderKanban,
  Award,
  FilePen,
  Loader2,
  Check,
  Lightbulb,
  X,
  AlertTriangle,
  PanelLeft,
  PanelRight,
  ArrowLeft,
  ArrowRight,
  Quote,
  ListChecks,
  type LucideIcon,
} from "lucide-react"
import { cn, generateId } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"
import { toast } from "sonner"

type ResumeTemplate = "modern" | "classic" | "minimal" | "creative" | "executive"

interface PersonalInfo {
  name: string
  email: string
  phone: string
  location: string
  website: string
  linkedin: string
}

interface Experience {
  id: string
  company: string
  role: string
  startDate: string
  endDate: string
  description: string
}

interface Education {
  id: string
  school: string
  degree: string
  field: string
  startDate: string
  endDate: string
}

interface Project {
  id: string
  name: string
  description: string
  url: string
}

interface Certification {
  id: string
  name: string
  issuer: string
  date: string
}

interface ResumeData {
  template: ResumeTemplate
  personalInfo: PersonalInfo
  professionalSummary: string
  experiences: Experience[]
  education: Education[]
  skills: string[]
  projects: Project[]
  certifications: Certification[]
}

interface TemplateConfig {
  id: ResumeTemplate
  name: string
  description: string
  gradient: string
  accent: string
}

interface CollapsibleSectionProps {
  title: string
  icon: LucideIcon
  defaultOpen?: boolean
  children: React.ReactNode
  onRemove?: () => void
  index?: number
}

interface SuggestionsPanelProps {
  type: "summary" | "experience" | "skills"
  isOpen: boolean
  onClose: () => void
  onApply: (content: string) => void
}

interface AtsScorePanelProps {
  isOpen: boolean
  onClose: () => void
  resumeData: ResumeData
}

const TEMPLATES: TemplateConfig[] = [
  { id: "modern", name: "Modern", description: "Clean & contemporary", gradient: "from-violet-500 via-purple-500 to-pink-500", accent: "violet" },
  { id: "classic", name: "Classic", description: "Timeless & formal", gradient: "from-slate-600 via-slate-500 to-slate-400", accent: "slate" },
  { id: "minimal", name: "Minimal", description: "Simple & elegant", gradient: "from-gray-400 via-gray-300 to-gray-200", accent: "gray" },
  { id: "creative", name: "Creative", description: "Bold & unique", gradient: "from-rose-500 via-pink-500 to-orange-400", accent: "rose" },
  { id: "executive", name: "Executive", description: "Professional & refined", gradient: "from-blue-800 via-blue-600 to-indigo-500", accent: "blue" },
]

const EMPTY_RESUME: ResumeData = {
  template: "modern",
  personalInfo: { name: "", email: "", phone: "", location: "", website: "", linkedin: "" },
  professionalSummary: "",
  experiences: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
}

const MOCK_AI_SUGGESTIONS = {
  summary: [
    "Results-driven professional with 5+ years of experience in driving business growth and operational excellence. Proven track record of leading cross-functional teams to deliver impactful solutions that increase revenue by 30% year-over-year.",
    "Innovative problem-solver with expertise in full-stack development and cloud architecture. Passionate about building scalable applications that serve millions of users while maintaining 99.9% uptime.",
    "Strategic marketing leader with a data-driven approach to brand development and customer acquisition. Successfully launched 15+ products generating $50M+ in cumulative revenue across global markets.",
  ],
  experience: [
    "Spearheaded the development of a microservices architecture that reduced system latency by 60% and improved overall platform reliability to 99.99% uptime.",
    "Led a team of 12 engineers to deliver a major product overhaul, resulting in a 40% increase in user engagement and 25% reduction in customer churn rate.",
    "Designed and implemented an automated CI/CD pipeline that decreased deployment time from 4 hours to 12 minutes, enabling 10x more frequent releases.",
    "Collaborated with product and design teams to launch 8 new features that contributed to $2.5M in annual recurring revenue growth.",
    "Mentored 5 junior developers through structured code reviews and pair programming sessions, accelerating their ramp-up time by 50%.",
  ],
  skills: [
    "React, Next.js, TypeScript, JavaScript, Node.js",
    "Python, Django, FastAPI, PostgreSQL, MongoDB",
    "AWS, Docker, Kubernetes, Terraform, CI/CD",
    "Machine Learning, TensorFlow, PyTorch, NLP",
    "Project Management, Agile, Scrum, Team Leadership",
  ],
}

function generateAtsScore(data: ResumeData): { score: number; tips: string[] } {
  let score = 0
  const tips: string[] = []

  if (data.personalInfo.name) { score += 5 } else { tips.push("Add your full name") }
  if (data.personalInfo.email) { score += 5 } else { tips.push("Add an email address") }
  if (data.personalInfo.phone) { score += 5 } else { tips.push("Add a phone number") }

  if (data.professionalSummary.length > 50) {
    score += 10
  } else if (data.professionalSummary.length > 0) {
    score += 5
    tips.push("Expand your professional summary to at least 50 characters")
  } else {
    tips.push("Add a professional summary to make your resume stand out")
  }

  if (data.experiences.length > 0) {
    score += Math.min(data.experiences.length * 5, 15)
    const hasDescriptions = data.experiences.some((e) => e.description.length > 30)
    if (hasDescriptions) score += 5
    else tips.push("Add detailed descriptions to your experience entries")
  } else {
    tips.push("Add at least one work experience entry")
  }

  if (data.education.length > 0) {
    score += Math.min(data.education.length * 5, 10)
  } else {
    tips.push("Add your education background")
  }

  if (data.skills.length >= 5) {
    score += 10
  } else if (data.skills.length > 0) {
    score += data.skills.length
    tips.push("Add more skills (aim for 5+)")
  } else {
    tips.push("Add relevant skills to improve ATS matching")
  }

  if (data.projects.length > 0) score += Math.min(data.projects.length * 3, 9)
  if (data.certifications.length > 0) score += Math.min(data.certifications.length * 3, 6)

  score = Math.min(score, 100)

  if (score >= 80) tips.push("Great job! Your resume is well-optimized for ATS")
  else if (score >= 60) tips.push("Your resume is decent, but has room for improvement")
  else tips.push("Significant improvements needed for ATS compatibility")

  return { score, tips }
}

function SuggestionsPanel({ type, isOpen, onClose, onApply }: SuggestionsPanelProps) {
  const suggestions = MOCK_AI_SUGGESTIONS[type]
  const [applied, setApplied] = useState<Set<number>>(new Set())

  const titles = { summary: "Professional Summary", experience: "Experience Bullet Points", skills: "Skills Recommendations" }
  const icons = { summary: Quote, experience: ListChecks, skills: Lightbulb }

  const Icon = icons[type]

  const handleApply = (index: number) => {
    onApply(suggestions[index])
    setApplied((prev) => new Set(prev).add(index))
    toast.success("Suggestion applied!")
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <Card variant="glass" className="border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="inline-flex p-1.5 rounded-lg bg-primary/10">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-text-primary">
                    AI Suggestions for {titles[type]}
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close suggestions">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Separator className="mb-3" />
              <div className="space-y-2">
                {suggestions.map((suggestion, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={cn(
                      "group relative rounded-lg border p-3 transition-all duration-200",
                      applied.has(i) ? "border-success/30 bg-success/5" : "border-border hover:border-primary/30 hover:bg-surface-secondary"
                    )}
                  >
                    <p className="text-sm text-text-secondary pr-16 leading-relaxed">{suggestion}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleApply(i)}
                      disabled={applied.has(i)}
                      className={cn(
                        "absolute top-2 right-2",
                        applied.has(i) && "text-success"
                      )}
                    >
                      {applied.has(i) ? <Check className="h-4 w-4" /> : "Apply"}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function AtsScorePanel({ isOpen, onClose, resumeData }: AtsScorePanelProps) {
  const { score, tips } = generateAtsScore(resumeData)
  const isHigh = score >= 80
  const isMid = score >= 50

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <Card variant="glass" className="border-primary/20">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="inline-flex p-1.5 rounded-lg bg-primary/10">
                    <Target className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-text-primary">ATS Compatibility Score</span>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close ATS score">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className={cn(
                  "relative flex items-center justify-center w-16 h-16 rounded-full border-4",
                  isHigh ? "border-success" : isMid ? "border-warning" : "border-error"
                )}>
                  <span className={cn(
                    "text-lg font-bold",
                    isHigh ? "text-success" : isMid ? "text-warning" : "text-error"
                  )}>
                    {score}
                  </span>
                </div>
                <div className="flex-1">
                  <Progress value={score} variant={isHigh ? "success" : isMid ? "warning" : "error"} />
                  <p className="text-xs text-text-tertiary mt-1">
                    {isHigh ? "Excellent ATS compatibility" : isMid ? "Room for improvement" : "Needs work"}
                  </p>
                </div>
              </div>
              <Separator className="mb-3" />
              <div className="space-y-2">
                <p className="text-xs font-medium text-text-secondary flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Improvement Tips
                </p>
                {tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                    <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    {tip}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function CollapsibleSection({ title, icon: Icon, defaultOpen = true, children, onRemove, index }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card variant="glass" className="overflow-hidden">
        <div className="flex items-center justify-between p-4 cursor-pointer select-none" onClick={() => setIsOpen(!isOpen)}>
          <div className="flex items-center gap-3">
            {index !== undefined && (
              <div className="cursor-grab active:cursor-grabbing text-text-tertiary hover:text-text-secondary" onClick={(e) => e.stopPropagation()}>
                <GripVertical className="h-4 w-4" />
              </div>
            )}
            <div className="inline-flex p-1.5 rounded-lg bg-primary/10">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-medium text-text-primary">{title}</span>
          </div>
          <div className="flex items-center gap-1">
            {onRemove && (
              <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onRemove() }} className="text-error hover:text-error">
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" size="sm">
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 space-y-3">{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  )
}

function ResumePreview({ data, isCompact = false }: { data: ResumeData; isCompact?: boolean }) {
  const hasContent = data.personalInfo.name || data.experiences.length > 0 || data.education.length > 0 || data.skills.length > 0 || data.projects.length > 0 || data.certifications.length > 0 || data.professionalSummary

  if (!hasContent) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="inline-flex p-4 rounded-2xl bg-surface-secondary mb-4">
          <FileText className="h-10 w-10 text-text-tertiary" />
        </div>
        <p className="text-text-secondary font-medium mb-1">No content yet</p>
        <p className="text-sm text-text-tertiary max-w-xs">Start filling in the form on the left to see your resume preview come to life.</p>
      </div>
    )
  }

  return (
    <div className={cn("bg-white text-slate-900 shadow-lg rounded-lg overflow-hidden", isCompact ? "text-xs" : "text-sm")}>
      <div className="p-6 space-y-4">
        {data.personalInfo.name && (
          <div className="text-center border-b border-slate-200 pb-4">
            <h2 className={cn("font-bold text-slate-900", isCompact ? "text-base" : "text-xl")}>{data.personalInfo.name}</h2>
            <div className={cn("text-slate-500 mt-1 space-x-2", isCompact ? "text-[10px]" : "text-xs")}>
              {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
              {data.personalInfo.phone && <span>| {data.personalInfo.phone}</span>}
              {data.personalInfo.location && <span>| {data.personalInfo.location}</span>}
            </div>
            {(data.personalInfo.website || data.personalInfo.linkedin) && (
              <div className={cn("text-slate-500 mt-0.5 space-x-2", isCompact ? "text-[10px]" : "text-xs")}>
                {data.personalInfo.website && <span>{data.personalInfo.website}</span>}
                {data.personalInfo.linkedin && <span>| {data.personalInfo.linkedin}</span>}
              </div>
            )}
          </div>
        )}

        {data.professionalSummary && (
          <div>
            <h3 className={cn("font-semibold text-slate-800 uppercase tracking-wider mb-1", isCompact ? "text-[10px]" : "text-xs")}>Professional Summary</h3>
            <p className={cn("text-slate-700 leading-relaxed", isCompact ? "text-[10px]" : "text-xs")}>{data.professionalSummary}</p>
          </div>
        )}

        {data.experiences.length > 0 && (
          <div>
            <h3 className={cn("font-semibold text-slate-800 uppercase tracking-wider mb-2", isCompact ? "text-[10px]" : "text-xs")}>Experience</h3>
            {data.experiences.map((exp) => (
              <div key={exp.id} className="mb-3 last:mb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className={cn("font-medium text-slate-800", isCompact ? "text-[11px]" : "text-sm")}>{exp.role}</p>
                    {exp.company && <p className={cn("text-slate-600", isCompact ? "text-[10px]" : "text-xs")}>{exp.company}</p>}
                  </div>
                  {(exp.startDate || exp.endDate) && (
                    <p className={cn("text-slate-500 shrink-0", isCompact ? "text-[9px]" : "text-[11px]")}>
                      {exp.startDate} - {exp.endDate || "Present"}
                    </p>
                  )}
                </div>
                {exp.description && (
                  <p className={cn("text-slate-600 mt-1 leading-relaxed", isCompact ? "text-[10px]" : "text-xs")}>{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {data.education.length > 0 && (
          <div>
            <h3 className={cn("font-semibold text-slate-800 uppercase tracking-wider mb-2", isCompact ? "text-[10px]" : "text-xs")}>Education</h3>
            {data.education.map((edu) => (
              <div key={edu.id} className="mb-2 last:mb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className={cn("font-medium text-slate-800", isCompact ? "text-[11px]" : "text-sm")}>{edu.degree} in {edu.field}</p>
                    {edu.school && <p className={cn("text-slate-600", isCompact ? "text-[10px]" : "text-xs")}>{edu.school}</p>}
                  </div>
                  {(edu.startDate || edu.endDate) && (
                    <p className={cn("text-slate-500 shrink-0", isCompact ? "text-[9px]" : "text-[11px]")}>
                      {edu.startDate} - {edu.endDate || "Present"}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {data.skills.length > 0 && (
          <div>
            <h3 className={cn("font-semibold text-slate-800 uppercase tracking-wider mb-2", isCompact ? "text-[10px]" : "text-xs")}>Skills</h3>
            <div className="flex flex-wrap gap-1.5">
              {data.skills.map((skill, i) => (
                <span key={i} className={cn("bg-slate-100 text-slate-700 rounded px-2 py-0.5 font-medium", isCompact ? "text-[9px]" : "text-[11px]")}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {data.projects.length > 0 && (
          <div>
            <h3 className={cn("font-semibold text-slate-800 uppercase tracking-wider mb-2", isCompact ? "text-[10px]" : "text-xs")}>Projects</h3>
            {data.projects.map((proj) => (
              <div key={proj.id} className="mb-2 last:mb-0">
                <p className={cn("font-medium text-slate-800", isCompact ? "text-[11px]" : "text-sm")}>{proj.name}</p>
                {proj.description && <p className={cn("text-slate-600 mt-0.5 leading-relaxed", isCompact ? "text-[10px]" : "text-xs")}>{proj.description}</p>}
                {proj.url && <p className={cn("text-blue-600 mt-0.5", isCompact ? "text-[9px]" : "text-[11px]")}>{proj.url}</p>}
              </div>
            ))}
          </div>
        )}

        {data.certifications.length > 0 && (
          <div>
            <h3 className={cn("font-semibold text-slate-800 uppercase tracking-wider mb-2", isCompact ? "text-[10px]" : "text-xs")}>Certifications</h3>
            {data.certifications.map((cert) => (
              <div key={cert.id} className="mb-1 last:mb-0">
                <p className={cn("font-medium text-slate-800", isCompact ? "text-[11px]" : "text-sm")}>{cert.name}</p>
                <p className={cn("text-slate-600", isCompact ? "text-[9px]" : "text-[11px]")}>{cert.issuer}{cert.date ? ` • ${cert.date}` : ""}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyState({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] text-center p-8"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="inline-flex p-5 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 mb-6"
      >
        <FileText className="h-14 w-14 text-primary" />
      </motion.div>
      <h2 className="text-2xl font-bold text-text-primary mb-2">Build Your Perfect Resume</h2>
      <p className="text-text-secondary max-w-md mb-8 leading-relaxed">
        Let AI help you craft a professional resume that stands out. Choose a template, fill in your details, and get AI-powered suggestions to optimize every section.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 w-full max-w-lg">
        {[
          { icon: FilePen, label: "Choose Template", desc: "Pick from 5 designs" },
          { icon: Wand2, label: "AI Suggestions", desc: "Smart content ideas" },
          { icon: Target, label: "ATS Optimized", desc: "Pass the screening" },
        ].map(({ icon: Icon, label, desc }) => (
          <div key={label} className="flex flex-col items-center p-4 rounded-xl bg-surface-secondary border border-border">
            <div className="inline-flex p-2 rounded-lg bg-primary/10 mb-2">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <p className="text-sm font-medium text-text-primary">{label}</p>
            <p className="text-xs text-text-tertiary mt-0.5">{desc}</p>
          </div>
        ))}
      </div>
      <Button size="lg" icon={<Sparkles className="h-5 w-5" />} onClick={onStart}>
        Get Started
      </Button>
    </motion.div>
  )
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 className="h-10 w-10 text-primary" />
      </motion.div>
      <p className="text-text-secondary mt-4">Loading your resume builder...</p>
    </div>
  )
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
}

export default function ResumeBuilderPage() {
  const [resumeData, setResumeData] = useState<ResumeData>(EMPTY_RESUME)
  const [isLoading, setIsLoading] = useState(true)
  const [hasStarted, setHasStarted] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState<"summary" | "experience" | "skills" | null>(null)
  const [showAts, setShowAts] = useState(false)
  const [isMobilePreview, setIsMobilePreview] = useState(false)
  const [newSkill, setNewSkill] = useState("")
  const [saving, setSaving] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [activeTab, setActiveTab] = useState<"form" | "preview">("form")
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const updatePersonalInfo = useCallback((field: keyof PersonalInfo, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }))
  }, [])

  const updateSummary = useCallback((value: string) => {
    setResumeData((prev) => ({ ...prev, professionalSummary: value }))
  }, [])

  const addExperience = useCallback(() => {
    setResumeData((prev) => ({
      ...prev,
      experiences: [...prev.experiences, { id: generateId(), company: "", role: "", startDate: "", endDate: "", description: "" }],
    }))
  }, [])

  const updateExperience = useCallback((id: string, field: keyof Experience, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    }))
  }, [])

  const removeExperience = useCallback((id: string) => {
    setResumeData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((e) => e.id !== id),
    }))
  }, [])

  const addEducation = useCallback(() => {
    setResumeData((prev) => ({
      ...prev,
      education: [...prev.education, { id: generateId(), school: "", degree: "", field: "", startDate: "", endDate: "" }],
    }))
  }, [])

  const updateEducation = useCallback((id: string, field: keyof Education, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    }))
  }, [])

  const removeEducation = useCallback((id: string) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((e) => e.id !== id),
    }))
  }, [])

  const addSkill = useCallback(() => {
    const skill = newSkill.trim()
    if (!skill || resumeData.skills.includes(skill)) return
    setResumeData((prev) => ({ ...prev, skills: [...prev.skills, skill] }))
    setNewSkill("")
  }, [newSkill, resumeData.skills])

  const removeSkill = useCallback((skill: string) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }))
  }, [])

  const addProject = useCallback(() => {
    setResumeData((prev) => ({
      ...prev,
      projects: [...prev.projects, { id: generateId(), name: "", description: "", url: "" }],
    }))
  }, [])

  const updateProject = useCallback((id: string, field: keyof Project, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    }))
  }, [])

  const removeProject = useCallback((id: string) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }))
  }, [])

  const addCertification = useCallback(() => {
    setResumeData((prev) => ({
      ...prev,
      certifications: [...prev.certifications, { id: generateId(), name: "", issuer: "", date: "" }],
    }))
  }, [])

  const updateCertification = useCallback((id: string, field: keyof Certification, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      certifications: prev.certifications.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
    }))
  }, [])

  const removeCertification = useCallback((id: string) => {
    setResumeData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c.id !== id),
    }))
  }, [])

  const selectTemplate = useCallback((template: ResumeTemplate) => {
    setResumeData((prev) => ({ ...prev, template }))
  }, [])

  const applySuggestion = useCallback((type: "summary" | "experience" | "skills", content: string) => {
    if (type === "summary") {
      updateSummary(content)
    } else if (type === "experience") {
      if (resumeData.experiences.length === 0) addExperience()
      const lastExp = resumeData.experiences[resumeData.experiences.length - 1]
      if (lastExp) {
        updateExperience(lastExp.id, "description", content)
      }
    } else if (type === "skills") {
      const skills = content.split(",").map((s) => s.trim()).filter(Boolean)
      setResumeData((prev) => ({
        ...prev,
        skills: [...new Set([...prev.skills, ...skills])],
      }))
    }
    toast.success("AI suggestion applied!")
  }, [resumeData, updateSummary, addExperience, updateExperience])

  const handleReset = () => {
    setResumeData(EMPTY_RESUME)
    setShowSuggestions(null)
    setShowAts(false)
    setHasStarted(false)
    toast.success("Resume has been reset")
  }

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 1000))
    setSaving(false)
    toast.success("Resume saved successfully!")
  }

  const handleExport = async () => {
    setExporting(true)
    await new Promise((r) => setTimeout(r, 1500))
    setExporting(false)
    toast.success("Resume exported as PDF!")
  }

  const reorderExperiences = useCallback((experiences: Experience[]) => {
    setResumeData((prev) => ({ ...prev, experiences }))
  }, [])

  const reorderEducation = useCallback((education: Education[]) => {
    setResumeData((prev) => ({ ...prev, education }))
  }, [])

  const scrollTemplates = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 280
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  if (isLoading) return <LoadingState />

  if (!hasStarted) {
    return <EmptyState onStart={() => setHasStarted(true)} />
  }

  const formPanel = (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4 pb-8"
    >
      <motion.div variants={itemVariants}>
        <CollapsibleSection title="Personal Information" icon={User}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="Full Name" placeholder="John Doe" value={resumeData.personalInfo.name} onChange={(e) => updatePersonalInfo("name", e.target.value)} />
            <Input label="Email" placeholder="john@example.com" value={resumeData.personalInfo.email} onChange={(e) => updatePersonalInfo("email", e.target.value)} />
            <Input label="Phone" placeholder="+1 (555) 123-4567" value={resumeData.personalInfo.phone} onChange={(e) => updatePersonalInfo("phone", e.target.value)} />
            <Input label="Location" placeholder="San Francisco, CA" value={resumeData.personalInfo.location} onChange={(e) => updatePersonalInfo("location", e.target.value)} />
            <Input label="Website" placeholder="https://johndoe.com" value={resumeData.personalInfo.website} onChange={(e) => updatePersonalInfo("website", e.target.value)} />
            <Input label="LinkedIn" placeholder="linkedin.com/in/johndoe" value={resumeData.personalInfo.linkedin} onChange={(e) => updatePersonalInfo("linkedin", e.target.value)} />
          </div>
        </CollapsibleSection>
      </motion.div>

      <motion.div variants={itemVariants}>
        <CollapsibleSection title="Professional Summary" icon={Quote}>
          <div className="space-y-2">
            <Textarea
              placeholder="Write a brief summary of your professional background, key achievements, and career goals..."
              value={resumeData.professionalSummary}
              onChange={(e) => updateSummary(e.target.value)}
              rows={4}
              showCharCount
              maxLength={500}
            />
            <Button
              variant="outline"
              size="sm"
              icon={<Wand2 className="h-4 w-4" />}
              onClick={() => setShowSuggestions(showSuggestions === "summary" ? null : "summary")}
              className="w-full"
            >
              Generate with AI
            </Button>
            <SuggestionsPanel
              type="summary"
              isOpen={showSuggestions === "summary"}
              onClose={() => setShowSuggestions(null)}
              onApply={(content) => applySuggestion("summary", content)}
            />
          </div>
        </CollapsibleSection>
      </motion.div>

      <motion.div variants={itemVariants}>
        <CollapsibleSection title="Experience" icon={Briefcase} defaultOpen={false}>
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {resumeData.experiences.map((exp) => (
                <motion.div
                  key={exp.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="relative overflow-hidden border-border/50">
                    <CardContent className="p-3 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <Input placeholder="Company" value={exp.company} onChange={(e) => updateExperience(exp.id, "company", e.target.value)} />
                        <Input placeholder="Role" value={exp.role} onChange={(e) => updateExperience(exp.id, "role", e.target.value)} />
                        <Input placeholder="Start Date" value={exp.startDate} onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)} />
                        <Input placeholder="End Date" value={exp.endDate} onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)} />
                      </div>
                      <Textarea
                        placeholder="Describe your responsibilities and achievements..."
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                        rows={2}
                        autoResize
                      />
                      <div className="flex justify-end">
                        <Button variant="ghost" size="sm" onClick={() => removeExperience(exp.id)} className="text-error hover:text-error">
                          <Trash2 className="h-4 w-4 mr-1" /> Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
            <Button variant="outline" size="sm" icon={<Plus className="h-4 w-4" />} onClick={addExperience} className="w-full">
              Add Experience
            </Button>
          </div>
        </CollapsibleSection>
      </motion.div>

      <motion.div variants={itemVariants}>
        <CollapsibleSection title="Education" icon={GraduationCap} defaultOpen={false}>
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {resumeData.education.map((edu) => (
                <motion.div
                  key={edu.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="relative overflow-hidden border-border/50">
                    <CardContent className="p-3 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <Input placeholder="School" value={edu.school} onChange={(e) => updateEducation(edu.id, "school", e.target.value)} />
                        <Input placeholder="Degree" value={edu.degree} onChange={(e) => updateEducation(edu.id, "degree", e.target.value)} />
                        <Input placeholder="Field of Study" value={edu.field} onChange={(e) => updateEducation(edu.id, "field", e.target.value)} />
                        <div className="grid grid-cols-2 gap-2">
                          <Input placeholder="Start" value={edu.startDate} onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)} />
                          <Input placeholder="End" value={edu.endDate} onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)} />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button variant="ghost" size="sm" onClick={() => removeEducation(edu.id)} className="text-error hover:text-error">
                          <Trash2 className="h-4 w-4 mr-1" /> Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
            <Button variant="outline" size="sm" icon={<Plus className="h-4 w-4" />} onClick={addEducation} className="w-full">
              Add Education
            </Button>
          </div>
        </CollapsibleSection>
      </motion.div>

      <motion.div variants={itemVariants}>
        <CollapsibleSection title="Skills" icon={Wrench} defaultOpen={false}>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill) => (
                <Badge key={skill} variant="secondary" size="md" className="gap-1.5 pr-1">
                  {skill}
                  <button onClick={() => removeSkill(skill)} className="ml-1 hover:text-error transition-colors" aria-label={`Remove ${skill}`}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Type a skill and press Add..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill() } }}
              />
              <Button variant="secondary" size="md" onClick={addSkill} disabled={!newSkill.trim()}>Add</Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={<Wand2 className="h-4 w-4" />}
              onClick={() => setShowSuggestions(showSuggestions === "skills" ? null : "skills")}
              className="w-full"
            >
              Suggest Skills with AI
            </Button>
            <SuggestionsPanel
              type="skills"
              isOpen={showSuggestions === "skills"}
              onClose={() => setShowSuggestions(null)}
              onApply={(content) => applySuggestion("skills", content)}
            />
          </div>
        </CollapsibleSection>
      </motion.div>

      <motion.div variants={itemVariants}>
        <CollapsibleSection title="Projects" icon={FolderKanban} defaultOpen={false}>
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {resumeData.projects.map((proj) => (
                <motion.div
                  key={proj.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="relative overflow-hidden border-border/50">
                    <CardContent className="p-3 space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <Input placeholder="Project Name" value={proj.name} onChange={(e) => updateProject(proj.id, "name", e.target.value)} />
                        <Input placeholder="URL (optional)" value={proj.url} onChange={(e) => updateProject(proj.id, "url", e.target.value)} />
                      </div>
                      <Textarea
                        placeholder="Describe the project and your contributions..."
                        value={proj.description}
                        onChange={(e) => updateProject(proj.id, "description", e.target.value)}
                        rows={2}
                        autoResize
                      />
                      <div className="flex justify-end">
                        <Button variant="ghost" size="sm" onClick={() => removeProject(proj.id)} className="text-error hover:text-error">
                          <Trash2 className="h-4 w-4 mr-1" /> Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
            <Button variant="outline" size="sm" icon={<Plus className="h-4 w-4" />} onClick={addProject} className="w-full">
              Add Project
            </Button>
          </div>
        </CollapsibleSection>
      </motion.div>

      <motion.div variants={itemVariants}>
        <CollapsibleSection title="Certifications" icon={Award} defaultOpen={false}>
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {resumeData.certifications.map((cert) => (
                <motion.div
                  key={cert.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="relative overflow-hidden border-border/50">
                    <CardContent className="p-3 space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <Input placeholder="Certification Name" value={cert.name} onChange={(e) => updateCertification(cert.id, "name", e.target.value)} />
                        <div className="grid grid-cols-2 gap-2">
                          <Input placeholder="Issuer" value={cert.issuer} onChange={(e) => updateCertification(cert.id, "issuer", e.target.value)} />
                          <Input placeholder="Date" value={cert.date} onChange={(e) => updateCertification(cert.id, "date", e.target.value)} />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button variant="ghost" size="sm" onClick={() => removeCertification(cert.id)} className="text-error hover:text-error">
                          <Trash2 className="h-4 w-4 mr-1" /> Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
            <Button variant="outline" size="sm" icon={<Plus className="h-4 w-4" />} onClick={addCertification} className="w-full">
              Add Certification
            </Button>
          </div>
        </CollapsibleSection>
      </motion.div>
    </motion.div>
  )

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="shrink-0 border-b border-border bg-surface/80 backdrop-blur-xl"
      >
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                AI Resume Builder
              </h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xs text-text-tertiary"
              >
                Craft the perfect resume with AI-powered assistance
              </motion.p>
            </div>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={() => setShowAts(!showAts)}>
                    <Target className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>ATS Score</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={handleSave} loading={saving}>
                    <Save className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Save</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={handleExport} loading={exporting}>
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Export PDF</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={handleReset} className="text-error hover:text-error">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Reset</TooltipContent>
              </Tooltip>
              <div className="hidden md:flex items-center ml-2">
                <Button
                  variant={isMobilePreview ? "ghost" : "secondary"}
                  size="sm"
                  onClick={() => setIsMobilePreview(false)}
                >
                  <PanelLeft className="h-4 w-4 mr-1" /> Form
                </Button>
                <Button
                  variant={isMobilePreview ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setIsMobilePreview(true)}
                >
                  <PanelRight className="h-4 w-4 mr-1" /> Preview
                </Button>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="flex items-center gap-2 mb-1">
              <Button variant="ghost" size="sm" onClick={() => scrollTemplates("left")} className="shrink-0">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div ref={scrollRef} className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth">
                {TEMPLATES.map((template) => (
                  <motion.button
                    key={template.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => selectTemplate(template.id)}
                    className={cn(
                      "flex items-center gap-2 shrink-0 p-2 rounded-lg border transition-all duration-200",
                      resumeData.template === template.id
                        ? "border-primary bg-primary/5 shadow-sm shadow-primary/10"
                        : "border-border hover:border-primary/30 hover:bg-surface-secondary"
                    )}
                  >
                    <div className={cn("w-8 h-10 rounded-md bg-gradient-to-br", template.gradient)} />
                    <div className="text-left">
                      <p className="text-xs font-medium text-text-primary">{template.name}</p>
                      <p className="text-[10px] text-text-tertiary">{template.description}</p>
                    </div>
                    {resumeData.template === template.id && (
                      <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    )}
                  </motion.button>
                ))}
              </div>
              <Button variant="ghost" size="sm" onClick={() => scrollTemplates("right")} className="shrink-0">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full flex">
          <div className={cn(
            "w-full md:w-1/2 lg:w-[45%] xl:w-[40%] overflow-y-auto scrollbar-custom border-r border-border",
            isMobilePreview && "hidden md:block"
          )}>
            <div className="p-4">
              <AtsScorePanel isOpen={showAts} onClose={() => setShowAts(false)} resumeData={resumeData} />
              {formPanel}
            </div>
          </div>

          <div className={cn(
            "w-full md:w-1/2 lg:w-[55%] xl:w-[60%] overflow-y-auto scrollbar-custom bg-surface-secondary/50",
            !isMobilePreview && "hidden md:block"
          )}>
            <div className="p-4 lg:p-6">
              <div className="max-w-[210mm] mx-auto">
                <ResumePreview data={resumeData} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-surface/90 backdrop-blur-lg z-50">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "form" | "preview")} className="w-full">
          <TabsList variant="pills" className="w-full justify-center rounded-none border-0 bg-transparent p-1">
            <TabsTrigger value="form" className="flex-1 justify-center text-xs gap-1">
              <FilePen className="h-4 w-4" /> Edit
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex-1 justify-center text-xs gap-1">
              <Eye className="h-4 w-4" /> Preview
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  )
}
