import { useEffect, useRef } from 'react'

export default function Background3D({ theme }) {
  const cvRef = useRef(null)

  useEffect(() => {
    const cv = cvRef.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    let W, H, dpr, raf

    const mouse = { x: -9999, y: -9999 }
    const onMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY }
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999 }
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseleave', onLeave)

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = window.innerWidth
      H = window.innerHeight
      cv.width = W * dpr
      cv.height = H * dpr
      cv.style.width = W + 'px'
      cv.style.height = H + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const noise = (x, y, t) =>
      Math.sin(x * 0.016 + t * 0.22) * 32
      + Math.cos(y * 0.022 + t * 0.15) * 22
      + Math.sin((x + y) * 0.010 + t * 0.31) * 16
      + Math.cos(x * 0.007 - y * 0.009 + t * 0.18) * 10

    // Smooth repulsion: pushes each line point away from cursor in Y
    const MOUSE_R = 320   // radius of influence (px)
    const MOUSE_S = 80    // max deflection strength (px)

    const mouseDisp = (x, lineY) => {
      const dx = x - mouse.x
      const dy = lineY - mouse.y
      const dist2 = dx * dx + dy * dy
      if (dist2 >= MOUSE_R * MOUSE_R) return 0
      const dist = Math.sqrt(dist2)
      const t = 1 - dist / MOUSE_R
      const smooth = t * t * (3 - 2 * t)          // smoothstep falloff
      const dirY = dist > 0 ? dy / dist : -1       // unit vector in Y
      return dirY * smooth * MOUSE_S
    }

    const getScroll = () => {
      const hero = document.getElementById('hero-section')
      return hero ? Math.max(0, -hero.getBoundingClientRect().top) : (window.scrollY || 0)
    }

    const draw = (now) => {
      const t = now * 0.001
      const sc = getScroll()
      const light = theme === 'light'

      ctx.fillStyle = light ? '#eef2f8' : '#05060a'
      ctx.fillRect(0, 0, W, H)

      const LINE_SPACING = 14
      const numLines = Math.ceil(H / LINE_SPACING) + 6
      const scrollOffset = (sc * 0.04) % LINE_SPACING

      for (let row = 0; row < numLines; row++) {
        const baseY = row * LINE_SPACING - scrollOffset
        if (baseY < -LINE_SPACING * 2 || baseY > H + LINE_SPACING) continue

        const brightness = 0.5 + 0.5 * Math.sin(row * 0.19 + t * 0.35)
        const hue = 215 + Math.sin(row * 0.18 + t * 0.18) * 25

        // Check if this line is near the mouse — highlight it slightly
        const rowDist = Math.abs(baseY - mouse.y)
        const nearMouse = rowDist < MOUSE_R
        const mouseProx = nearMouse ? Math.max(0, 1 - rowDist / MOUSE_R) : 0

        const alpha = light
          ? (0.06 + brightness * 0.10 + mouseProx * 0.12)
          : (0.10 + brightness * 0.20 + mouseProx * 0.18)

        ctx.beginPath()
        // First point
        const y0 = baseY + noise(0, baseY, t) + mouseDisp(0, baseY)
        ctx.moveTo(-4, y0)

        for (let x = 0; x <= W + 4; x += 4) {
          const ny = noise(x, baseY, t)
          const my = mouseDisp(x, baseY)
          ctx.lineTo(x, baseY + ny + my)
        }

        ctx.strokeStyle = nearMouse
          ? `hsla(22,80%,${light ? 50 : 68}%,${alpha.toFixed(3)})`   // orange tint near mouse
          : `hsla(${hue.toFixed(1)},50%,${light ? 40 : 62}%,${alpha.toFixed(3)})`
        ctx.lineWidth = nearMouse ? 0.9 : 0.7
        ctx.stroke()
      }

      // Ambient gradient blob (static)
      const ag = ctx.createRadialGradient(W * 0.62, H * 0.42, 0, W * 0.62, H * 0.42, Math.min(W, H) * 0.55)
      ag.addColorStop(0, light ? 'rgba(232,82,11,0.04)' : 'rgba(232,82,11,0.05)')
      ag.addColorStop(0.5, light ? 'rgba(72,153,208,0.03)' : 'rgba(72,153,208,0.04)')
      ag.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = ag
      ctx.fillRect(0, 0, W, H)

      // Mouse halo glow — orange/amber radial at cursor
      if (mouse.x > 0) {
        const mg = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, MOUSE_R * 0.9)
        mg.addColorStop(0, light ? 'rgba(232,82,11,0.07)' : 'rgba(232,82,11,0.10)')
        mg.addColorStop(0.45, light ? 'rgba(232,82,11,0.025)' : 'rgba(232,82,11,0.04)')
        mg.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = mg
        ctx.fillRect(mouse.x - MOUSE_R, mouse.y - MOUSE_R, MOUSE_R * 2, MOUSE_R * 2)
      }

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
    }
  }, [theme])

  return (
    <canvas
      ref={cvRef}
      style={{ position: 'fixed', inset: 0, zIndex: 0, display: 'block', pointerEvents: 'none' }}
    />
  )
}
