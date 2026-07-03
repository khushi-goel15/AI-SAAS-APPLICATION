"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  ArrowRight,
  ChevronDown,
  Check,
  Star,
  Quote,
  MessageSquare,
  Github,
  Twitter,
  Linkedin,
  Youtube,
  Sparkles,
  Zap,
  Bot,
} from "lucide-react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AI_TOOLS,
  STATISTICS,
  TESTIMONIALS,
  PRICING_PLANS,
  FAQ_ITEMS,
  COMPANY_LOGOS,
} from "@/constants"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

const scaleVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

function parseStat(value: string): { num: number; suffix: string } {
  const match = value.match(/^(\d+(?:\.\d+)?)([KMB+]?\+?)$/)
  if (!match) return { num: 0, suffix: value }
  let num = parseFloat(match[1])
  const suffix = match[2]
  if (suffix.includes("K")) num *= 1000
  else if (suffix.includes("M")) num *= 1000000
  else if (suffix.includes("B")) num *= 1000000000
  return { num, suffix: suffix.replace(/[KMB]/g, "") }
}

function AnimatedCounter({
  value,
  label,
}: {
  value: string
  label: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [count, setCount] = useState(0)
  const { num, suffix } = parseStat(value)

  useEffect(() => {
    if (!isInView) return
    const duration = 2000
    const start = performance.now()
    let rafId: number
    const animate = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * num))
      if (progress < 1) rafId = requestAnimationFrame(animate)
    }
    rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
  }, [isInView, num])

  const displayValue =
    num >= 1000000
      ? (count / 1000000).toFixed(1)
      : num >= 1000
        ? (count / 1000).toFixed(1)
        : count.toString()

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl font-bold tracking-tight text-text-primary md:text-5xl lg:text-6xl">
        {displayValue}
        <span className="text-primary">{suffix}</span>
      </div>
      <div className="mt-2 text-sm text-text-secondary md:text-base">{label}</div>
    </div>
  )
}

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#cta" },
]

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Changelog", href: "#" },
    { label: "Documentation", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Security", href: "#" },
    { label: "Cookies", href: "#" },
  ],
}

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="relative overflow-x-hidden bg-surface">
      {/* Navbar */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-surface/80 backdrop-blur-xl border-b border-border/50 shadow-sm"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-secondary">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-text-primary">
              AI Workspace
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-all hover:bg-primary-600 shadow-sm shadow-primary/20"
            >
              Get Started
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary hover:bg-surface-secondary md:hidden"
            aria-label="Toggle menu"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <motion.path
                d="M3 5H17"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                animate={mobileMenuOpen ? { d: "M4 16L16 4" } : { d: "M3 5H17" }}
              />
              <motion.path
                d="M3 10H17"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              />
              <motion.path
                d="M3 15H17"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                animate={mobileMenuOpen ? { d: "M4 4L16 16" } : { d: "M3 15H17" }}
              />
            </svg>
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="border-b border-border bg-surface md:hidden"
            >
              <div className="space-y-1 px-4 py-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
                <hr className="my-3 border-border" />
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg bg-primary px-3 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-primary-600"
                >
                  Get Started
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        {/* ==================== HERO ==================== */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
          {/* Animated gradient orbs */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <motion.div
              animate={{
                x: [0, 100, -50, 80, 0],
                y: [0, -80, 60, -40, 0],
              }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-violet-500/30 to-purple-500/20 blur-3xl"
            />
            <motion.div
              animate={{
                x: [0, -60, 80, -30, 0],
                y: [0, 60, -40, 80, 0],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-500/20 blur-3xl"
            />
            <motion.div
              animate={{
                x: [0, 80, -40, 60, 0],
                y: [0, -40, 80, -60, 0],
              }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-primary-500/10 to-pink-500/10 blur-3xl"
            />
          </div>

          <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Badge variant="default" size="lg" className="mb-8">
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                Powered by Advanced AI
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-text-primary sm:text-5xl md:text-6xl lg:text-7xl"
            >
              Your{" "}
              <span className="bg-gradient-to-r from-primary-500 to-secondary bg-clip-text text-transparent">
                AI-Powered
              </span>{" "}
              Workspace
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="mx-auto mt-6 max-w-2xl text-lg text-text-secondary md:text-xl"
            >
              Supercharge your productivity with AI-powered tools for chat, writing, coding,
              image generation, and more. All in one beautiful workspace.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link
                href="/signup"
                className="inline-flex h-14 items-center justify-center rounded-lg bg-primary px-8 text-base font-medium text-white transition-all hover:bg-primary-600 shadow-sm shadow-primary/20 gap-2.5"
              >
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="#features"
                className="inline-flex h-14 items-center justify-center rounded-lg border-2 border-border bg-transparent px-8 text-base font-medium text-text-primary transition-colors hover:bg-surface-secondary gap-2.5"
              >
                Learn More
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="mt-16 flex items-center justify-center gap-8 text-sm text-text-tertiary"
            >
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-success" />
                No credit card
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-success" />
                Free tier included
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-success" />
                Cancel anytime
              </div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ChevronDown className="h-6 w-6 text-text-tertiary" />
            </motion.div>
          </motion.div>
        </section>

        {/* ==================== COMPANY LOGOS ==================== */}
        <section className="border-y border-border/50 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="mb-8 text-center text-sm font-medium text-text-tertiary">
              TRUSTED BY INNOVATIVE TEAMS WORLDWIDE
            </p>
            <div className="relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-surface to-transparent z-10" />
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-surface to-transparent z-10" />
              <motion.div
                className="flex gap-16 items-center"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              >
                {[...COMPANY_LOGOS, ...COMPANY_LOGOS].map((name, i) => (
                  <div
                    key={`${name}-${i}`}
                    className="flex h-10 items-center justify-center shrink-0"
                  >
                    <span className="text-xl font-bold tracking-tight text-text-tertiary/50 select-none">
                      {name}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ==================== FEATURES GRID ==================== */}
        <section id="features" className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="mx-auto max-w-2xl text-center"
            >
              <Badge variant="default" size="lg" className="mb-4">
                <Zap className="mr-1.5 h-3.5 w-3.5" />
                Powerful Tools
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
                Everything you need to be productive
              </h2>
              <p className="mt-4 text-lg text-text-secondary">
                A comprehensive suite of AI-powered tools designed to accelerate your workflow.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {AI_TOOLS.map((tool) => {
                const Icon = tool.icon
                return (
                  <motion.div key={tool.title} variants={itemVariants}>
                    <Link href={tool.href} className="group block h-full">
                      <Card
                        variant="glass"
                        className="relative h-full overflow-hidden transition-all duration-500 group-hover:shadow-xl group-hover:shadow-primary/5 group-hover:-translate-y-1"
                      >
                        <div
                          className={cn(
                            "absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100",
                            "bg-gradient-to-br",
                            tool.color,
                            "opacity-5"
                          )}
                        />
                        <CardContent className="p-6">
                          <div
                            className={cn(
                              "mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br",
                              tool.color,
                              "shadow-lg"
                            )}
                          >
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <h3 className="mb-2 text-lg font-semibold text-text-primary">
                            {tool.title}
                          </h3>
                          <p className="text-sm text-text-secondary leading-relaxed">
                            {tool.description}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </section>

        {/* ==================== STATISTICS ==================== */}
        <section className="relative py-24 sm:py-32 overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="mx-auto max-w-2xl text-center"
            >
              <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
                Trusted by thousands worldwide
              </h2>
              <p className="mt-4 text-lg text-text-secondary">
                Our platform processes millions of queries every day.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
            >
              {STATISTICS.map((stat) => (
                <motion.div key={stat.label} variants={scaleVariants}>
                  <AnimatedCounter value={stat.value} label={stat.label} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ==================== TESTIMONIALS ==================== */}
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="mx-auto max-w-2xl text-center"
            >
              <Badge variant="default" size="lg" className="mb-4">
                <Star className="mr-1.5 h-3.5 w-3.5" />
                Testimonials
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
                Loved by users everywhere
              </h2>
              <p className="mt-4 text-lg text-text-secondary">
                Hear what our users have to say about AI Workspace.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="mt-16 grid gap-8 md:grid-cols-3"
            >
              {TESTIMONIALS.map((testimonial) => (
                <motion.div key={testimonial.name} variants={itemVariants}>
                  <Card variant="glass" className="h-full">
                    <CardContent className="p-6">
                      <Quote className="mb-4 h-8 w-8 text-primary/30" />
                      <p className="mb-6 text-sm leading-relaxed text-text-secondary">
                        &ldquo;{testimonial.content}&rdquo;
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary text-sm font-semibold text-white">
                          {testimonial.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-text-primary">
                            {testimonial.name}
                          </div>
                          <div className="text-xs text-text-tertiary">
                            {testimonial.role} at {testimonial.company}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ==================== PRICING ==================== */}
        <section id="pricing" className="relative py-24 sm:py-32 overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="mx-auto max-w-2xl text-center"
            >
              <Badge variant="default" size="lg" className="mb-4">
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                Pricing
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
                Simple, transparent pricing
              </h2>
              <p className="mt-4 text-lg text-text-secondary">
                Choose the plan that works best for you. Upgrade or cancel anytime.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="mt-16 grid gap-8 lg:grid-cols-3 items-start"
            >
              {PRICING_PLANS.map((plan) => (
                <motion.div
                  key={plan.id}
                  variants={scaleVariants}
                  className={cn(
                    "relative",
                    plan.highlighted && "lg:-mt-4 lg:-mb-4"
                  )}
                >
                  {plan.highlighted && (
                    <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-primary-500 to-secondary opacity-20 blur-sm" />
                  )}
                  <Card
                    variant={plan.highlighted ? "default" : "glass"}
                    className={cn(
                      "relative h-full",
                      plan.highlighted &&
                        "border-primary/30 shadow-xl shadow-primary/10"
                    )}
                  >
                    <CardContent className="p-8">
                      {plan.highlighted && (
                        <Badge variant="primary" size="sm" className="mb-4">
                          Most Popular
                        </Badge>
                      )}
                      <h3 className="text-xl font-semibold text-text-primary">
                        {plan.name}
                      </h3>
                      <p className="mt-1 text-sm text-text-secondary">
                        {plan.description}
                      </p>
                      <div className="mt-6 flex items-baseline gap-1">
                        <span className="text-4xl font-bold tracking-tight text-text-primary">
                          ${plan.price}
                        </span>
                        <span className="text-sm text-text-tertiary">
                          /{plan.interval}
                        </span>
                      </div>

                      <ul className="mt-8 space-y-3">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-3">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                            <span className="text-sm text-text-secondary">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <Link
                        href={plan.id === "enterprise" ? "/contact" : "/signup"}
                        className={cn(
                          "mt-8 inline-flex h-12 w-full items-center justify-center rounded-lg px-6 text-sm font-medium transition-all gap-2",
                          plan.highlighted
                            ? "bg-primary text-white hover:bg-primary-600 shadow-sm shadow-primary/20"
                            : "border-2 border-border bg-transparent text-text-primary hover:bg-surface-secondary"
                        )}
                      >
                        {plan.cta}
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ==================== FAQ ==================== */}
        <section id="faq" className="py-24 sm:py-32">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="mx-auto max-w-2xl text-center"
            >
              <Badge variant="default" size="lg" className="mb-4">
                <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
                FAQ
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
                Frequently asked questions
              </h2>
              <p className="mt-4 text-lg text-text-secondary">
                Got questions? We&apos;ve got answers.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-16"
            >
              <AccordionPrimitive.Root
                type="single"
                collapsible
                className="space-y-3"
              >
                {FAQ_ITEMS.map((item, i) => (
                  <AccordionPrimitive.Item
                    key={i}
                    value={`item-${i}`}
                    className="group"
                  >
                    <Card variant="glass">
                      <AccordionPrimitive.Header className="flex">
                        <AccordionPrimitive.Trigger className="flex flex-1 items-center justify-between p-6 text-left text-sm font-medium text-text-primary transition-colors hover:text-primary-500 [&[data-state=open]>svg]:rotate-180">
                          {item.question}
                          <ChevronDown className="h-4 w-4 shrink-0 text-text-tertiary transition-transform duration-200" />
                        </AccordionPrimitive.Trigger>
                      </AccordionPrimitive.Header>
                      <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                        <div className="px-6 pb-6 pt-0 text-sm leading-relaxed text-text-secondary">
                          {item.answer}
                        </div>
                      </AccordionPrimitive.Content>
                    </Card>
                  </AccordionPrimitive.Item>
                ))}
              </AccordionPrimitive.Root>
            </motion.div>
          </div>
        </section>

        {/* ==================== CTA ==================== */}
        <section id="cta" className="relative py-24 sm:py-32 overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-primary-600 to-secondary opacity-90" />
            <motion.div
              animate={{
                x: [0, 100, -50, 80, 0],
                y: [0, -80, 60, -40, 0],
              }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute -top-40 -left-40 h-[400px] w-[400px] rounded-full bg-white/10 blur-3xl"
            />
            <motion.div
              animate={{
                x: [0, -60, 80, -30, 0],
                y: [0, 60, -40, 80, 0],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-white/10 blur-3xl"
            />
          </div>

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Ready to transform your workflow?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
                Join thousands of professionals who use AI Workspace to supercharge their
                productivity. Start free, no credit card required.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/signup"
                  className="inline-flex h-14 items-center justify-center rounded-lg bg-white px-8 text-base font-medium text-primary-600 transition-all hover:bg-white/90 shadow-xl shadow-black/10 gap-2.5"
                >
                  Get Started Free
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex h-14 items-center justify-center rounded-lg border-2 border-white/30 bg-transparent px-8 text-base font-medium text-white transition-colors hover:bg-white/10 gap-2.5"
                >
                  Talk to Sales
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ==================== FOOTER ==================== */}
      <footer className="border-t border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid gap-12 lg:grid-cols-4">
            {/* Brand column */}
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-secondary">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-semibold tracking-tight text-text-primary">
                  AI Workspace
                </span>
              </Link>
              <p className="mt-4 text-sm leading-relaxed text-text-tertiary max-w-xs">
                Supercharge your productivity with AI-powered tools for modern teams.
              </p>
              <div className="mt-6 flex gap-4">
                <Link
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-text-tertiary transition-colors hover:bg-surface-secondary hover:text-text-primary"
                  aria-label="GitHub"
                >
                  <Github className="h-4 w-4" />
                </Link>
                <Link
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-text-tertiary transition-colors hover:bg-surface-secondary hover:text-text-primary"
                  aria-label="Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </Link>
                <Link
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-text-tertiary transition-colors hover:bg-surface-secondary hover:text-text-primary"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </Link>
                <Link
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-text-tertiary transition-colors hover:bg-surface-secondary hover:text-text-primary"
                  aria-label="YouTube"
                >
                  <Youtube className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="text-sm font-semibold text-text-primary">{title}</h4>
                <ul className="mt-4 space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-text-tertiary transition-colors hover:text-text-primary"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 border-t border-border/50 pt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-text-tertiary">
              &copy; {new Date().getFullYear()} AI Workspace. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                href="#"
                className="text-xs text-text-tertiary transition-colors hover:text-text-primary"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-xs text-text-tertiary transition-colors hover:text-text-primary"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
