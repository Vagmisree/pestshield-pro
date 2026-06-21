'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ── Materials (shared across instances) ────────────────────────────────────
const bodyMat = new THREE.MeshStandardMaterial({ color: '#4A2510', roughness: 0.9, metalness: 0.1 })
const headMat = new THREE.MeshStandardMaterial({ color: '#6B3520', roughness: 0.9, metalness: 0.05 })
const legMat  = new THREE.MeshStandardMaterial({ color: '#2A1008', roughness: 1.0, metalness: 0 })

// ── Geometries (shared) ─────────────────────────────────────────────────────
const bodyGeo   = new THREE.CylinderGeometry(0.15, 0.25, 1.2, 8)
const headGeo   = new THREE.SphereGeometry(0.22, 8, 6)
const legGeo    = new THREE.CylinderGeometry(0.02, 0.02, 0.6, 4)
const antennaGeo = new THREE.CylinderGeometry(0.015, 0.005, 1.0, 4)

interface CockroachProps {
  position: [number, number, number]
  scale?: number
  rotationOffset?: number
}

export function Cockroach({ position, scale = 1, rotationOffset = 0 }: CockroachProps) {
  const groupRef = useRef<THREE.Group>(null)
  const legRefs = useRef<THREE.Mesh[]>([])
  let t = rotationOffset

  useFrame((_, delta) => {
    if (!groupRef.current) return
    t += delta
    // Leg walk animation
    legRefs.current.forEach((leg, i) => {
      if (!leg) return
      const phase = (i % 2 === 0 ? 1 : -1) * Math.sin(t * 4 + i) * 0.2
      leg.rotation.z = phase
    })
    // Subtle body bob
    groupRef.current.position.y = position[1] + Math.sin(t * 3) * 0.008
  })

  // Build 6 leg configs: [side (-1/1), x_offset, y_offset, z_offset, base_angle]
  const legConfigs = useMemo(() => [
    // Left legs
    { side: -1, x: -0.18, y: 0.1,  z: -0.3, angle: -Math.PI / 3 },
    { side: -1, x: -0.18, y: 0.0,  z:  0.0, angle: -Math.PI / 2.5 },
    { side: -1, x: -0.18, y: -0.1, z:  0.3, angle: -Math.PI / 3 },
    // Right legs
    { side:  1, x:  0.18, y: 0.1,  z: -0.3, angle:  Math.PI / 3 },
    { side:  1, x:  0.18, y: 0.0,  z:  0.0, angle:  Math.PI / 2.5 },
    { side:  1, x:  0.18, y: -0.1, z:  0.3, angle:  Math.PI / 3 },
  ], [])

  return (
    <group ref={groupRef} position={position} scale={[scale, scale, scale]}>
      {/* Body */}
      <mesh geometry={bodyGeo} material={bodyMat} />

      {/* Pronotum / head */}
      <mesh geometry={headGeo} material={headMat} position={[0, 0.55, 0]} />

      {/* 6 Legs */}
      {legConfigs.map((cfg, i) => (
        <mesh
          key={i}
          ref={el => { if (el) legRefs.current[i] = el }}
          geometry={legGeo}
          material={legMat}
          position={[cfg.x * cfg.side, cfg.y, cfg.z]}
          rotation={[0, 0, cfg.angle]}
        />
      ))}

      {/* 2 Antennae */}
      <mesh geometry={antennaGeo} material={legMat} position={[-0.1, 0.7, -0.3]} rotation={[0.5, 0, -0.3]} />
      <mesh geometry={antennaGeo} material={legMat} position={[ 0.1, 0.7, -0.3]} rotation={[0.5, 0,  0.3]} />
    </group>
  )
}
