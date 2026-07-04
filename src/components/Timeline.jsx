import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useAdmin } from '../context/AdminContext'

function initials(s) {
  if (!s) return '?'
  const w = s.trim().split(/\s+/)
  return ((w[0]?.[0] ?? '') + (w[1]?.[0] ?? '')).toUpperCase() || s[0].toUpperCase()
}

function LogoBadge({ item, accentColor }) {
  const SIZE = 56

  return (
    <div style={{ position: 'relative', flexShrink: 0, width: SIZE, height: SIZE }}>

      {item.logo && (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: -18,
            borderRadius: '50%',
            background: `url(${item.logo}) center / cover`,
            filter: 'blur(22px) saturate(180%)',
            opacity: 0.18,
            transform: 'scale(1.55)',
            pointerEvents: 'none',
          }}
        />
      )}

      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: -14,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accentColor}28 0%, ${accentColor}00 68%)`,
          filter: 'blur(10px)',
          pointerEvents: 'none',
        }}
      />

      <div style={{
        position: 'relative', zIndex: 1,
        width: SIZE, height: SIZE,
        borderRadius: '50%',
        overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: item.logo ? 'var(--glass)' : accentColor,
        border: `1.5px solid ${accentColor}55`,
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}>
        {item.logo
          ? <img
              src={item.logo}
              alt=""
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          : <span style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700, fontSize: 19, color: '#fff',
              letterSpacing: '0.04em',
            }}>
              {initials(item.org || '')}
            </span>
        }
      </div>
    </div>
  )
}

function TrackSection({ id, titleNum, titleText, titleColor, accentColor, items, kindLabel }) {
  const listRef = useRef(null)
  const dotRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    const animate = () => {
      const list = listRef.current
      const dot = dotRef.current
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
          const nr = n.getBoundingClientRect()
          const rel = nr.top - r.top + nr.height / 2
          const on = rel <= dotY + 4
          n.style.background = on ? accentColor : 'var(--bg)'
          n.style.borderColor = on ? accentColor : 'var(--border)'
          n.style.boxShadow = on ? `0 0 14px ${accentColor}88` : 'none'
          const c = cards[i]
          if (c) c.style.opacity = on ? '1' : '0.62'
        })
      }
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [accentColor])

  return (
    <section id={id} style={{ maxWidth: 920, margin: '0 auto', padding: '60px 40px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 18, marginBottom: 48 }}>
        <span style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 15,
          letterSpacing: '0.4em',
          color: titleColor,
        }}>
          {titleNum}
        </span>
        <h2 style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 700,
          fontSize: 'clamp(40px, 6vw, 72px)',
          textTransform: 'uppercase',
          letterSpacing: '0.02em',
          color: 'var(--text)',
        }}>
          {titleText}
        </h2>
      </div>

      <div ref={listRef} style={{ position: 'relative', paddingLeft: 64 }}>
        <div style={{
          position: 'absolute', left: 23, top: 8, bottom: 8,
          width: 2, background: 'var(--border)',
        }} />
        <div
          ref={dotRef}
          style={{
            position: 'absolute', left: 16, top: 0,
            width: 16, height: 16, borderRadius: '50%',
            background: accentColor, zIndex: 3,
            animation: 'pulseDot 2.2s ease-in-out infinite',
          }}
        />

        {items.map((item, i) => (
          <motion.div
            key={item.id}
            data-tl-card
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'relative',
              marginBottom: 44,
              background: 'var(--glass)',
              border: '1px solid var(--glass-border)',
              borderRadius: 6,
              padding: '24px 26px',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              transition: 'opacity 0.4s',
            }}
          >
            <div
              data-node
              style={{
                position: 'absolute', left: -49, top: 30,
                width: 14, height: 14, borderRadius: '50%',
                background: 'var(--bg)',
                border: '2px solid var(--border)',
                transition: 'all 0.4s', zIndex: 2,
              }}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
              <LogoBadge item={item} accentColor={accentColor} />
              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 12, letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                  color: accentColor, marginBottom: 3,
                }}>
                  {kindLabel}
                </div>
                <div style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 600, fontSize: 23, lineHeight: 1.05,
                  color: 'var(--text)',
                }}>
                  {item.title}
                </div>
                <div style={{ fontSize: 15, color: 'var(--text-muted)', marginTop: 2 }}>
                  {item.org}
                </div>
              </div>
            </div>

            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 13, letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)', marginBottom: 10,
            }}>
              {item.date}
            </div>

            <p style={{ fontSize: 15.5, lineHeight: 1.65, color: 'var(--text-muted)', textWrap: 'pretty' }}>
              {item.desc}
            </p>

            {item.tags?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
                {item.tags.map(tag => (
                  <span key={tag} style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 13, letterSpacing: '0.1em',
                    padding: '4px 10px',
                    border: '1px solid var(--border)',
                    borderRadius: 2,
                    color: 'var(--text-muted)',
                    background: 'var(--surface)',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
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
