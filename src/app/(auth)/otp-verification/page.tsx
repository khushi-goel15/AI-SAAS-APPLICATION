"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import { CheckCircle2, Loader2, Shield, ArrowLeft, RefreshCw } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const otpSchema = z.object({
  otp: z.string().min(6, "Please enter the complete 6-digit code"),
})

type OtpForm = z.infer<typeof otpSchema>

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

const RESEND_COOLDOWN = 30

export default function OtpVerificationPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""])
  const [timer, setTimer] = useState(RESEND_COOLDOWN)
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OtpForm>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  })

  useEffect(() => {
    if (timer > 0 && !canResend) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true)
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [timer, canResend])

  const handleOtpChange = useCallback(
    (index: number, value: string) => {
      if (!/^\d*$/.test(value)) return
      const newOtp = [...otpValues]
      newOtp[index] = value.slice(0, 1)
      setOtpValues(newOtp)
      setValue("otp", newOtp.join(""))
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus()
      }
    },
    [otpValues, setValue]
  )

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !otpValues[index] && index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
    },
    [otpValues]
  )

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault()
      const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
      const newOtp = [...otpValues]
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pasted[i] || ""
      }
      setOtpValues(newOtp)
      setValue("otp", newOtp.join(""))
      const lastFilled = pasted.length > 0 ? Math.min(pasted.length - 1, 5) : 0
      inputRefs.current[lastFilled]?.focus()
    },
    [otpValues, setValue]
  )

  const handleResend = async () => {
    if (!canResend) return
    setCanResend(false)
    setTimer(RESEND_COOLDOWN)
    toast.success("New code sent!")
  }

  const onSubmit = async (data: OtpForm) => {
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    setIsSuccess(true)
    toast.success("Email verified successfully!")
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
                <Shield className="h-7 w-7 text-white" />
              )}
            </div>
          </motion.div>
          <motion.div variants={itemVariants}>
            <CardTitle className="text-2xl">
              {isSuccess ? "Verified!" : "Verify your email"}
            </CardTitle>
          </motion.div>
          <motion.div variants={itemVariants}>
            <CardDescription>
              {isSuccess
                ? "Your email has been verified successfully"
                : "Enter the 6-digit code sent to your email"}
            </CardDescription>
          </motion.div>
        </CardHeader>
        <CardContent className="space-y-6">
          {isSuccess ? (
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="rounded-xl bg-success/10 border border-success/20 p-4 text-center">
                <p className="text-sm text-success-600 dark:text-success-500">
                  You can now access all features of your account.
                </p>
              </div>
              <Link href="/login">
                <Button className="w-full h-11" size="lg">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Continue to login
                </Button>
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <motion.div variants={itemVariants} className="space-y-5">
                <div className="flex justify-center gap-2 sm:gap-3">
                  {otpValues.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { inputRefs.current[index] = el }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      aria-label={`Digit ${index + 1}`}
                      className={cn(
                        "h-12 w-10 sm:h-14 sm:w-12 rounded-lg border-2 border-border bg-surface text-center text-lg font-bold text-text-primary",
                        "transition-all duration-200",
                        "focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30",
                        "hover:border-text-tertiary",
                        digit && "border-primary bg-primary/5"
                      )}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
                {errors.otp && (
                  <p className="text-sm text-error text-center" role="alert">
                    {errors.otp.message}
                  </p>
                )}
                <Button type="submit" className="w-full h-11" loading={isLoading} size="lg">
                  {!isLoading && <Shield className="h-4 w-4" />}
                  Verify Email
                </Button>
                <div className="text-center">
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResend}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-600 transition-colors"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Resend code
                    </button>
                  ) : (
                    <p className="text-sm text-text-tertiary">
                      Resend code in <span className="font-medium text-text-secondary">00:{timer.toString().padStart(2, "0")}</span>
                    </p>
                  )}
                </div>
              </motion.div>
            </form>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
