'use client'

import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

interface FloatingCard3DProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  intensity?: number
  glare?: boolean
  depth?: boolean
}

export function FloatingCard3D({
  children,
  className = '',
  style = {},
  intensity = 12,
  glare = true,
  depth = true,
}: FloatingCard3DProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springConfig = { stiffness: 150, damping: 20 }
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [intensity, -intensity]), springConfig)
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-intensity, intensity]), springConfig)
  const glareX = useTransform(x, [-0.5, 0.5], ['-30%', '130%'])
  const glareY = useTransform(y, [-0.5, 0.5], ['-30%', '130%'])
  const scale = useSpring(hovered ? 1.03 : 1, springConfig)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const handleMouseLeave = () => {
    setHovered(false)
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={{
        ...style,
        rotateX,
        rotateY,
        scale,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Depth shadow layer */}
      {depth && (
        <motion.div
          className="absolute inset-0 rounded-[inherit] pointer-events-none"
          style={{
            transform: 'translateZ(-20px)',
            background: 'rgba(0,255,100,0.06)',
            filter: 'blur(12px)',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.3s',
          }}
        />
      )}

      {children}

      {/* Glare effect */}
      {glare && hovered && (
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-[inherit] overflow-hidden"
          style={{ zIndex: 10 }}
        >
          <motion.div
            className="absolute w-32 h-32 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)',
              left: glareX,
              top: glareY,
              transform: 'translate(-50%, -50%)',
            }}
          />
        </motion.div>
      )}
    </motion.div>
  )
}
