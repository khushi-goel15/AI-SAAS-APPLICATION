"use client"

import { useState, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import { CheckCircle2, KeyRound, Loader2, Lock, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const resetSchema = z
  .object({
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[a-z]/, "Must contain a lowercase letter")
      .regex(/[0-9]/, "Must contain a number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type ResetForm = z.infer<typeof resetSchema>

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

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", confirmPassword: "" },
  })

  const password = watch("password") || ""
  const passwordStrength = useMemo(() => getPasswordStrength(password), [password])

  const onSubmit = async (data: ResetForm) => {
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    setIsSuccess(true)
    toast.success("Password reset successfully!")
    setIsLoading(false)
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Card variant="glass" className="border-0 shadow-2xl shadow-primary/5">
        <CardHeader className="text-center pb-4">
          <motion.div variants={itemVariants}>
            <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
              {isSuccess ? (
                <CheckCircle2 className="h-7 w-7 text-white" />
              ) : (
                <KeyRound className="h-7 w-7 text-white" />
              )}
            </div>
          </motion.div>
          <motion.div variants={itemVariants}>
            <CardTitle className="text-2xl">
              {isSuccess ? "Password reset!" : "Reset password"}
            </CardTitle>
          </motion.div>
          <motion.div variants={itemVariants}>
            <CardDescription>
              {isSuccess
                ? "Your password has been reset successfully"
                : "Enter your new password below"}
            </CardDescription>
          </motion.div>
        </CardHeader>
        <CardContent className="space-y-5">
          {isSuccess ? (
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="rounded-xl bg-success/10 border border-success/20 p-4 text-center">
                <p className="text-sm text-success-600 dark:text-success-500">
                  Your password has been updated. You can now sign in with your new password.
                </p>
              </div>
              <Link href="/login">
                <Button className="w-full h-11" size="lg">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to login
                </Button>
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <motion.div variants={itemVariants}>
                <Input
                  label="New Password"
                  type="password"
                  placeholder="Enter new password"
                  leftIcon={<Lock className="h-4 w-4" />}
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
                  label="Confirm New Password"
                  type="password"
                  placeholder="Confirm new password"
                  leftIcon={<Lock className="h-4 w-4" />}
                  showPasswordToggle
                  error={errors.confirmPassword?.message}
                  autoComplete="new-password"
                  {...register("confirmPassword")}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <Button type="submit" className="w-full h-11" loading={isLoading} size="lg">
                  {!isLoading && <KeyRound className="h-4 w-4" />}
                  Reset Password
                </Button>
              </motion.div>
            </form>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
