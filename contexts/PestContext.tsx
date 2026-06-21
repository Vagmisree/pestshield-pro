'use client'

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react'

declare global {
  interface Window {
    triggerPestShield?: () => void
    dispatchEvent(event: CustomEvent): boolean
  }
  interface WindowEventMap {
    pestKilled: CustomEvent<number>
    shieldActivate: CustomEvent<void>
  }
}

type Phase = 'threat' | 'active' | 'cleared'

interface PestContextValue {
  elimCount: number
  shieldActive: boolean
  phase: Phase
  triggerShield: () => void
  onPestKilled: (n: number) => void
  resetScene: () => void
}

const PestContext = createContext<PestContextValue | null>(null)

export function PestProvider({ children }: { children: ReactNode }) {
  const [elimCount, setElimCount] = useState(0)
  const [shieldActive, setShieldActive] = useState(false)
  const [phase, setPhase] = useState<Phase>('threat')
  const rechargeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const triggerShield = useCallback(() => {
    setShieldActive(true)
    setPhase('active')
    window.triggerPestShield?.()
    // Recharge after 6s
    if (rechargeTimer.current) clearTimeout(rechargeTimer.current)
    rechargeTimer.current = setTimeout(() => {
      setShieldActive(false)
      setPhase('cleared')
    }, 6000)
  }, [])

  const onPestKilled = useCallback((n: number) => {
    setElimCount(c => c + n)
    window.dispatchEvent(new CustomEvent('pestKilled', { detail: n }))
  }, [])

  const resetScene = useCallback(() => {
    setPhase('threat')
    setShieldActive(false)
  }, [])

  // Listen to window-level pestKilled events from the canvas
  useEffect(() => {
    const handler = (e: CustomEvent<number>) => {
      setElimCount(c => c + (e.detail || 1))
    }
    window.addEventListener('pestKilled', handler)
    return () => window.removeEventListener('pestKilled', handler)
  }, [])

  // Expose triggerShield on window (for CockroachScene + Hero btn)
  useEffect(() => {
    // We expose it once PestContext sets it
    // CockroachScene will also set window.triggerPestShield internally
    return () => {
      if (rechargeTimer.current) clearTimeout(rechargeTimer.current)
    }
  }, [])

  return (
    <PestContext.Provider value={{ elimCount, shieldActive, phase, triggerShield, onPestKilled, resetScene }}>
      {children}
    </PestContext.Provider>
  )
}

export function usePest() {
  const ctx = useContext(PestContext)
  if (!ctx) throw new Error('usePest must be used within PestProvider')
  return ctx
}
