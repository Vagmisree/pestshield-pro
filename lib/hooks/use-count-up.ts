'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

interface UseCountUpOptions {
  duration?: number
  start?: number
  decimals?: number
}

export function useCountUp(
  target: number,
  options: UseCountUpOptions = {}
): { value: string; ref: React.RefObject<HTMLElement | null> } {
  const { duration = 2000, start = 0, decimals = 0 } = options
  const [value, setValue] = useState(start)
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!isInView || hasAnimated.current) return
    hasAnimated.current = true

    const startTime = Date.now()
    const endTime = startTime + duration

    const tick = () => {
      const now = Date.now()
      const progress = Math.min((now - startTime) / duration, 1)
      
      // Ease out cubic
      const easeOutProgress = 1 - Math.pow(1 - progress, 3)
      const currentValue = start + (target - start) * easeOutProgress
      
      setValue(currentValue)

      if (now < endTime) {
        requestAnimationFrame(tick)
      } else {
        setValue(target)
      }
    }

    requestAnimationFrame(tick)
  }, [isInView, target, duration, start])

  const formattedValue = decimals > 0 
    ? value.toFixed(decimals)
    : Math.round(value).toLocaleString('en-IN')

  return { value: formattedValue, ref }
}
