import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function StarField() {
  const count = 280
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 12 + Math.random() * 18
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi) - 8
    }
    return pos
  }, [])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.045} color="#A8C4DC" transparent opacity={0.75} sizeAttenuation />
    </points>
  )
}

function OrbitalRing({ radius, inclination, yaw, speed, color, opacity }) {
  const ref = useRef()
  useFrame(() => {
    ref.current.rotation.y += speed
  })
  return (
    <group ref={ref} rotation={[inclination, yaw, 0]}>
      <mesh>
        <torusGeometry args={[radius, 0.007, 8, 140]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} />
      </mesh>
    </group>
  )
}

function GlowCore() {
  const ref = useRef()
  useFrame((state) => {
    ref.current.material.opacity = 0.06 + Math.sin(state.clock.elapsedTime * 0.6) * 0.02
  })
  return (
    <mesh ref={ref} position={[0, 0, -4]}>
      <sphereGeometry args={[1.2, 32, 32]} />
      <meshBasicMaterial color="#E8520B" transparent opacity={0.06} />
    </mesh>
  )
}

export default function Background3D() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 1.5, 9], fov: 52 }} gl={{ antialias: true, alpha: true }}>
        <StarField />
        <GlowCore />
        <OrbitalRing radius={4.2} inclination={0.48} yaw={0.2} speed={0.0008} color="#E8520B" opacity={0.22} />
        <OrbitalRing radius={5.8} inclination={-0.75} yaw={1.1} speed={0.0005} color="#4899D0" opacity={0.16} />
        <OrbitalRing radius={3.1} inclination={1.15} yaw={0.6} speed={0.0012} color="#E8520B" opacity={0.13} />
        <OrbitalRing radius={7.2} inclination={0.28} yaw={-0.4} speed={0.0003} color="#4899D0" opacity={0.10} />
        <OrbitalRing radius={2.4} inclination={-1.4} yaw={0.9} speed={0.0018} color="#E8A07A" opacity={0.09} />
      </Canvas>
    </div>
  )
}
