import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const FULL_NAME = 'adrrien\nchandrakumar'
const TYPING_SPEED = 75

export default function Hero() {
  const { t } = useTranslation()
  const [displayed, setDisplayed] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [doneTyping, setDoneTyping] = useState(false)
  const idxRef = useRef(0)

  useEffect(() => {
    idxRef.current = 0
    setDisplayed('')
    setDoneTyping(false)
    const interval = setInterval(() => {
      if (idxRef.current < FULL_NAME.length) {
        setDisplayed(FULL_NAME.slice(0, idxRef.current + 1))
        idxRef.current++
      } else {
        clearInterval(interval)
        setTimeout(() => setDoneTyping(true), 800)
      }
    }, TYPING_SPEED)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const blink = setInterval(() => setShowCursor(c => !c), 520)
    return () => clearInterval(blink)
  }, [])

  const lines = displayed.split('\n')

  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '80px 48px 0',
      position: 'relative',
      zIndex: 1,
      maxWidth: 1100,
      margin: '0 auto',
    }}>
      {/* Subtle orange glow bottom right */}
      <div style={{
        position: 'absolute', bottom: '15%', right: '5%', width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(232,82,11,0.07) 0%, transparent 65%)',
        pointerEvents: 'none',
        filter: 'blur(20px)',
      }} />

      {/* Top label */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}
      >
        <div style={{ width: 28, height: 1, background: 'var(--accent)' }} />
        <span className="label">Portfolio · 2025</span>
      </motion.div>

      {/* Name — typewriter */}
      <div style={{ position: 'relative' }}>
        {lines.map((line, li) => (
          <h1 key={li} style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 'clamp(4rem, 10.5vw, 10rem)',
            fontWeight: 800,
            lineHeight: 0.92,
            letterSpacing: '-0.01em',
            textTransform: 'uppercase',
            color: 'var(--text)',
            display: 'block',
          }}>
            {line}
            {li === lines.length - 1 && (
              <span style={{
                display: 'inline-block',
                width: '0.055em', height: '0.8em',
                background: 'var(--accent)',
                marginLeft: '0.05em',
                verticalAlign: 'middle',
                borderRadius: 1,
                opacity: showCursor ? 1 : 0,
                transition: 'opacity 0.05s',
              }} />
            )}
          </h1>
        ))}
      </div>

      {/* Orange rule that draws after typing */}
      <motion.div
        style={{
          marginTop: 32,
          height: 2,
          background: 'var(--accent)',
          originX: 0,
          scaleX: doneTyping ? 1 : 0,
        }}
        animate={{ scaleX: doneTyping ? 1 : 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Subtitle + CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: doneTyping ? 1 : 0, y: doneTyping ? 0 : 16 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        style={{ marginTop: 36, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}
      >
        <p style={{
          fontSize: 'clamp(0.95rem, 1.6vw, 1.1rem)',
          color: 'var(--text-muted)',
          fontWeight: 400,
          maxWidth: 420,
          lineHeight: 1.65,
        }}>
          {t('hero.subtitle')}
        </p>

        <a href="#experience" style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '12px 28px',
          border: '1px solid var(--accent)',
          color: 'var(--accent)',
          textDecoration: 'none',
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          borderRadius: 2,
          transition: 'all 0.25s',
          background: 'transparent',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'var(--accent)'
          e.currentTarget.style.color = '#fff'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.color = 'var(--accent)'
        }}>
          {t('hero.cta')}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </a>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          opacity: doneTyping ? 0.3 : 0,
          transition: 'opacity 0.5s',
        }}
      >
        <span style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>scroll</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--accent)' }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </motion.div>
    </section>
  )
}
