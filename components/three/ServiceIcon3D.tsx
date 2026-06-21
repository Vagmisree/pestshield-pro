'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Icon3D({ mesh }: { mesh: string }) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2
      meshRef.current.rotation.y += 0.01
    }
  })

  const geometry = {
    bug: <boxGeometry args={[0.5, 0.3, 0.2]} />,
    torus: <torusKnotGeometry args={[0.3, 0.1, 50, 8]} />,
    sphere: <sphereGeometry args={[0.3, 16, 16]} />,
    cone: <coneGeometry args={[0.3, 0.5, 16]} />,
    octahedron: <octahedronGeometry args={[0.35]} />,
    dodecahedron: <dodecahedronGeometry args={[0.35]} />,
  }[mesh]

  return (
    <mesh ref={meshRef}>
      {geometry}
      <meshStandardMaterial color="#00FF64" metalness={0.6} roughness={0.4} />
    </mesh>
  )
}

export function ServiceIcon3D({ mesh }: { mesh: string }) {
  return (
    <Canvas camera={{ position: [0, 0, 2] }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Icon3D mesh={mesh} />
    </Canvas>
  )
}
