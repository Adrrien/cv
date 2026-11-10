import { useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useAdmin } from '../context/AdminContext'

function initials(s) {
  if (!s) return '?'
  const w = s.trim().split(/\s+/)
  return ((w[0]?.[0] ?? '') + (w[1]?.[0] ?? '')).toUpperCase() || s[0].toUpperCase()
}

function LogoBadge({ item, accentColor }) {
  const SIZE = 52
  return (
    <div style={{ position: 'relative', flexShrink: 0, width: SIZE, height: SIZE }}>
      {/* Ambient glow */}
      <div aria-hidden style={{
        position: 'absolute', inset: -12,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${accentColor}60 0%, transparent 70%)`,
        filter: 'blur(12px)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'relative', zIndex: 1,
        width: SIZE, height: SIZE,
        borderRadius: '50%', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: item.logo ? 'var(--glass)' : accentColor,
        border: `1.5px solid ${accentColor}50`,
        backdropFilter: 'blur(6px)',
      }}>
        {item.logo
          ? <img src={item.logo} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 17, color: '#fff', letterSpacing: '0.04em' }}>
              {initials(item.org || '')}
            </span>
        }
      </div>
    </div>
  )
}

/* 3D tilt card — perspective transform on mouse move */
function TiltCard({ children, style, accentColor }) {
  const ref = useRef(null)

  const onMove = useCallback((e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width  - 0.5
    const y = (e.clientY - r.top)  / r.height - 0.5
    el.style.transform = `perspective(900px) rotateX(${-y * 5}deg) rotateY(${x * 6}deg) translateZ(6px)`
    el.style.boxShadow = `0 12px 48px rgba(0,0,0,0.28), 0 0 0 1px ${accentColor}22, inset 0 1px 0 rgba(255,255,255,0.06)`
  }, [accentColor])

  const onLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transform = ''
    el.style.boxShadow = ''
  }, [])

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

function TrackSection({ id, titleNum, titleText, titleColor, accentColor, items, kindLabel }) {
  const { i18n } = useTranslation()
  const isFr = i18n.language === 'fr'
  const listRef = useRef(null)
  const dotRef  = useRef(null)
  const rafRef  = useRef(null)

  useEffect(() => {
    const animate = () => {
      const list = listRef.current
      const dot  = dotRef.current
      if (list && dot) {
        const r = list.getBoundingClientRect()
        const center = window.innerHeight * 0.5
        let p = (center - r.top) / r.height
        p = Math.max(0, Math.min(1, p))
        const dotY = p * r.height
        dot.style.top = dotY + 'px'
        const nodes = list.querySelectorAll('[data-node]')
        const cards = list.querySelectorAll('[data-tl-card]')
        nodes.forEach((n, i) => {
          const nr  = n.getBoundingClientRect()
          const rel = nr.top - r.top + nr.height / 2
          const on  = rel <= dotY + 4
          n.style.background   = on ? accentColor : 'var(--bg)'
          n.style.borderColor  = on ? accentColor : 'var(--border)'
          n.style.boxShadow    = on ? `0 0 14px ${accentColor}88` : 'none'
          const c = cards[i]
          if (c) c.style.opacity = on ? '1' : '0.55'
        })
      }
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [accentColor])

  return (
    <section id={id} style={{ maxWidth: 920, margin: '0 auto', padding: '80px 40px 20px' }}>
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 56 }}
      >
        <span style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 13, letterSpacing: '0.42em',
          color: titleColor, flexShrink: 0,
        }}>
          {titleNum}
        </span>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${titleColor}40, transparent)` }} />
        <h2 style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 700,
          fontSize: 'clamp(36px, 5.5vw, 66px)',
          textTransform: 'uppercase',
          letterSpacing: '0.02em',
          color: 'var(--text)',
          order: -1,
        }}>
          {titleText}
        </h2>
      </motion.div>

      <div ref={listRef} style={{ position: 'relative', paddingLeft: 60 }}>
        {/* Timeline spine */}
        <div style={{
          position: 'absolute', left: 21, top: 10, bottom: 10,
          width: 1.5,
          background: `linear-gradient(to bottom, ${accentColor}00, ${accentColor}60 15%, ${accentColor}60 85%, ${accentColor}00)`,
        }} />
        {/* Animated scroll dot */}
        <div ref={dotRef} style={{
          position: 'absolute', left: 15, top: 0,
          width: 15, height: 15, borderRadius: '50%',
          background: accentColor, zIndex: 3,
          boxShadow: `0 0 0 3px var(--bg), 0 0 16px ${accentColor}`,
          animation: `pulseDot 2.2s ease-in-out infinite`,
        }} />

        {items.map((item, i) => (
          <motion.div
            key={item.id}
            data-tl-card
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.55, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'relative', marginBottom: 40, transition: 'opacity 0.4s' }}
          >
            {/* Timeline dot */}
            <div data-node style={{
              position: 'absolute', left: -44, top: 28,
              width: 13, height: 13, borderRadius: '50%',
              background: 'var(--bg)',
              border: '1.5px solid var(--border)',
              transition: 'all 0.4s', zIndex: 2,
            }} />

            <TiltCard accentColor={accentColor} style={{
              background: 'var(--glass)',
              border: '1px solid var(--glass-border)',
              borderLeft: `3px solid ${accentColor}`,
              borderRadius: 6,
              padding: '22px 24px 22px 22px',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}>
              {/* Top bar: logo + title */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 12 }}>
                <LogoBadge item={item} accentColor={accentColor} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 11, letterSpacing: '0.26em',
                    textTransform: 'uppercase',
                    color: accentColor, marginBottom: 2, opacity: 0.9,
                  }}>
                    {kindLabel}
                  </div>
                  <div style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 700, fontSize: 22, lineHeight: 1.08,
                    color: 'var(--text)',
                  }}>
                    {isFr ? item.title : (item.titleEn || item.title)}
                  </div>
                  <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 3 }}>
                    {item.org}
                  </div>
                </div>
                {/* Date badge */}
                <div style={{
                  flexShrink: 0,
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 11, letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 2,
                  padding: '4px 9px',
                  whiteSpace: 'nowrap',
                }}>
                  {item.date}
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: `linear-gradient(90deg, ${accentColor}30, transparent)`, marginBottom: 12 }} />

              <p style={{ fontSize: 15, lineHeight: 1.68, color: 'var(--text-muted)', textWrap: 'pretty' }}>
                {isFr ? item.desc : (item.descEn || item.desc)}
              </p>

              {item.tags?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 14 }}>
                  {item.tags.map(tag => (
                    <span key={tag} style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: 12, letterSpacing: '0.1em',
                      padding: '3px 10px',
                      border: `1px solid ${accentColor}35`,
                      borderRadius: 2,
                      color: accentColor,
                      background: `${accentColor}08`,
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default function Timeline() {
  const { t } = useTranslation()
  const { data } = useAdmin()

  return (
    <>
      <TrackSection
        id="experience"
        titleNum="01"
        titleText={t('timeline.experience_title')}
        titleColor="var(--accent)"
        accentColor="#E8520B"
        items={data.experiences}
        kindLabel={t('timeline.exp_label')}
      />
      <TrackSection
        id="education"
        titleNum="02"
        titleText={t('timeline.education_title')}
        titleColor="var(--blue)"
        accentColor="#4899D0"
        items={data.formations}
        kindLabel={t('timeline.edu_label')}
      />
    </>
  )
}
