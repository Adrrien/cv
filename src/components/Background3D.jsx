import { useEffect, useRef } from 'react'

export default function Background3D({ theme }) {
  const cvRef = useRef(null)

  useEffect(() => {
    const cv = cvRef.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    let W, H, dpr, raf

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

    const getScroll = () => {
      const hero = document.getElementById('hero-section')
      return hero ? Math.max(0, -hero.getBoundingClientRect().top) : (window.scrollY || 0)
    }

    const isLight = () => theme === 'light'

    const draw = (now) => {
      const t = now * 0.001
      const sc = getScroll()
      const light = isLight()

      ctx.fillStyle = light ? '#eef2f8' : '#05060a'
      ctx.fillRect(0, 0, W, H)

      const LINE_SPACING = 14
      const numLines = Math.ceil(H / LINE_SPACING) + 6
      const scrollOffset = (sc * 0.04) % LINE_SPACING

      for (let row = 0; row < numLines; row++) {
        const baseY = row * LINE_SPACING - scrollOffset
        if (baseY < -LINE_SPACING * 2 || baseY > H + LINE_SPACING) continue
        const brightness = 0.5 + 0.5 * Math.sin(row * 0.19 + t * 0.35)
        ctx.beginPath()
        ctx.moveTo(-4, baseY + noise(0, baseY, t))
        for (let x = 0; x <= W + 4; x += 4) {
          ctx.lineTo(x, baseY + noise(x, baseY, t))
        }
        const hue = 215 + Math.sin(row * 0.18 + t * 0.18) * 25
        const alpha = light
          ? (0.06 + brightness * 0.10)
          : (0.10 + brightness * 0.20)
        ctx.strokeStyle = `hsla(${hue.toFixed(1)},50%,${light ? 40 : 62}%,${alpha.toFixed(3)})`
        ctx.lineWidth = 0.7
        ctx.stroke()
      }

      const ag = ctx.createRadialGradient(W * 0.62, H * 0.42, 0, W * 0.62, H * 0.42, Math.min(W, H) * 0.55)
      ag.addColorStop(0, light ? 'rgba(232,82,11,0.04)' : 'rgba(232,82,11,0.05)')
      ag.addColorStop(0.5, light ? 'rgba(72,153,208,0.03)' : 'rgba(72,153,208,0.04)')
      ag.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = ag
      ctx.fillRect(0, 0, W, H)

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [theme])

  return (
    <canvas
      ref={cvRef}
      style={{ position: 'fixed', inset: 0, zIndex: 0, display: 'block', pointerEvents: 'none' }}
    />
  )
}
