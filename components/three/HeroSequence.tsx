'use client'

import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

function AnimatedBug({ onComplete }: { onComplete: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [time, setTime] = useState(0)

  useFrame((state, delta) => {
    if (!meshRef.current) return
    const newTime = time + delta
    setTime(newTime)

    // Bug crawls in from bottom
    if (newTime < 2) {
      meshRef.current.position.y = -5 + (newTime / 2) * 5
      meshRef.current.rotation.z = Math.sin(newTime * 5) * 0.1
    } else if (newTime < 2.5) {
      // Scanner sweep
      meshRef.current.material = new THREE.MeshStandardMaterial({
        color: '#ff0000',
        emissive: '#ff0000',
        emissiveIntensity: (newTime - 2) * 2,
      })
    } else if (newTime < 3) {
      // Explosion
      const scale = 1 + (newTime - 2.5) * 6
      meshRef.current.scale.setScalar(scale)
      meshRef.current.material.opacity = 1 - (newTime - 2.5) * 2
    } else if (newTime >= 3 && time < 3) {
      onComplete()
    }
  })

  return (
    <mesh ref={meshRef} position={[0, -5, 0]}>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshStandardMaterial color="#4a3f35" />
    </mesh>
  )
}

function Scene({ onComplete }: { onComplete: () => void }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <AnimatedBug onComplete={onComplete} />
    </>
  )
}

export function HeroSequence({ onSequenceComplete }: { onSequenceComplete: () => void }) {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas>
        <Scene onComplete={onSequenceComplete} />
      </Canvas>
    </div>
  )
}
