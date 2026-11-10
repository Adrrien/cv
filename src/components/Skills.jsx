import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useAdmin } from '../context/AdminContext'

const PALETTE = ['#E8520B', '#4899D0', '#1f6b9e', '#b8430a', '#3a7bbf', '#d04c0a']

export default function Skills() {
  const { t } = useTranslation()
  const { data } = useAdmin()

  const groups = []
  const map = {}
  data.skills.forEach((s) => {
    if (!map[s.category]) {
      map[s.category] = {
        category: s.category,
        color: PALETTE[Object.keys(map).length % PALETTE.length],
        items: [],
      }
      groups.push(map[s.category])
    }
    map[s.category].items.push(s)
  })

  return (
    <section id="skills" style={{ maxWidth: 920, margin: '0 auto', padding: '80px 40px 60px' }}>
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 56 }}
      >
        <h2 style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 700,
          fontSize: 'clamp(36px, 5.5vw, 66px)',
          textTransform: 'uppercase',
          letterSpacing: '0.02em',
          color: 'var(--text)',
        }}>
          {t('skills.title')}
        </h2>
        <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, var(--blue)40, transparent)' }} />
        <span style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 13, letterSpacing: '0.42em',
          color: 'var(--blue)',
        }}>
          03
        </span>
      </motion.div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: 20,
      }}>
        {groups.map((group, gi) => (
          <motion.div
            key={group.category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: gi * 0.07, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: 'var(--glass)',
              border: '1px solid var(--glass-border)',
              borderTop: `2px solid ${group.color}`,
              borderRadius: 6,
              padding: '20px 20px 18px',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
          >
            {/* Category label */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              marginBottom: 14,
            }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%',
                background: group.color, flexShrink: 0,
              }} />
              <span style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 12, letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: group.color,
              }}>
                {group.category}
              </span>
            </div>

            {/* Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {group.items.map(sk => (
                <Chip key={sk.id} label={sk.name} color={group.color} />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function Chip({ label, color }) {
  return (
    <span
      style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: 14, letterSpacing: '0.06em',
        padding: '5px 13px',
        border: '1px solid var(--border)',
        borderRadius: 2,
        background: 'var(--surface)',
        color: 'var(--text)',
        cursor: 'default',
        transition: 'border-color 0.2s, color 0.2s, background 0.2s',
        display: 'inline-block',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = color
        e.currentTarget.style.color = color
        e.currentTarget.style.background = `${color}0d`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.color = 'var(--text)'
        e.currentTarget.style.background = 'var(--surface)'
      }}
    >
      {label}
    </span>
  )
}
