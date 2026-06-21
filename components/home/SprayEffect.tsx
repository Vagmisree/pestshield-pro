'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface SprayEffectProps {
  position: [number, number, number]
  onComplete?: () => void
}

export function SprayEffect({ position, onComplete }: SprayEffectProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const startTime = useRef(Date.now())
  const DURATION = 1200 // ms

  const { positions, velocities } = useMemo(() => {
    const count = 20
    const pos = new Float32Array(count * 3)
    const vel: [number, number, number][] = []
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = position[0]
      pos[i * 3 + 1] = position[1]
      pos[i * 3 + 2] = position[2]
      vel.push([
        (Math.random() - 0.5) * 3,
        Math.random() * 3 + 1,
        (Math.random() - 0.5) * 3,
      ])
    }
    return { positions: pos, velocities: vel }
  }, [position])

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions.slice(), 3))
    return geo
  }, [positions])

  const material = useMemo(() => new THREE.PointsMaterial({
    color: '#00FF64',
    size: 0.12,
    transparent: true,
    opacity: 1,
    sizeAttenuation: true,
  }), [])

  useFrame(() => {
    if (!pointsRef.current) return
    const elapsed = Date.now() - startTime.current
    const t = elapsed / DURATION
    if (t >= 1) {
      onComplete?.()
      return
    }
    material.opacity = 1 - t
    const posAttr = geometry.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < velocities.length; i++) {
      const [vx, vy, vz] = velocities[i]
      posAttr.setXYZ(
        i,
        position[0] + vx * t * 1.5,
        position[1] + vy * t * 1.5 - 2 * t * t, // arc
        position[2] + vz * t * 1.5
      )
    }
    posAttr.needsUpdate = true
  })

  return <points ref={pointsRef} geometry={geometry} material={material} />
}
