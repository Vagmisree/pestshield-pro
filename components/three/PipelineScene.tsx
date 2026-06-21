'use client'

import { useRef, useImperativeHandle, forwardRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, Trail } from '@react-three/drei'
import * as THREE from 'three'

type PipelineSceneRef = {
  activateNode: (index: number) => void
}

const NODES = [
  { position: [-3, 0, 0], label: 'DETECTION' },
  { position: [-1, 0, 0], label: 'ANALYSIS' },
  { position: [1, 0, 0], label: 'DEPLOYMENT' },
  { position: [3, 0, 0], label: 'ELIMINATION' },
]

function PipelineContent({ onNodeActivate }: { onNodeActivate: (index: number) => void }) {
  const [activeNode, setActiveNode] = useState(-1)
  const [packetProgress, setPacketProgress] = useState(0)
  const packetRef = useRef<THREE.Mesh>(null)
  const bugRef = useRef<THREE.Mesh>(null)
  const [bugEliminated, setBugEliminated] = useState(false)

  useFrame((state, delta) => {
    if (activeNode >= 0 && activeNode < NODES.length) {
      // Move packet
      const targetX = NODES[activeNode].position[0]
      if (packetRef.current) {
        packetRef.current.position.x = THREE.MathUtils.lerp(
          packetRef.current.position.x,
          targetX,
          delta * 2
        )

        // Check if reached target
        if (Math.abs(packetRef.current.position.x - targetX) < 0.1) {
          if (activeNode < NODES.length - 1) {
            setTimeout(() => {
              setActiveNode(activeNode + 1)
              onNodeActivate(activeNode + 1)
            }, 500)
          } else if (activeNode === NODES.length - 1) {
            // ELIMINATION step
            setBugEliminated(true)
          }
        }
      }
    }

    // Bug animation at Detection node
    if (bugRef.current && !bugEliminated) {
      bugRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.2
      bugRef.current.rotation.z += delta * 0.5
    }

    // Eliminated bug
    if (bugRef.current && bugEliminated) {
      bugRef.current.scale.lerp(new THREE.Vector3(0, 0, 0), delta * 5)
    }
  })

  useImperativeHandle(
    forwardRef<PipelineSceneRef>((props, ref) => {
      return {
        activateNode: (index: number) => {
          setActiveNode(index)
          onNodeActivate(index)
        },
      }
    }).ref,
    []
  )

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />

      {/* Pipeline tube */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <tubeGeometry
          args={[
            new THREE.CatmullRomCurve3([
              new THREE.Vector3(-3, 0, 0),
              new THREE.Vector3(-1, 0, 0),
              new THREE.Vector3(1, 0, 0),
              new THREE.Vector3(3, 0, 0),
            ]),
            64,
            0.1,
            8,
            false,
          ]}
        />
        <meshStandardMaterial color="#00FF64" transparent opacity={0.2} />
      </mesh>

      {/* Nodes */}
      {NODES.map((node, i) => (
        <group key={i} position={node.position as [number, number, number]}>
          <mesh>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial
              color={activeNode >= i ? '#00FF64' : '#4a4a4a'}
              emissive={activeNode >= i ? '#00FF64' : '#000000'}
              emissiveIntensity={activeNode === i ? 1 : 0.2}
            />
          </mesh>
          {/* Sparkles on active node */}
          {activeNode === i &&
            [...Array(8)].map((_, j) => (
              <mesh
                key={j}
                position={[
                  Math.cos((j * Math.PI * 2) / 8) * 0.5,
                  Math.sin((j * Math.PI * 2) / 8) * 0.5,
                  0,
                ]}
              >
                <sphereGeometry args={[0.05, 8, 8]} />
                <meshStandardMaterial color="#FFB800" emissive="#FFB800" emissiveIntensity={2} />
              </mesh>
            ))}
        </group>
      ))}

      {/* Packet sphere */}
      <Trail
        width={2}
        color="#00FF64"
        length={6}
        decay={1}
        attenuation={(t) => t * t}
      >
        <mesh ref={packetRef} position={[-3, 0, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#FFB800" emissive="#FFB800" emissiveIntensity={1} />
        </mesh>
      </Trail>

      {/* Bug at Detection node */}
      {!bugEliminated && (
        <mesh ref={bugRef} position={[-3, 0.5, 0]}>
          <boxGeometry args={[0.2, 0.15, 0.1]} />
          <meshStandardMaterial color="#4a3f35" />
        </mesh>
      )}
    </>
  )
}

export const PipelineScene = forwardRef<PipelineSceneRef, { onNodeActivate: (index: number) => void }>(
  ({ onNodeActivate }, ref) => {
    return (
      <div className="w-full h-[300px]">
        <Canvas>
          <PipelineContent onNodeActivate={onNodeActivate} />
        </Canvas>
      </div>
    )
  }
)

PipelineScene.displayName = 'PipelineScene'
