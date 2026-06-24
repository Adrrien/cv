import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useTranslation } from 'react-i18next'

// Each card is driven by the global scrollYProgress of the section
function ExpCard({ item, index, total, scrollYProgress }) {
  const t0 = index / (total + 0.5)
  const t1 = t0 + 0.22

  const opacity = useTransform(scrollYProgress, [t0, t1], [0, 1])
  const x = useTransform(scrollYProgress, [t0, t1], [-32, 0])

  return (
    <motion.div style={{ opacity, x, marginBottom: 28 }}>
      <Card accent="var(--accent)">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
          <div>
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
      </Card>
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
      <Card accent="var(--blue)">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
          <div>
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
      </Card>
    </motion.div>
  )
}

function Card({ children, accent }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderLeft: `2px solid ${accent}`,
      borderRadius: 3,
      padding: '20px 22px',
      transition: 'all 0.25s',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.background = 'var(--surface-hover)'
      e.currentTarget.style.borderLeftColor = accent
      e.currentTarget.style.transform = 'translateX(4px)'
    }}
    onMouseLeave={e => {
      e.currentTarget.style.background = 'var(--surface)'
      e.currentTarget.style.transform = 'translateX(0)'
    }}
    >
      {children}
    </div>
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

function ColumnDot({ index, total, scrollYProgress, color }) {
  const t0 = index / (total + 0.5)
  const opacity = useTransform(scrollYProgress, [t0, t0 + 0.1], [0.2, 1])
  const scale = useTransform(scrollYProgress, [t0, t0 + 0.1], [0.4, 1])

  return (
    <motion.div style={{
      position: 'absolute',
      left: -4, top: 24 + index * (100 / total) + '%',
      width: 9, height: 9,
      borderRadius: '50%',
      background: color,
      opacity,
      scale,
      boxShadow: `0 0 10px ${color}88`,
      zIndex: 2,
    }} />
  )
}

export default function Timeline() {
  const { t } = useTranslation()
  const experiences = t('experiences', { returnObjects: true })
  const education = t('education', { returnObjects: true })

  const sectionRef = useRef()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 85%', 'end 20%'],
  })

  const total = Math.max(experiences.length, education.length)

  return (
    <section
      ref={sectionRef}
      style={{ position: 'relative', zIndex: 1, padding: '140px 48px 140px', maxWidth: 1100, margin: '0 auto' }}
    >
      {/* Section header */}
      <div style={{ marginBottom: 72 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{ width: 28, height: 1, background: 'var(--accent)' }} />
          <span className="label">Parcours</span>
        </div>
      </div>

      {/* Two columns */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '0 72px',
        alignItems: 'start',
      }}>
        {/* Experiences */}
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
          <div style={{ position: 'relative', paddingLeft: 20 }}>
            <ProgressLine scrollYProgress={scrollYProgress} color="var(--accent)" />
            {experiences.map((item, i) => (
              <ExpCard
                key={i}
                item={item}
                index={i}
                total={total}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>

        {/* Education */}
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
          <div style={{ position: 'relative', paddingLeft: 20 }}>
            <ProgressLine scrollYProgress={scrollYProgress} color="var(--blue)" />
            {education.map((item, i) => (
              <EduCard
                key={i}
                item={item}
                index={i}
                total={total}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
