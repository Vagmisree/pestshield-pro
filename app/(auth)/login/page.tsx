'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Shield, Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '@/stores/useAuthStore'
const loginSchema = z.object({
  identifier: z.string().min(1, 'Phone or email is required'),
  password: z.string().min(1, 'Password is required'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    setError('')
    try {
      await login(data.identifier, data.password)
      const { role } = useAuthStore.getState()
      if (role === 'ADMIN') router.push('/admin')
      else if (role === 'TECHNICIAN') router.push('/technician')
      else router.push('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid credentials. Please try again.')
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-[45%_55%]">
      {/* Left — brand panel */}
      <div className="hidden lg:flex flex-col justify-between bg-forest-900 texture-organic p-12 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-400/8 rounded-full blur-3xl" />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <Shield className="w-6 h-6 text-emerald-400" />
          </div>
          <span className="font-display font-bold text-white text-lg">PestShield Pro</span>
        </div>

        {/* Center content */}
        <div className="relative z-10">
          <p className="font-display font-black text-5xl text-white leading-[1.1] mb-6">
            {"India's most trusted"}
            <br />
            <span className="gradient-text">pest control platform.</span>
          </p>
          {/* Customer quote */}
          <div className="glass-card rounded-2xl p-5">
            <p className="text-white/80 text-sm italic mb-3">
              &ldquo;Booked in 60 seconds, technician arrived on time. The OTP system for job closure is brilliant.&rdquo;
            </p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-400 flex items-center justify-center text-forest-900 font-bold text-sm">P</div>
              <div>
                <p className="text-white text-xs font-semibold">Priya Sharma</p>
                <p className="text-white/50 text-xs">Hyderabad · Verified Customer</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex gap-3 relative z-10 flex-wrap">
          {['ISO Certified', 'DPDPA Compliant', '4.8★ Rating'].map((b) => (
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

          <h1 className="font-display font-bold text-3xl text-ink mb-2">Welcome back</h1>
          <p className="text-neutral-500 text-sm mb-8">Sign in to manage your bookings</p>

          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-6">
            <div>
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1.5 block">
                Phone Number
              </label>
              <div className="flex">
                <span className="flex items-center px-4 bg-cream-200 border border-r-0 border-cream-300 rounded-l-xl text-sm font-medium text-neutral-600">+91</span>
                <input
                  {...register('identifier')}
                  type="text"
                  placeholder="98765 43210"
                  className="flex-1 px-4 py-3 bg-card border border-cream-300 rounded-r-xl text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/15 transition-all"
                />
              </div>
              {errors.identifier && <p className="text-xs text-red-500 mt-1">{errors.identifier.message}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 bg-card border border-cream-300 rounded-xl text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/15 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-1"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-sm text-brand-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-all shadow-card hover:shadow-hover disabled:opacity-60"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-neutral-500">
            New customer?{' '}
            <Link href="/register" className="text-brand-600 font-semibold hover:underline">
              Book your first service
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
