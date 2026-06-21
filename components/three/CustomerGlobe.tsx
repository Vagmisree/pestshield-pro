'use client'

import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, Html } from '@react-three/drei'
import * as THREE from 'three'

const CITIES = [
  { name: 'Hyderabad', lat: 17.385, lon: 78.4867, testimonialIndex: 0 },
  { name: 'Bangalore', lat: 12.9716, lon: 77.5946, testimonialIndex: 1 },
  { name: 'Mumbai', lat: 19.076, lon: 72.8777, testimonialIndex: 2 },
  { name: 'Chennai', lat: 13.0827, lon: 80.2707, testimonialIndex: 3 },
  { name: 'Pune', lat: 18.5204, lon: 73.8567, testimonialIndex: 4 },
  { name: 'Delhi', lat: 28.7041, lon: 77.1025, testimonialIndex: 5 },
]

function latLonToVector3(lat: number, lon: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)

  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  )
}

function Globe({ onCityClick }: { onCityClick: (index: number, cityName: string) => void }) {
  const globeRef = useRef<THREE.Mesh>(null)
  const [hoveredCity, setHoveredCity] = useState<string | null>(null)

  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.001
    }
  })

  return (
    <group>
      {/* Main globe */}
      <Sphere ref={globeRef} args={[2, 64, 64]}>
        <meshStandardMaterial
          color="#0B3D2E"
          emissive="#00FF64"
          emissiveIntensity={0.1}
          roughness={0.8}
          metalness={0.2}
          wireframe={false}
        />
      </Sphere>

      {/* Wireframe overlay */}
      <Sphere args={[2.01, 32, 32]}>
        <meshBasicMaterial color="#00FF64" wireframe opacity={0.2} transparent />
      </Sphere>

      {/* City pins */}
      {CITIES.map((city) => {
        const position = latLonToVector3(city.lat, city.lon, 2)
        return (
          <group key={city.name} position={position}>
            {/* Pulsing pin */}
            <mesh
              onClick={() => onCityClick(city.testimonialIndex, city.name)}
              onPointerOver={() => setHoveredCity(city.name)}
              onPointerOut={() => setHoveredCity(null)}
            >
              <sphereGeometry args={[0.05, 16, 16]} />
              <meshStandardMaterial
                color={hoveredCity === city.name ? '#FFB800' : '#00FF64'}
                emissive={hoveredCity === city.name ? '#FFB800' : '#00FF64'}
                emissiveIntensity={2}
              />
            </mesh>

            {/* Pulse ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.08, 0.1, 32]} />
              <meshBasicMaterial color="#00FF64" transparent opacity={0.5} side={THREE.DoubleSide} />
            </mesh>

            {/* Tooltip on hover */}
            {hoveredCity === city.name && (
              <Html distanceFactor={10}>
                <div className="bg-[#071F17] border border-[#00FF64] px-3 py-1.5 rounded-lg whitespace-nowrap">
                  <span className="text-[#00FF64] text-xs font-mono">{city.name}</span>
                </div>
              </Html>
            )}
          </group>
        )
      })}
    </group>
  )
}

export function CustomerGlobe({ onCityClick }: { onCityClick: (index: number, cityName: string) => void }) {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#00FF64" />
        <Globe onCityClick={onCityClick} />
      </Canvas>
    </div>
  )
}
