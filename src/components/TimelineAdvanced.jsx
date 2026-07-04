import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useAdmin } from '../context/AdminContext'

function ScrollingDot({ scrollYProgress, color }) {
  const y = useTransform(scrollYProgress, [0, 1], [0, 100])

  return (
    <motion.div style={{
      position: 'absolute',
      left: -8,
      top: 0,
      width: 16,
      height: 16,
      borderRadius: '50%',
      background: color,
      boxShadow: `0 0 20px ${color}bb, inset 0 0 10px ${color}66`,
      y,
      zIndex: 4,
    }} />
  )
}

function LogoBadge({ item, accent }) {
  const [imageError, setImageError] = useState(false)

  return (
    <div style={{
      flex: 'none',
      width: 52,
      height: 52,
      borderRadius: '50%',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: item.badgeBg || accent,
      border: `2px solid ${accent}`,
      fontFamily: "'Barlow Condensed', sans-serif",
      fontWeight: 700,
      fontSize: 18,
      color: '#fff',
      letterSpacing: '0.04em',
      flexShrink: 0,
    }}>
      {item.logo && !imageError ? (
        <img
          src={item.logo}
          alt={item.company || item.school}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={() => setImageError(true)}
        />
      ) : (
        <span>{item.initials || (item.company || item.school).charAt(0).toUpperCase()}</span>
      )}
    </div>
  )
}

function ExpCard({ item, index, total, scrollYProgress }) {
  const t0 = index / (total + 0.5)
  const t1 = t0 + 0.22

  const opacity = useTransform(scrollYProgress, [t0, t1], [0, 1])
  const x = useTransform(scrollYProgress, [t0, t1], [-32, 0])

  return (
    <motion.div style={{ opacity, x, marginBottom: 28 }}>
      <div style={{
        position: 'relative',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderLeft: '2px solid var(--accent)',
        borderRadius: 3,
        padding: '20px 22px',
        transition: 'all 0.25s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'var(--surface-hover)'
        e.currentTarget.style.transform = 'translateX(4px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'var(--surface)'
        e.currentTarget.style.transform = 'translateX(0)'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 14 }}>
          <LogoBadge item={item} accent="var(--accent)" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 3 }}>
              Expérience
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', lineHeight: 1.3, marginBottom: 3 }}>
              {item.title}
            </h3>
            <span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 500 }}>{item.company}</span>
          </div>
          <span style={{
            fontSize: 11, color: 'var(--text-muted)',
            fontFamily: "'JetBrains Mono', monospace",
            whiteSpace: 'nowrap', paddingTop: 2,
          }}>
            {item.period}
          </span>
        </div>
        <p style={{ marginTop: 12, fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.7 }}>
          {item.description}
        </p>
        {item.tags && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14 }}>
            {item.tags.map(tag => (
              <span key={tag} style={{
                fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
                textTransform: 'uppercase', padding: '3px 8px',
                border: '1px solid rgba(232,82,11,0.3)',
                color: 'var(--accent)', borderRadius: 2,
              }}>{tag}</span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

function EduCard({ item, index, total, scrollYProgress }) {
  const t0 = index / (total + 0.5)
  const t1 = t0 + 0.22

  const opacity = useTransform(scrollYProgress, [t0, t1], [0, 1])
  const x = useTransform(scrollYProgress, [t0, t1], [32, 0])

  return (
    <motion.div style={{ opacity, x, marginBottom: 28 }}>
      <div style={{
        position: 'relative',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderLeft: '2px solid var(--blue)',
        borderRadius: 3,
        padding: '20px 22px',
        transition: 'all 0.25s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'var(--surface-hover)'
        e.currentTarget.style.transform = 'translateX(-4px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'var(--surface)'
        e.currentTarget.style.transform = 'translateX(0)'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 14 }}>
          <LogoBadge item={item} accent="var(--blue)" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--blue)', marginBottom: 3 }}>
              Formation
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', lineHeight: 1.3, marginBottom: 3 }}>
              {item.degree}
            </h3>
            <span style={{ fontSize: 13, color: 'var(--blue)', fontWeight: 500 }}>{item.school}</span>
          </div>
          <span style={{
            fontSize: 11, color: 'var(--text-muted)',
            fontFamily: "'JetBrains Mono', monospace",
            whiteSpace: 'nowrap', paddingTop: 2,
          }}>
            {item.period}
          </span>
        </div>
        <p style={{ marginTop: 12, fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.7 }}>
          {item.description}
        </p>
      </div>
    </motion.div>
  )
}

function ProgressLine({ scrollYProgress, color }) {
  const scaleY = useTransform(scrollYProgress, [0, 0.95], [0, 1])
  return (
    <div style={{
      position: 'absolute', left: 0, top: 0, bottom: 0, width: 1,
      background: 'var(--border)',
      transformOrigin: 'top',
    }}>
      <motion.div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: '100%',
        background: color,
        transformOrigin: 'top',
        scaleY,
        boxShadow: `0 0 8px ${color}55`,
      }} />
    </div>
  )
}

export default function Timeline() {
  const { t } = useTranslation()
  const { data } = useAdmin()
  const experiences = Array.isArray(data?.experiences) ? data.experiences : []
  const education = Array.isArray(data?.formations) ? data.formations : []

  const sectionRef = useRef()
  const listRefExp = useRef()
  const listRefEdu = useRef()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 85%', 'end 20%'],
  })

  const totalExp = experiences.length
  const totalEdu = education.length

  return (
    <section
      ref={sectionRef}
      style={{ position: 'relative', zIndex: 1, padding: '140px 48px 140px', maxWidth: 1100, margin: '0 auto' }}
    >
      <div style={{ marginBottom: 72 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{ width: 28, height: 1, background: 'var(--accent)' }} />
          <span className="label">Parcours</span>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(620px, 1fr))',
        gap: '0 72px',
        alignItems: 'start',
      }}>

        <div id="experience">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36 }}>
            <span style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 28, fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              color: 'var(--text)',
            }}>
              {t('timeline.experience_title')}
            </span>
          </div>
          <div ref={listRefExp} style={{ position: 'relative', paddingLeft: 20 }}>
            <ProgressLine scrollYProgress={scrollYProgress} color="var(--accent)" />
            <ScrollingDot scrollYProgress={scrollYProgress} color="var(--accent)" />
            {experiences.map((item, i) => (
              <ExpCard
                key={i}
                item={{
                  ...item,
                  company: item.org,
                  period: item.date,
                  description: item.desc,
                }}
                index={i}
                total={totalExp}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>

        <div id="education">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36 }}>
            <span style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 28, fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              color: 'var(--text)',
            }}>
              {t('timeline.education_title')}
            </span>
          </div>
          <div ref={listRefEdu} style={{ position: 'relative', paddingLeft: 20 }}>
            <ProgressLine scrollYProgress={scrollYProgress} color="var(--blue)" />
            <ScrollingDot scrollYProgress={scrollYProgress} color="var(--blue)" />
            {education.map((item, i) => (
              <EduCard
                key={i}
                item={{
                  ...item,
                  degree: item.title,
                  school: item.org,
                  period: item.date,
                  description: item.desc,
                }}
                index={i}
                total={totalEdu}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
