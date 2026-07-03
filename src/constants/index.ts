import {
  MessageSquare,
  Pen,
  Code,
  Image,
  FileText,
  Languages,
  FileSearch,
  type LucideIcon,
} from "lucide-react"

export const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "AI Chat", href: "/chat", icon: "MessageSquare" },
  { label: "AI Writer", href: "/writer", icon: "Pen" },
  { label: "Code Generator", href: "/code-generator", icon: "Code" },
  { label: "Image Generator", href: "/image-generator", icon: "Image" },
  { label: "Resume Builder", href: "/resume-builder", icon: "FileText" },
  { label: "Translator", href: "/translator", icon: "Languages" },
  { label: "PDF Analyzer", href: "/pdf-analyzer", icon: "FileSearch" },
] as const

export const AI_TOOLS: { title: string; description: string; icon: LucideIcon; href: string; color: string }[] = [
  {
    title: "AI Chat",
    description: "Smart conversations with advanced AI",
    icon: MessageSquare,
    href: "/chat",
    color: "from-violet-500 to-purple-500",
  },
  {
    title: "AI Writer",
    description: "Generate content in seconds",
    icon: Pen,
    href: "/writer",
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Code Generator",
    description: "Write code with AI assistance",
    icon: Code,
    href: "/code-generator",
    color: "from-emerald-500 to-green-500",
  },
  {
    title: "Image Generator",
    description: "Create stunning visuals",
    icon: Image,
    href: "/image-generator",
    color: "from-pink-500 to-rose-500",
  },
  {
    title: "Resume Builder",
    description: "Build professional resumes",
    icon: FileText,
    href: "/resume-builder",
    color: "from-orange-500 to-amber-500",
  },
  {
    title: "Translator",
    description: "Translate between languages",
    icon: Languages,
    href: "/translator",
    color: "from-indigo-500 to-blue-500",
  },
  {
    title: "PDF Analyzer",
    description: "Analyze documents intelligently",
    icon: FileSearch,
    href: "/pdf-analyzer",
    color: "from-red-500 to-pink-500",
  },
]

export const PRICING_PLANS = [
  {
    id: "free",
    name: "Free",
    description: "Perfect for getting started",
    price: 0,
    interval: "month" as const,
    features: [
      "100 chat queries/month",
      "1,000 words/month",
      "5 images/month",
      "Basic AI models",
      "1 workspace",
    ],
    cta: "Get Started",
  },
  {
    id: "pro",
    name: "Pro",
    description: "Best for professionals",
    price: 29,
    interval: "month" as const,
    features: [
      "10,000 chat queries/month",
      "100,000 words/month",
      "500 images/month",
      "Advanced AI models",
      "Unlimited workspaces",
      "Priority support",
      "API access",
    ],
    highlighted: true,
    cta: "Start Free Trial",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large teams",
    price: 99,
    interval: "month" as const,
    features: [
      "Unlimited chat queries",
      "Unlimited words",
      "Unlimited images",
      "All AI models",
      "Unlimited workspaces",
      "Dedicated support",
      "API access",
      "Custom integrations",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
  },
]

export const LANGUAGES = [
  { code: "en", name: "English", native: "English" },
  { code: "es", name: "Spanish", native: "Español" },
  { code: "fr", name: "French", native: "Français" },
  { code: "de", name: "German", native: "Deutsch" },
  { code: "zh", name: "Chinese", native: "中文" },
  { code: "ja", name: "Japanese", native: "日本語" },
  { code: "ko", name: "Korean", native: "한국어" },
  { code: "pt", name: "Portuguese", native: "Português" },
  { code: "ru", name: "Russian", native: "Русский" },
  { code: "ar", name: "Arabic", native: "العربية" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
  { code: "it", name: "Italian", native: "Italiano" },
]

export const IMAGE_STYLES = [
  { value: "realistic", label: "Realistic" },
  { value: "artistic", label: "Artistic" },
  { value: "3d-render", label: "3D Render" },
  { value: "pixel-art", label: "Pixel Art" },
  { value: "anime", label: "Anime" },
  { value: "sketch", label: "Sketch" },
]

export const ASPECT_RATIOS = [
  { value: "1:1", label: "Square (1:1)" },
  { value: "16:9", label: "Landscape (16:9)" },
  { value: "9:16", label: "Portrait (9:16)" },
  { value: "4:3", label: "Standard (4:3)" },
  { value: "3:4", label: "Portrait (3:4)" },
]

export const TONES = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "creative", label: "Creative" },
  { value: "academic", label: "Academic" },
  { value: "friendly", label: "Friendly" },
]

export const CONTENT_TYPES = [
  { value: "blog", label: "Blog Post" },
  { value: "email", label: "Email" },
  { value: "product", label: "Product Description" },
  { value: "linkedin", label: "LinkedIn Post" },
  { value: "twitter", label: "Tweet" },
  { value: "instagram", label: "Instagram Caption" },
  { value: "cover-letter", label: "Cover Letter" },
  { value: "essay", label: "Essay" },
]

export const CODE_LANGUAGES = [
  { value: "react", label: "React" },
  { value: "nextjs", label: "Next.js" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "sql", label: "SQL" },
]

export const FAQ_ITEMS = [
  {
    question: "What is AI Workspace?",
    answer:
      "AI Workspace is a comprehensive AI-powered platform that provides tools for chat, writing, coding, image generation, resume building, translation, and document analysis.",
  },
  {
    question: "How does the pricing work?",
    answer:
      "We offer flexible pricing plans starting with a free tier. As your needs grow, you can upgrade to Pro or Enterprise plans for additional features and higher usage limits.",
  },
  {
    question: "Can I cancel my subscription?",
    answer:
      "Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.",
  },
  {
    question: "Is my data secure?",
    answer:
      "We take security seriously. All data is encrypted in transit and at rest. We never share your data with third parties.",
  },
  {
    question: "What AI models do you use?",
    answer:
      "We support multiple AI models including GPT-4, GPT-3.5, Claude 3, and Gemini Pro, giving you the flexibility to choose the best model for your task.",
  },
]

export const TESTIMONIALS = [
  {
    name: "Sarah Johnson",
    role: "Product Manager",
    company: "TechCorp",
    image: "https://i.pravatar.cc/150?u=sarah",
    content:
      "AI Workspace has completely transformed how our team works. The AI Writer alone saves us hours every week.",
  },
  {
    name: "Michael Chen",
    role: "Software Engineer",
    company: "StartupX",
    image: "https://i.pravatar.cc/150?u=michael",
    content:
      "The Code Generator is incredibly accurate. It's like having a senior developer pair programming with you.",
  },
  {
    name: "Emily Rodriguez",
    role: "Content Creator",
    company: "CreativeStudio",
    image: "https://i.pravatar.cc/150?u=emily",
    content:
      "I've tried many AI tools, but AI Workspace stands out for its beautiful UI and powerful features.",
  },
]

export const COMPANY_LOGOS = [
  "TechCorp",
  "StartupX",
  "CreativeStudio",
  "DataFlow",
  "CloudBase",
  "NexGen",
]

export const STATISTICS = [
  { label: "Active Users", value: "50K+" },
  { label: "Queries Processed", value: "10M+" },
  { label: "Words Generated", value: "500M+" },
  { label: "Countries", value: "150+" },
]
