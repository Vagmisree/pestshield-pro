'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Particles() {
  const particlesRef = useRef<THREE.Points>(null)
  const particleCount = 200

  const { positions, velocities, colors } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const velocities = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      
      // Start at center
      positions[i3] = 0
      positions[i3 + 1] = 0
      positions[i3 + 2] = 0

      // Random velocity in all directions
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      const speed = 2 + Math.random() * 3

      velocities[i3] = Math.sin(phi) * Math.cos(theta) * speed
      velocities[i3 + 1] = Math.sin(phi) * Math.sin(theta) * speed
      velocities[i3 + 2] = Math.cos(phi) * speed

      // Random color: Green or Amber
      const isGreen = Math.random() > 0.5
      if (isGreen) {
        colors[i3] = 0.0      // R
        colors[i3 + 1] = 1.0  // G
        colors[i3 + 2] = 0.4  // B
      } else {
        colors[i3] = 1.0      // R
        colors[i3 + 1] = 0.72 // G
        colors[i3 + 2] = 0.0  // B
      }
    }

    return { positions, velocities, colors }
  }, [])

  useFrame((state, delta) => {
    if (!particlesRef.current) return

    const posArray = particlesRef.current.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3

      // Update positions
      posArray[i3] += velocities[i3] * delta * 10
      posArray[i3 + 1] += velocities[i3 + 1] * delta * 10
      posArray[i3 + 2] += velocities[i3 + 2] * delta * 10

      // Add gravity
      velocities[i3 + 1] -= delta * 5
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

export function CTAParticleExplosion() {
  return (
    <div className="w-full h-full pointer-events-none">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <Particles />
      </Canvas>
    </div>
  )
}
