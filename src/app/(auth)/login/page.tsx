"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import { Eye, EyeOff, Github, Loader2, LogIn, Mail, Sparkles } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import * as Checkbox from "@radix-ui/react-checkbox"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required").min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().optional(),
})

type LoginForm = z.infer<typeof loginSchema>

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [socialLoading, setSocialLoading] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  })

  const rememberMe = watch("rememberMe")

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    toast.success("Logged in successfully!")
    setIsLoading(false)
  }

  const handleSocialLogin = async (provider: string) => {
    setSocialLoading(provider)
    await new Promise((r) => setTimeout(r, 1200))
    toast.success(`Signed in with ${provider}`)
    setSocialLoading(null)
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Card variant="glass" className="border-0 shadow-2xl shadow-primary/5">
        <CardHeader className="text-center pb-4">
          <motion.div variants={itemVariants}>
            <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
              <LogIn className="h-7 w-7 text-white" />
            </div>
          </motion.div>
          <motion.div variants={itemVariants}>
            <CardTitle className="text-2xl">Welcome back</CardTitle>
          </motion.div>
          <motion.div variants={itemVariants}>
            <CardDescription>Sign in to your AI Workspace account</CardDescription>
          </motion.div>
        </CardHeader>
        <CardContent className="space-y-5">
          <motion.div variants={itemVariants} className="space-y-3">
            <Button
              variant="secondary"
              className="w-full h-11"
              onClick={() => handleSocialLogin("Google")}
              disabled={!!socialLoading}
              aria-label="Sign in with Google"
            >
              {socialLoading === "Google" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              )}
              Google
            </Button>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1 h-11"
                onClick={() => handleSocialLogin("GitHub")}
                disabled={!!socialLoading}
                aria-label="Sign in with GitHub"
              >
                {socialLoading === "GitHub" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Github className="h-5 w-5" />
                )}
                GitHub
              </Button>
              <Button
                variant="secondary"
                className="flex-1 h-11"
                onClick={() => handleSocialLogin("Microsoft")}
                disabled={!!socialLoading}
                aria-label="Sign in with Microsoft"
              >
                {socialLoading === "Microsoft" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="2" y="2" width="9.5" height="9.5" fill="#F25022"/>
                    <rect x="12.5" y="2" width="9.5" height="9.5" fill="#7FBA00"/>
                    <rect x="2" y="12.5" width="9.5" height="9.5" fill="#00A4EF"/>
                    <rect x="12.5" y="12.5" width="9.5" height="9.5" fill="#FFB900"/>
                  </svg>
                )}
                Microsoft
              </Button>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface px-2 text-xs text-text-tertiary">
                or continue with email
              </span>
            </div>
          </motion.div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <motion.div variants={itemVariants}>
              <Input
                label="Email"
                type="email"
                placeholder="name@example.com"
                leftIcon={<Mail className="h-4 w-4" />}
                error={errors.email?.message}
                autoComplete="email"
                {...register("email")}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                showPasswordToggle
                error={errors.password?.message}
                autoComplete="current-password"
                {...register("password")}
              />
            </motion.div>
            <motion.div variants={itemVariants} className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none" htmlFor="remember-me">
                <Checkbox.Root
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setValue("rememberMe", checked === true)}
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded border border-border bg-surface transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                    "data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  )}
                >
                  <Checkbox.Indicator>
                    <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
                      <path d="M3 6L5 8L9 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Checkbox.Indicator>
                </Checkbox.Root>
                <span className="text-sm text-text-secondary">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-primary hover:text-primary-600 transition-colors"
              >
                Forgot password?
              </Link>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Button type="submit" className="w-full h-11" loading={isLoading} size="lg">
                {!isLoading && <LogIn className="h-4 w-4" />}
                Sign In
              </Button>
            </motion.div>
          </form>
        </CardContent>
        <CardFooter className="justify-center pt-4 border-0">
          <motion.p variants={itemVariants} className="text-sm text-text-secondary">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-primary hover:text-primary-600 transition-colors"
            >
              Create one
            </Link>
          </motion.p>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
