'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Trail, Sphere } from '@react-three/drei'
import * as THREE from 'three'

function Molecule() {
  const groupRef = useRef<THREE.Group>(null)
  const particle1Ref = useRef<THREE.Mesh>(null)
  const particle2Ref = useRef<THREE.Mesh>(null)
  const particle3Ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2
    }

    const time = state.clock.elapsedTime

    // Orbit particles
    if (particle1Ref.current) {
      particle1Ref.current.position.x = Math.cos(time) * 1.5
      particle1Ref.current.position.y = Math.sin(time) * 1.5
    }
    if (particle2Ref.current) {
      particle2Ref.current.position.x = Math.cos(time + (Math.PI * 2) / 3) * 1.5
      particle2Ref.current.position.z = Math.sin(time + (Math.PI * 2) / 3) * 1.5
    }
    if (particle3Ref.current) {
      particle3Ref.current.position.y = Math.cos(time + (Math.PI * 4) / 3) * 1.5
      particle3Ref.current.position.z = Math.sin(time + (Math.PI * 4) / 3) * 1.5
    }
  })

  return (
    <group ref={groupRef}>
      {/* Center distorted sphere */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color="#00FF64"
          emissive="#00FF64"
          emissiveIntensity={0.5}
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>

      {/* Orbiting particles with trails */}
      <Trail width={2} color="#FFB800" length={8} decay={1} attenuation={(t) => t * t}>
        <mesh ref={particle1Ref}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#FFB800" emissive="#FFB800" emissiveIntensity={1} />
        </mesh>
      </Trail>

      <Trail width={2} color="#00FF64" length={8} decay={1} attenuation={(t) => t * t}>
        <mesh ref={particle2Ref}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#00FF64" emissive="#00FF64" emissiveIntensity={1} />
        </mesh>
      </Trail>

      <Trail width={2} color="#FFB800" length={8} decay={1} attenuation={(t) => t * t}>
        <mesh ref={particle3Ref}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#FFB800" emissive="#FFB800" emissiveIntensity={1} />
        </mesh>
      </Trail>
    </group>
  )
}

export function MoleculeOrbit() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00FF64" />
        <Molecule />
      </Canvas>
    </div>
  )
}
