'use client'

import { useRef, useMemo, useCallback, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import * as THREE from 'three'
import { SprayEffect } from './SprayEffect'

// ── Types ────────────────────────────────────────────────────────────────────
interface BugData {
  id: number
  pos: THREE.Vector3
  vel: THREE.Vector3
  rotVel: THREE.Vector3
  scale: number
  alive: boolean
  dying: boolean
  dyingTimer: number
  scatterVel: THREE.Vector3
  scatterTime: number
  offset: number       // phase offset for sin drift
}

interface SprayData {
  id: number
  position: [number, number, number]
}

// ── Shared geometry & materials ──────────────────────────────────────────────
const bodyGeo    = new THREE.CylinderGeometry(0.13, 0.22, 1.1, 8)
const headGeo    = new THREE.SphereGeometry(0.20, 8, 6)
const legGeo     = new THREE.CylinderGeometry(0.018, 0.018, 0.55, 4)
const antennaGeo = new THREE.CylinderGeometry(0.012, 0.004, 0.9, 4)

const bodyMat = new THREE.MeshStandardMaterial({ color: '#4A2510', roughness: 0.9, metalness: 0.1 })
const headMat = new THREE.MeshStandardMaterial({ color: '#6B3520', roughness: 0.9, metalness: 0.05 })
const legMat  = new THREE.MeshStandardMaterial({ color: '#2A1008', roughness: 1.0, metalness: 0 })
const deadMat = new THREE.MeshStandardMaterial({ color: '#1A1A1A', roughness: 1.0, metalness: 0 })

// Build one cockroach group
function buildCockroach() {
  const group = new THREE.Group()
  const body = new THREE.Mesh(bodyGeo, bodyMat)
  group.add(body)
  const head = new THREE.Mesh(headGeo, headMat)
  head.position.set(0, 0.5, 0)
  group.add(head)
  // 6 legs
  const legConfigs = [
    [-0.18,  0.1, -0.28,  Math.PI / 3],
    [-0.18,  0.0,  0.0,   Math.PI / 2.5],
    [-0.18, -0.1,  0.28,  Math.PI / 3],
    [ 0.18,  0.1, -0.28, -Math.PI / 3],
    [ 0.18,  0.0,  0.0,  -Math.PI / 2.5],
    [ 0.18, -0.1,  0.28, -Math.PI / 3],
  ]
  legConfigs.forEach(([x, y, z, rz]) => {
    const leg = new THREE.Mesh(legGeo, legMat)
    leg.position.set(x as number, y as number, z as number)
    leg.rotation.z = rz as number
    group.add(leg)
  })
  // Antennae
  const ant1 = new THREE.Mesh(antennaGeo, legMat)
  ant1.position.set(-0.09, 0.65, -0.28); ant1.rotation.set(0.5, 0, -0.3)
  const ant2 = new THREE.Mesh(antennaGeo, legMat)
  ant2.position.set( 0.09, 0.65, -0.28); ant2.rotation.set(0.5, 0,  0.3)
  group.add(ant1, ant2)
  return group
}

// ── Instanced cockroach swarm ────────────────────────────────────────────────
function CockroachSwarm({
  count,
  onKill,
}: {
  count: number
  onKill: (pos: [number, number, number]) => void
}) {
  const { camera, raycaster, gl } = useThree()
  const groupsRef = useRef<THREE.Group[]>([])
  const sceneRef = useRef<THREE.Group>(null)
  const clock = useRef(new THREE.Clock())
  const shieldRef = useRef<THREE.Mesh | null>(null)
  const shieldActive = useRef(false)
  const shieldScale = useRef(0)
  const mouseVec = useRef(new THREE.Vector2())
  const frameCount = useRef(0)

  // Init bug data
  const bugs = useRef<BugData[]>(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * 16,
        12 + Math.random() * 8,
        (Math.random() - 0.5) * 7 - 2
      ),
      vel: new THREE.Vector3(
        (Math.random() - 0.5) * 0.01,
        -(0.008 + Math.random() * 0.014),
        0
      ),
      rotVel: new THREE.Vector3(0.004, (Math.random() - 0.5) * 0.006, 0.002),
      scale: 0.3 + Math.random() * 0.4,
      alive: true,
      dying: false,
      dyingTimer: 0,
      scatterVel: new THREE.Vector3(),
      scatterTime: 0,
      offset: Math.random() * Math.PI * 2,
    }))
  )

  // Build cockroach groups once
  useEffect(() => {
    if (!sceneRef.current) return
    bugs.current.forEach((bug, i) => {
      const g = buildCockroach()
      g.position.copy(bug.pos)
      g.scale.setScalar(bug.scale)
      sceneRef.current!.add(g)
      groupsRef.current[i] = g
    })
  }, [count])

  // Mouse move for scatter
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseVec.current.set(
        (e.clientX / gl.domElement.clientWidth) * 2 - 1,
        -(e.clientY / gl.domElement.clientHeight) * 2 + 1
      )
    }
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [gl])

  // Click to kill
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const click2d = new THREE.Vector2(
        (e.clientX / gl.domElement.clientWidth) * 2 - 1,
        -(e.clientY / gl.domElement.clientHeight) * 2 + 1
      )
      raycaster.setFromCamera(click2d, camera)
      const groups = groupsRef.current.filter(Boolean)
      const intersects = raycaster.intersectObjects(groups, true)
      if (intersects.length > 0) {
        const hit = intersects[0].object
        const group = hit.parent instanceof THREE.Group ? hit.parent : hit.parent?.parent
        if (group) {
          const idx = groupsRef.current.findIndex(g => g === group)
          if (idx !== -1 && bugs.current[idx]?.alive) {
            bugs.current[idx].alive = false
            bugs.current[idx].dying = true
            const p = bugs.current[idx].pos
            onKill([p.x, p.y, p.z])
            window.dispatchEvent(new CustomEvent('pestKilled', { detail: 1 }))
          }
        }
      } else {
        // Spray at floor
        const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 2)
        const target = new THREE.Vector3()
        raycaster.ray.intersectPlane(floorPlane, target)
        if (target) onKill([target.x, target.y, target.z])
      }
    }
    gl.domElement.addEventListener('click', handleClick)
    return () => gl.domElement.removeEventListener('click', handleClick)
  }, [camera, raycaster, gl, onKill])

  // Shield trigger
  useEffect(() => {
    const prev = window.triggerPestShield
    window.triggerPestShield = () => {
      prev?.()
      shieldActive.current = true
      shieldScale.current = 0
    }
    return () => { window.triggerPestShield = prev }
  }, [])

  useFrame(() => {
    if (document.hidden) return
    const delta = Math.min(clock.current.getDelta(), 0.05)
    const t = clock.current.elapsedTime
    frameCount.current++

    // Scatter check every 3 frames
    if (frameCount.current % 3 === 0) {
      raycaster.setFromCamera(mouseVec.current, camera)
      bugs.current.forEach((bug, i) => {
        if (!bug.alive) return
        const dist = raycaster.ray.distanceToPoint(bug.pos)
        if (dist < 2) {
          const away = bug.pos.clone().sub(raycaster.ray.origin).normalize()
          bug.scatterVel.copy(away).multiplyScalar(0.3)
          bug.scatterVel.y += 2
          bug.scatterTime = 60
        }
      })
    }

    // Shield expand
    if (shieldActive.current && shieldRef.current) {
      shieldScale.current = Math.min(shieldScale.current + delta * 15, 30)
      shieldRef.current.scale.setScalar(shieldScale.current)
      const mat = shieldRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = Math.max(0, 0.25 - shieldScale.current / 120)
      if (shieldScale.current >= 30) {
        shieldActive.current = false
        shieldScale.current = 0
        shieldRef.current.scale.setScalar(0)
      }
      // Kill bugs inside sphere
      bugs.current.forEach(bug => {
        if (!bug.alive) return
        const distToCenter = bug.pos.length()
        if (distToCenter < shieldScale.current + 0.5) {
          bug.alive = false
          bug.dying = true
          const p = bug.pos
          onKill([p.x, p.y, p.z])
          window.dispatchEvent(new CustomEvent('pestKilled', { detail: 1 }))
        }
      })
    }

    // Update each bug
    bugs.current.forEach((bug, i) => {
      const g = groupsRef.current[i]
      if (!g) return

      if (bug.dying) {
        bug.dyingTimer += delta
        g.scale.setScalar(bug.scale * Math.max(0, 1 - bug.dyingTimer * 2))
        // Change colour to dead grey
        g.traverse(obj => {
          if (obj instanceof THREE.Mesh) obj.material = deadMat
        })
        if (bug.dyingTimer > 0.5) {
          g.visible = false
          // Respawn
          setTimeout(() => {
            bug.alive = true
            bug.dying = false
            bug.dyingTimer = 0
            bug.pos.set(
              (Math.random() - 0.5) * 16,
              14 + Math.random() * 4,
              (Math.random() - 0.5) * 7 - 2
            )
            g.scale.setScalar(bug.scale)
            g.traverse(obj => {
              if (obj instanceof THREE.Mesh) {
                const isHead = obj.geometry === headGeo
                const isLeg  = obj.geometry === legGeo || obj.geometry === antennaGeo
                obj.material = isHead ? headMat : isLeg ? legMat : bodyMat
              }
            })
            g.visible = true
          }, 4000 + Math.random() * 2000)
        }
        return
      }

      if (!bug.alive) return

      // Scatter damping
      if (bug.scatterTime > 0) {
        bug.scatterTime--
        bug.pos.addScaledVector(bug.scatterVel, delta)
        bug.scatterVel.multiplyScalar(0.95)
      }

      // Normal fall + drift
      bug.pos.addScaledVector(bug.vel, delta * 60)
      bug.pos.x += Math.sin(t + bug.offset) * 0.002

      // Rotation
      g.rotation.x += bug.rotVel.x
      g.rotation.y += bug.rotVel.y
      g.rotation.z += bug.rotVel.z

      // Reset when below floor
      if (bug.pos.y < -12) {
        bug.pos.set(
          (Math.random() - 0.5) * 16,
          15,
          (Math.random() - 0.5) * 7 - 2
        )
      }

      g.position.copy(bug.pos)
    })
  })

  return (
    <group ref={sceneRef}>
      {/* Shield sphere — initially scale 0 */}
      <mesh ref={shieldRef} scale={0}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#00FF64" transparent opacity={0.2} wireframe />
      </mesh>
    </group>
  )
}

// ── Lights ────────────────────────────────────────────────────────────────────
function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight color="#FF2020" position={[-5, 5, 5]} intensity={1.5} />
      <pointLight color="#00FF64" position={[5, -3, 3]}  intensity={0.8} />
      <rectAreaLight color="#1a0a00" intensity={2} position={[0, -4, 0]} rotation={[-Math.PI / 2, 0, 0]} width={20} height={20} />
    </>
  )
}

// ── Main scene component ──────────────────────────────────────────────────────
function Scene() {
  const [sprays, setSprays] = useState<SprayData[]>([])
  const sprayId = useRef(0)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  const handleKill = useCallback((pos: [number, number, number]) => {
    const id = ++sprayId.current
    setSprays(s => [...s, { id, position: pos }])
  }, [])

  const removeSpray = useCallback((id: number) => {
    setSprays(s => s.filter(p => p.id !== id))
  }, [])

  return (
    <>
      <SceneLighting />
      <fog attach="fog" args={['#030508', 10, 60] as unknown as [string, number, number]} />
      <CockroachSwarm count={isMobile ? 15 : 42} onKill={handleKill} />
      {sprays.map(s => (
        <SprayEffect key={s.id} position={s.position} onComplete={() => removeSpray(s.id)} />
      ))}
    </>
  )
}

// ── Exported component ────────────────────────────────────────────────────────
export default function CockroachScene() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        background: '#030508',
      }}
      aria-hidden="true"
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ fov: 60, position: [0, 0, 8], near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: '100%', height: '100%', pointerEvents: 'auto', cursor: 'crosshair' }}
      >
        <Scene />
        <Preload all />
      </Canvas>
    </div>
  )
}
