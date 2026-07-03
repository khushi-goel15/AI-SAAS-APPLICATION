"use client"

import { useState, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import { Github, Loader2, Sparkles, UserPlus, Mail, User } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import * as Checkbox from "@radix-ui/react-checkbox"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters"),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[a-z]/, "Must contain a lowercase letter")
      .regex(/[0-9]/, "Must contain a number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms and conditions" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type RegisterForm = z.infer<typeof registerSchema>

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
}

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 1) return { score: 20, label: "Weak", color: "bg-error" }
  if (score <= 3) return { score: 50, label: "Medium", color: "bg-warning" }
  if (score <= 5) return { score: 80, label: "Strong", color: "bg-success-500" }
  return { score: 100, label: "Very Strong", color: "bg-success" }
}

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "", acceptTerms: false },
  })

  const password = watch("password") || ""
  const acceptTerms = watch("acceptTerms")

  const passwordStrength = useMemo(() => getPasswordStrength(password), [password])

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    toast.success("Account created successfully!")
    setIsLoading(false)
  }

  const handleSocialRegister = async (provider: string) => {
    setSocialLoading(provider)
    await new Promise((r) => setTimeout(r, 1200))
    toast.success(`Signed up with ${provider}`)
    setSocialLoading(null)
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Card variant="glass" className="border-0 shadow-2xl shadow-primary/5">
        <CardHeader className="text-center pb-4">
          <motion.div variants={itemVariants}>
            <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
              <UserPlus className="h-7 w-7 text-white" />
            </div>
          </motion.div>
          <motion.div variants={itemVariants}>
            <CardTitle className="text-2xl">Create an account</CardTitle>
          </motion.div>
          <motion.div variants={itemVariants}>
            <CardDescription>Get started with AI Workspace for free</CardDescription>
          </motion.div>
        </CardHeader>
        <CardContent className="space-y-5">
          <motion.div variants={itemVariants} className="space-y-3">
            <Button
              variant="secondary"
              className="w-full h-11"
              onClick={() => handleSocialRegister("Google")}
              disabled={!!socialLoading}
              aria-label="Sign up with Google"
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
            <Button
              variant="secondary"
              className="w-full h-11"
              onClick={() => handleSocialRegister("GitHub")}
              disabled={!!socialLoading}
              aria-label="Sign up with GitHub"
            >
              {socialLoading === "GitHub" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Github className="h-5 w-5" />
              )}
              GitHub
            </Button>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface px-2 text-xs text-text-tertiary">
                or sign up with email
              </span>
            </div>
          </motion.div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <motion.div variants={itemVariants}>
              <Input
                label="Name"
                type="text"
                placeholder="John Doe"
                leftIcon={<User className="h-4 w-4" />}
                error={errors.name?.message}
                autoComplete="name"
                {...register("name")}
              />
            </motion.div>
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
                placeholder="Create a password"
                showPasswordToggle
                error={errors.password?.message}
                autoComplete="new-password"
                {...register("password")}
              />
              {password.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
                      <motion.div
                        className={cn("h-full rounded-full", passwordStrength.color)}
                        initial={{ width: 0 }}
                        animate={{ width: `${passwordStrength.score}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <span className="text-xs font-medium text-text-secondary min-w-[5rem] text-right">
                      {passwordStrength.label}
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {[
                      { label: "At least 8 characters", met: password.length >= 8 },
                      { label: "Uppercase letter", met: /[A-Z]/.test(password) },
                      { label: "Lowercase letter", met: /[a-z]/.test(password) },
                      { label: "A number", met: /[0-9]/.test(password) },
                    ].map((req) => (
                      <li key={req.label} className="flex items-center gap-1.5 text-xs">
                        <span
                          className={cn(
                            "flex h-3.5 w-3.5 items-center justify-center rounded-full",
                            req.met ? "bg-success/20 text-success" : "bg-text-tertiary/20 text-text-tertiary"
                          )}
                        >
                          {req.met ? (
                            <svg className="h-2 w-2" viewBox="0 0 12 12" fill="none">
                              <path d="M3 6L5 8L9 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          ) : (
                            <svg className="h-2 w-2" viewBox="0 0 12 12" fill="none">
                              <circle cx="6" cy="6" r="3" stroke="currentColor" strokeWidth="1.5"/>
                            </svg>
                          )}
                        </span>
                        <span className={cn(req.met ? "text-success" : "text-text-tertiary")}>
                          {req.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
            <motion.div variants={itemVariants}>
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                showPasswordToggle
                error={errors.confirmPassword?.message}
                autoComplete="new-password"
                {...register("confirmPassword")}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <label className="flex items-start gap-2 cursor-pointer" htmlFor="accept-terms">
                <Checkbox.Root
                  id="accept-terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setValue("acceptTerms", checked === true)}
                  className={cn(
                    "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-border bg-surface transition-colors",
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
                <span className="text-sm text-text-secondary">
                  I accept the{" "}
                  <Link href="/terms" className="font-medium text-primary hover:text-primary-600 transition-colors">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="font-medium text-primary hover:text-primary-600 transition-colors">
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="mt-1 text-sm text-error flex items-center gap-1.5" role="alert">
                  {errors.acceptTerms.message}
                </p>
              )}
            </motion.div>
            <motion.div variants={itemVariants}>
              <Button type="submit" className="w-full h-11" loading={isLoading} size="lg">
                {!isLoading && <Sparkles className="h-4 w-4" />}
                Create Account
              </Button>
            </motion.div>
          </form>
        </CardContent>
        <CardFooter className="justify-center pt-4 border-0">
          <motion.p variants={itemVariants} className="text-sm text-text-secondary">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:text-primary-600 transition-colors"
            >
              Sign in
            </Link>
          </motion.p>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
