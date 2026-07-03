"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import { CheckCircle2, Loader2, Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

const forgotSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
})

type ForgotForm = z.infer<typeof forgotSchema>

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
}

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  })

  const onSubmit = async (data: ForgotForm) => {
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    setIsSuccess(true)
    toast.success("Reset link sent to your email")
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
                <Mail className="h-7 w-7 text-white" />
              )}
            </div>
          </motion.div>
          <motion.div variants={itemVariants}>
            <CardTitle className="text-2xl">
              {isSuccess ? "Check your email" : "Forgot password?"}
            </CardTitle>
          </motion.div>
          <motion.div variants={itemVariants}>
            <CardDescription>
              {isSuccess
                ? "We've sent a password reset link to your email"
                : "Enter your email and we'll send you a reset link"}
            </CardDescription>
          </motion.div>
        </CardHeader>
        <CardContent className="space-y-5">
          {isSuccess ? (
            <motion.div
              variants={itemVariants}
              className="space-y-5"
            >
              <div className="rounded-xl bg-success/10 border border-success/20 p-4 text-center">
                <p className="text-sm text-success-600 dark:text-success-500">
                  If an account exists with that email, you will receive a password reset link shortly.
                </p>
              </div>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full h-11"
                  onClick={() => setIsSuccess(false)}
                >
                  Send again
                </Button>
                <Link href="/login">
                  <Button variant="ghost" className="w-full h-11">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to login
                  </Button>
                </Link>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <motion.div variants={itemVariants}>
                <Input
                  label="Email address"
                  type="email"
                  placeholder="name@example.com"
                  leftIcon={<Mail className="h-4 w-4" />}
                  error={errors.email?.message}
                  autoComplete="email"
                  {...register("email")}
                />
              </motion.div>
              <motion.div variants={itemVariants} className="space-y-3">
                <Button type="submit" className="w-full h-11" loading={isLoading} size="lg">
                  {!isLoading && <Mail className="h-4 w-4" />}
                  Send Reset Link
                </Button>
                <Link href="/login">
                  <Button type="button" variant="ghost" className="w-full h-11">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to login
                  </Button>
                </Link>
              </motion.div>
            </form>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
