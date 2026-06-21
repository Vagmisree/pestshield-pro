'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ── Floating geometric particles ─────────────────────────────────────────────
function FloatingGeometry({ count = 60 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: [
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20 - 10,
      ] as [number, number, number],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] as [number, number, number],
      speed: 0.002 + Math.random() * 0.004,
      rotSpeed: [
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.01,
      ] as [number, number, number],
      scale: 0.05 + Math.random() * 0.25,
    }))
  }, [count])

  useFrame((state) => {
    if (!meshRef.current) return
    const time = state.clock.elapsedTime

    particles.forEach((p, i) => {
      p.rotation[0] += p.rotSpeed[0]
      p.rotation[1] += p.rotSpeed[1]
      p.rotation[2] += p.rotSpeed[2]

      dummy.position.set(
        p.position[0] + Math.sin(time * p.speed + i) * 0.3,
        p.position[1] + Math.cos(time * p.speed * 0.7 + i) * 0.2,
        p.position[2]
      )
      dummy.rotation.set(p.rotation[0], p.rotation[1], p.rotation[2])
      dummy.scale.setScalar(p.scale)
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#00FF64"
        emissive="#00FF64"
        emissiveIntensity={0.3}
        transparent
        opacity={0.15}
        wireframe
      />
    </instancedMesh>
  )
}

// ── Grid plane ────────────────────────────────────────────────────────────────
function GridPlane() {
  return (
    <gridHelper
      args={[80, 40, '#00FF64', '#0B3D2E']}
      position={[0, -12, -5]}
      rotation={[0.1, 0, 0]}
    />
  )
}

// ── Large rotating torus rings ────────────────────────────────────────────────
function TorusRing({ radius, speed, color, y }: { radius: number; speed: number; color: string; y: number }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x += speed * 0.7
      ref.current.rotation.z += speed
    }
  })
  return (
    <mesh ref={ref} position={[0, y, -15]}>
      <torusGeometry args={[radius, 0.05, 8, 80]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} transparent opacity={0.2} />
    </mesh>
  )
}

// ── Inner scene ───────────────────────────────────────────────────────────────
function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 5]} intensity={0.5} color="#00FF64" />
      <pointLight position={[-10, -10, 5]} intensity={0.3} color="#0B3D2E" />

      <FloatingGeometry count={50} />
      <GridPlane />
      <TorusRing radius={18} speed={0.0015} color="#00FF64" y={0} />
      <TorusRing radius={12} speed={-0.002} color="#FFB800" y={3} />
      <TorusRing radius={25} speed={0.001} color="#00FF64" y={-5} />
    </>
  )
}

// ── Exported canvas ───────────────────────────────────────────────────────────
export function Scene3DBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 60 }}
        gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}
        dpr={[1, 1.5]}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
