'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Eye, EyeOff, Check } from 'lucide-react'
import { useAuthStore } from '@/stores/useAuthStore'
import { OtpInput } from '@/components/auth/OtpInput'
import { cn } from '@/lib/utils'

const step1Schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
})

const step3Schema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

type Step1Form = z.infer<typeof step1Schema>
type Step3Form = z.infer<typeof step3Schema>

const stepLabels = ['Your Details', 'Verify OTP', 'Set Password']

export default function RegisterPage() {
  const router = useRouter()
  const { register: registerUser, verifyOtp, isLoading } = useAuthStore()
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)
  const [tempToken, setTempToken] = useState('')
  const [otp, setOtp] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [step1Data, setStep1Data] = useState<Step1Form | null>(null)

  const form1 = useForm<Step1Form>({ resolver: zodResolver(step1Schema) })
  const form3 = useForm<Step3Form>({ resolver: zodResolver(step3Schema) })

  const handleStep1 = async (data: Step1Form) => {
    setError('')
    try {
      const result = await registerUser({ name: data.name, phone: data.phone, password: 'temp' })
      setTempToken((result as { tempToken?: string })?.tempToken || 'mock-token')
      setStep1Data(data)
      setCurrentStep(2)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    }
  }

  const handleStep2 = () => {
    if (otp.length !== 6) { setError('Enter the 6-digit OTP'); return }
    setError('')
    setCurrentStep(3)
  }

  const handleStep3 = async () => {
    setError('')
    try {
      await verifyOtp(tempToken, otp)
      router.push('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Verification failed')
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-[45%_55%]">
      {/* Left — brand panel */}
      <div className="hidden lg:flex flex-col justify-between bg-forest-900 texture-organic p-12 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-400/8 rounded-full blur-3xl" />

        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <Shield className="w-6 h-6 text-emerald-400" />
          </div>
          <span className="font-display font-bold text-white text-lg">PestShield Pro</span>
        </div>

        <div className="relative z-10">
          <p className="font-display font-black text-5xl text-white leading-[1.1] mb-6">
            Join 12,000+ homes
            <br />
            <span className="gradient-text">living pest-free.</span>
          </p>
          <div className="glass-card rounded-2xl p-5">
            <p className="text-white/80 text-sm italic mb-3">
              &ldquo;Signed up, booked, and got my house treated — all in the same day. Incredible service!&rdquo;
            </p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-400 flex items-center justify-center text-forest-900 font-bold text-sm">R</div>
              <div>
                <p className="text-white text-xs font-semibold">Rahul M.</p>
                <p className="text-white/50 text-xs">Bangalore · Verified Customer</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 relative z-10 flex-wrap">
          {['Free Inspection', 'Organic Safe', '30-Day Guarantee'].map((b) => (
            <span key={b} className="glass-card rounded-full px-3 py-1.5 text-white/70 text-xs font-medium">{b}</span>
          ))}
        </div>
      </div>

      {/* Right — form */}
      <div className="flex items-center justify-center bg-cream-100 px-8 py-16">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <Shield className="w-6 h-6 text-brand-600" />
            <span className="font-display font-bold text-ink">PestShield Pro</span>
          </div>

          <h1 className="font-display font-bold text-3xl text-ink mb-2">Create account</h1>
          <p className="text-neutral-500 text-sm mb-6">Get started in 60 seconds</p>

          {/* Step progress */}
          <div className="flex items-center gap-2 mb-8">
            {stepLabels.map((label, i) => {
              const stepNum = (i + 1) as 1 | 2 | 3
              const isDone = currentStep > stepNum
              const isCurrent = currentStep === stepNum
              return (
                <div key={label} className="flex items-center gap-2 flex-1 last:flex-initial">
                  <div className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all',
                    isDone ? 'bg-emerald-400 text-white' : isCurrent ? 'bg-brand-600 text-white' : 'bg-cream-300 text-neutral-400'
                  )}>
                    {isDone ? <Check className="w-3.5 h-3.5" /> : stepNum}
                  </div>
                  {i < stepLabels.length - 1 && (
                    <div className={cn('flex-1 h-0.5 rounded-full transition-all', isDone ? 'bg-emerald-400' : 'bg-cream-300')} />
                  )}
                </div>
              )
            })}
          </div>

          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
          )}

          <AnimatePresence mode="wait">
            {/* Step 1 */}
            {currentStep === 1 && (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={form1.handleSubmit(handleStep1)}
                className="space-y-4"
              >
                <div>
                  <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1.5 block">Full Name</label>
                  <input
                    {...form1.register('name')}
                    placeholder="Priya Sharma"
                    className="w-full px-4 py-3 bg-card border border-cream-300 rounded-xl text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/15 transition-all"
                  />
                  {form1.formState.errors.name && <p className="text-xs text-red-500 mt-1">{form1.formState.errors.name.message}</p>}
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1.5 block">Mobile Number</label>
                  <div className="flex">
                    <span className="flex items-center px-4 bg-cream-200 border border-r-0 border-cream-300 rounded-l-xl text-sm font-medium text-neutral-600">+91</span>
                    <input
                      {...form1.register('phone')}
                      placeholder="9876543210"
                      className="flex-1 px-4 py-3 bg-card border border-cream-300 rounded-r-xl text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/15 transition-all"
                    />
                  </div>
                  {form1.formState.errors.phone && <p className="text-xs text-red-500 mt-1">{form1.formState.errors.phone.message}</p>}
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-all disabled:opacity-60"
                >
                  {isLoading ? 'Sending OTP...' : 'Send OTP →'}
                </button>
              </motion.form>
            )}

            {/* Step 2 — OTP */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <p className="text-sm text-neutral-500">
                  Enter the 6-digit OTP sent to <span className="font-semibold text-ink">+91 {step1Data?.phone}</span>
                </p>
                <OtpInput length={6} onComplete={setOtp} />
                <button
                  onClick={handleStep2}
                  className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-all"
                >
                  Verify OTP →
                </button>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="w-full text-sm text-neutral-500 hover:text-neutral-700"
                >
                  ← Change number
                </button>
              </motion.div>
            )}

            {/* Step 3 — Password */}
            {currentStep === 3 && (
              <motion.form
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={form3.handleSubmit(handleStep3)}
                className="space-y-4"
              >
                <div>
                  <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1.5 block">Create Password</label>
                  <div className="relative">
                    <input
                      {...form3.register('password')}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min 8 characters"
                      className="w-full px-4 py-3 pr-12 bg-card border border-cream-300 rounded-xl text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/15 transition-all"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 p-1">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {form3.formState.errors.password && <p className="text-xs text-red-500 mt-1">{form3.formState.errors.password.message}</p>}
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1.5 block">Confirm Password</label>
                  <input
                    {...form3.register('confirmPassword')}
                    type="password"
                    placeholder="Repeat password"
                    className="w-full px-4 py-3 bg-card border border-cream-300 rounded-xl text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/15 transition-all"
                  />
                  {form3.formState.errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{form3.formState.errors.confirmPassword.message}</p>}
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-all disabled:opacity-60"
                >
                  {isLoading ? 'Creating account...' : 'Create Account →'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <p className="text-center text-sm text-neutral-500 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-brand-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
