import { useState, useEffect, useRef } from 'react'

export default function MobileBackground() {
  const [tilt, setTilt] = useState({ x: 50, y: 60 })
  const tiltRef = useRef({ x: 50, y: 60 })
  const rafRef = useRef(null)

  useEffect(() => {
    let active = true

    const handleOrientation = (e) => {
      if (e.gamma === null || !active) return
      // gamma = left/right (-90 to 90), beta = front/back (-180 to 180)
      const x = 50 + (e.gamma / 45) * 28
      const y = 50 + ((e.beta - 40) / 50) * 20
      tiltRef.current = {
        x: Math.max(5, Math.min(95, x)),
        y: Math.max(5, Math.min(95, y)),
      }
    }

    // Smooth lerp loop
    const loop = () => {
      if (!active) return
      setTilt(prev => ({
        x: prev.x + (tiltRef.current.x - prev.x) * 0.06,
        y: prev.y + (tiltRef.current.y - prev.y) * 0.06,
      }))
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    const start = () => {
      window.addEventListener('deviceorientation', handleOrientation, { passive: true })
    }

    // iOS 13+ needs a user gesture permission
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {
      const requestPerm = async () => {
        try {
          const perm = await DeviceOrientationEvent.requestPermission()
          if (perm === 'granted') start()
        } catch {}
      }
      window.addEventListener('touchstart', requestPerm, { once: true })
    } else {
      start()
    }

    return () => {
      active = false
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('deviceorientation', handleOrientation)
    }
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        backgroundImage: `
          radial-gradient(circle, rgba(72,153,208,0.22) 1px, transparent 1px),
          radial-gradient(ellipse 70% 60% at ${tilt.x}% ${tilt.y}%, rgba(72,153,208,0.14) 0%, transparent 70%),
          radial-gradient(ellipse 50% 45% at ${100 - tilt.x}% ${100 - tilt.y}%, rgba(232,82,11,0.08) 0%, transparent 65%)
        `,
        backgroundSize: '28px 28px, 100% 100%, 100% 100%',
      }}
    />
  )
}
